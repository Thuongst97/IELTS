/* =========================================================================
   IELTS 7.0 Academy — quiz engine
   One engine for every practice set on the site.

   new IELTS.Quiz(host, {
     id: "listening:full",                 // results + draft storage key
     title: "Listening practice test",
     table: "listening" | "reading-ac" | null,   // raw → band conversion
     timer: { minutes: 60, label: "Time" },      // optional
     groups: [{
       title, instr, context (html), box: { title, items: [["A","text"], …] },
       notes: "Heading"  (renders questions as a notes/form card),
       mount: Element    (render this group somewhere else on the page),
       questions: [
         { n: 1,  type: "gap",    text: "Surname: {}", answer: ["lindqvist"], why: "…" },
         { n: 11, type: "mcq",    text: "…", options: [["A","…"],["B","…"]], answer: "C" },
         { n: 5,  type: "tfng",   text: "…", answer: "NOT GIVEN", mode: "tf" | "yn" },
         { n: 15, type: "select", text: "Visitor centre {}", answer: "A", options?: ["A","B",…] },
         { n: [21, 22], type: "multi", text: "…", options: [["A","…"],…], answer: ["B","E"] },
       ],
     }],
     review: { kind: "listening" | "reading", source },   // optional answer review
     reviewMount: Element,                               // where to show it
     onCheck(result), onReset()
   })
   After marking, the answers are kept as "attempt:<id>" so the review can be
   reopened later ("Show my last attempt").
   ========================================================================= */
(function () {
  "use strict";
  const { $, $$, esc, norm, store, toast, rawToBand, fmtBand, saveResult, Timer } = window.IELTS;

  /** Lenient comparison used by IELTS markers: case, spacing, punctuation, articles and currency symbols don't matter. */
  function clean(s) {
    return norm(s)
      .replace(/[“”"'’‘.,!?;:()£$€%]/g, "")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^(the|a|an) /, "");
  }
  const compact = (s) => clean(s).replace(/\s+/g, "");
  const matches = (given, answers) => {
    const g = compact(given);
    return !!g && answers.some((a) => compact(a) === g);
  };

  let uidSeq = 0;
  const TFNG = { tf: ["TRUE", "FALSE", "NOT GIVEN"], yn: ["YES", "NO", "NOT GIVEN"] };
  const qKey = (q) => (Array.isArray(q.n) ? q.n.join("-") : String(q.n));
  const qLabel = (q) => (Array.isArray(q.n) ? `${q.n[0]}–${q.n[q.n.length - 1]}` : q.n);
  const marksOf = (q) => (q.type === "multi" ? q.answer.length : 1);

  class Quiz {
    constructor(host, spec) {
      this.host = host;
      this.spec = spec;
      this.uid = "qz" + ++uidSeq;
      this.questions = spec.groups.flatMap((g) => g.questions);
      this.total = this.questions.reduce((s, q) => s + marksOf(q), 0);
      this.checked = false;
      this.render();
      const hadDraft = this.restore();
      this.updateCount();
      if (!hadDraft) this.offerLastAttempt();
    }

    /* ------------------------------------------------ rendering */
    render() {
      const s = this.spec;
      this.host.classList.add("quiz");
      this.host.innerHTML = `
        <div class="quiz-bar">
          <span class="qb-title">${esc(s.title || "Practice")}</span>
          <span class="qb-count"></span>
          <span class="spacer"></span>
          <span class="qb-timer"></span>
          <button class="btn sm primary" data-act="check" type="button">✓ Check answers</button>
          <button class="btn sm ghost" data-act="reset" type="button" title="Clear all answers">⟲ Reset</button>
        </div>
        <div class="quiz-last small" hidden></div>
        <div class="quiz-result glass" aria-live="polite"></div>
        <div class="qgroups"></div>
        <div class="quiz-review" hidden></div>`;
      this.reviewHost = s.reviewMount || $(".quiz-review", this.host);
      const groupsHost = $(".qgroups", this.host);
      s.groups.forEach((g) => {
        const el = this.renderGroup(g);
        (g.mount || groupsHost).appendChild(el);
      });
      if (s.timer) this.timer = new Timer($(".qb-timer", this.host), { minutes: s.timer.minutes, label: s.timer.label || "Time", warnAt: s.timer.warnAt || 300 });
      this.host.addEventListener("click", (e) => {
        const b = e.target.closest("[data-act]");
        if (!b || !this.host.contains(b)) return;
        if (b.dataset.act === "check") this.check();
        if (b.dataset.act === "reset") this.reset();
        if (b.dataset.act === "review") this.reviewHost.scrollIntoView({ behavior: "smooth", block: "start" });
        if (b.dataset.act === "last") this.showLastAttempt();
      });
    }

    renderGroup(g) {
      const el = document.createElement("div");
      el.className = "qgroup glass";
      let html = "";
      if (g.title) html += `<h4>${g.title}</h4>`;
      if (g.instr) html += `<p class="qinstr">${g.instr}</p>`;
      if (g.context) html += `<div class="qcontext">${g.context}</div>`;
      if (g.box) {
        html += `<div class="qbox">${g.box.title ? `<h5>${esc(g.box.title)}</h5>` : ""}<ul>${g.box.items.map(([l, t]) => `<li><span class="ol">${esc(l)}</span><span>${t}</span></li>`).join("")}</ul></div>`;
      }
      const qs = g.questions.map((q) => this.renderQ(q, g)).join("");
      html += g.notes ? `<div class="notes-form"><h5>${g.notes}</h5><div class="qlist">${qs}</div></div>` : `<div class="qlist">${qs}</div>`;
      el.innerHTML = html;
      el.addEventListener("input", () => { this.saveDraft(); this.updateCount(); });
      el.addEventListener("change", (e) => {
        // "Choose TWO": block a third tick
        const box = e.target.closest(".q[data-type='multi']");
        if (box && e.target.type === "checkbox") {
          const lim = +box.dataset.limit;
          const ticked = $$("input:checked", box);
          if (ticked.length > lim) { e.target.checked = false; toast(`Choose only ${lim} options.`); }
        }
        this.saveDraft(); this.updateCount();
      });
      return el;
    }

    renderQ(q, g) {
      const key = qKey(q), name = `${this.uid}-${key}`;
      let body = "";
      const text = q.text || "";
      if (q.type === "gap") {
        const inp = `<input class="gap" type="text" data-k="${key}" aria-label="Answer ${key}" autocomplete="off" spellcheck="false">`;
        body = `<div class="qp">${text.includes("{}") ? text.replace("{}", inp) : text + " " + inp}</div>`;
      } else if (q.type === "select") {
        const letters = q.options || (g.box ? g.box.items.map((i) => i[0]) : []);
        const sel = `<select class="sel" data-k="${key}" aria-label="Answer ${key}"><option value="">—</option>${letters.map((l) => `<option>${esc(l)}</option>`).join("")}</select>`;
        body = `<div class="qp">${text.includes("{}") ? text.replace("{}", sel) : text + " " + sel}</div>`;
      } else if (q.type === "tfng") {
        const opts = TFNG[q.mode || "tf"];
        body = `<div class="qp"><span class="qtext">${text}</span><div class="opts inline">${opts.map((o) => `<label class="opt"><input type="radio" name="${name}" value="${o}" data-k="${key}"><span>${o}</span></label>`).join("")}</div></div>`;
      } else if (q.type === "mcq" || q.type === "multi") {
        const t = q.type === "mcq" ? "radio" : "checkbox";
        body = `<div class="qp"><span class="qtext">${text}</span><div class="opts">${q.options.map(([l, o]) => `<label class="opt" data-l="${esc(l)}"><input type="${t}" name="${name}" value="${esc(l)}" data-k="${key}"><span><span class="ol">${esc(l)}</span> ${o}</span></label>`).join("")}</div></div>`;
      }
      return `<div class="q" data-k="${key}" data-type="${q.type}" ${q.type === "multi" ? `data-limit="${q.answer.length}"` : ""}>
        <span class="qn">${qLabel(q)}</span><div>${body}<div class="fb"></div></div></div>`;
    }

    /* ------------------------------------------------ state */
    allQEls() {
      const roots = [this.host, ...this.spec.groups.filter((g) => g.mount).map((g) => g.mount)];
      return roots.flatMap((r) => $$(".q", r));
    }
    elFor(q) { return this.allQEls().find((e) => e.dataset.k === qKey(q)); }
    valueOf(q) {
      const el = this.elFor(q);
      if (!el) return q.type === "multi" ? [] : "";
      if (q.type === "gap") return $("input", el).value;
      if (q.type === "select") return $("select", el).value;
      if (q.type === "multi") return $$("input:checked", el).map((i) => i.value);
      const r = $("input:checked", el);
      return r ? r.value : "";
    }
    answered() {
      return this.questions.reduce((s, q) => {
        const v = this.valueOf(q);
        return s + (q.type === "multi" ? v.length : v && String(v).trim() ? 1 : 0);
      }, 0);
    }
    updateCount() {
      const c = $(".qb-count", this.host);
      if (c) c.textContent = `${this.answered()} / ${this.total} answered`;
    }
    saveDraft() {
      if (!this.spec.id || this.checked) return;
      const last = $(".quiz-last", this.host);
      if (last) last.hidden = true;
      const d = {};
      this.questions.forEach((q) => { d[qKey(q)] = this.valueOf(q); });
      store.set("draft:" + this.spec.id, d);
    }
    restore(from) {
      if (!this.spec.id && !from) return false;
      const d = from || store.get("draft:" + this.spec.id, null);
      if (!d) return false;
      this.questions.forEach((q) => {
        const v = d[qKey(q)], el = this.elFor(q);
        if (v == null || !el) return;
        if (q.type === "gap") $("input", el).value = v;
        else if (q.type === "select") $("select", el).value = v;
        else if (q.type === "multi") $$("input", el).forEach((i) => { i.checked = v.includes(i.value); });
        else $$("input", el).forEach((i) => { i.checked = i.value === v; });
      });
      return true;
    }
    answers() {
      const d = {};
      this.questions.forEach((q) => { d[qKey(q)] = this.valueOf(q); });
      return d;
    }
    offerLastAttempt() {
      const a = this.spec.id && store.get("attempt:" + this.spec.id, null);
      const box = $(".quiz-last", this.host);
      if (!a || !box) return;
      box.innerHTML = `📋 You submitted this test on <b>${esc(new Date(a.date).toLocaleDateString())}</b> (${a.raw}/${a.total}${a.band != null ? `, band ${fmtBand(a.band)}` : ""}). <button class="btn sm" type="button" data-act="last">Show my answers &amp; explanations</button> <span class="muted">or just start answering to try again.</span>`;
      box.hidden = false;
    }
    showLastAttempt() {
      const a = store.get("attempt:" + this.spec.id, null);
      if (!a) return;
      this.restore(a.answers);
      this.updateCount();
      this.check({ silent: true });
    }

    /* ------------------------------------------------ marking */
    check(opts = {}) {
      let raw = 0;
      const wrong = [], details = [];
      const groupOf = new Map();
      this.spec.groups.forEach((g) => g.questions.forEach((q) => groupOf.set(q, g)));
      this.questions.forEach((q) => {
        const el = this.elFor(q);
        const v = this.valueOf(q);
        let ok, got = 1, keyText;
        if (q.type === "gap") { ok = matches(v, q.answer); keyText = q.answer[0]; }
        else if (q.type === "multi") {
          got = v.filter((x) => q.answer.includes(x)).length;
          ok = got === q.answer.length;
          keyText = q.answer.join(" and ");
          $$(".opt", el).forEach((o) => o.classList.toggle("is-key", q.answer.includes(o.dataset.l)));
        } else {
          ok = String(v).toUpperCase() === String(q.answer).toUpperCase(); keyText = q.answer;
          if (q.type === "mcq") $$(".opt", el).forEach((o) => o.classList.toggle("is-key", o.dataset.l === q.answer));
        }
        raw += q.type === "multi" ? got : ok ? 1 : 0;
        if (!ok) wrong.push(qLabel(q));
        details.push({ q, group: groupOf.get(q), given: v, ok, got: q.type === "multi" ? got : ok ? 1 : 0 });
        el.classList.toggle("correct", ok);
        el.classList.toggle("wrong", !ok);
        const alt = q.type === "gap" && q.answer.length > 1 ? ` <span class="muted">(also accepted: ${q.answer.slice(1).map(esc).join(" / ")})</span>` : "";
        $(".fb", el).innerHTML = `${ok ? "✅" : "❌"} Answer: <span class="key">${esc(keyText)}</span>${alt}${q.type === "multi" && !ok ? ` <span class="muted">(you scored ${got}/${q.answer.length})</span>` : ""}${q.why ? `<div class="why">${q.why}</div>` : ""}`;
      });
      this.checked = true;
      if (this.timer && this.timer.running) this.timer.pause();
      const s = this.spec;
      const band = s.table ? rawToBand(raw, this.total, s.table) : null;
      const pct = Math.round((raw / this.total) * 100);
      const res = { raw, total: this.total, band, pct };
      if (s.id && !opts.silent) {
        saveResult(s.id, res);
        store.set("attempt:" + s.id, { answers: this.answers(), date: new Date().toISOString(), raw, total: this.total, band });
      }
      this.details = details;
      const last = $(".quiz-last", this.host);
      if (last) last.hidden = true;
      if (s.review && window.IELTS.Review) window.IELTS.Review.render(this.reviewHost, details, s.review);
      this.showResult(res, wrong, opts.silent);
      if (s.onCheck) s.onCheck(res);
      if (s.id) store.del("draft:" + s.id);
    }

    showResult({ raw, total, band, pct }, wrong, silent) {
      const box = $(".quiz-result", this.host);
      const s = this.spec;
      const target = s.table === "reading-gt" ? 34 : 30;
      let msg;
      if (band != null) {
        const scaledTarget = Math.ceil((target / 40) * total);
        msg = band >= 7
          ? `<b class="c-green">On target for Band 7.</b> Keep reviewing every mistake — at 7.0 the difference is usually 2–3 careless answers.`
          : `<b class="c-amber">${Math.max(0, scaledTarget - raw)} more correct answer(s) to reach Band 7.</b> Review the explanations below, then redo the questions you missed without looking.`;
      } else {
        msg = pct >= 80 ? `<b class="c-green">Excellent — ${pct}%.</b> This area is close to Band 7 standard.` : pct >= 60 ? `<b class="c-amber">${pct}% — getting there.</b> Read each explanation and note the pattern behind your mistakes.` : `<b class="c-red">${pct}% — this needs focused practice.</b> Re-study the lesson above, then try again.`;
      }
      const time = this.timer ? `<span class="badge gray">⏱ ${Math.floor(this.timer.elapsed() / 60)} min used</span>` : "";
      box.innerHTML = `
        <div class="qr-band ${band == null ? "" : band >= 7 ? "ok" : "low"}"><div>${band != null ? `<b>${fmtBand(band)}</b><small>est. band</small>` : `<b>${pct}%</b><small>score</small>`}</div></div>
        <div><h4>${raw} / ${total} correct</h4><p style="margin:0 0 8px">${msg}</p>
        ${silent ? `<p class="small muted" style="margin:0 0 8px">Showing your last submitted attempt. Press Reset to try again.</p>` : ""}
        <div class="row">${this.spec.review ? `<button class="btn sm primary" type="button" data-act="review">📋 Answers &amp; explanations ↓</button>` : ""}${time}${wrong.length ? `<span class="badge red">Missed: ${wrong.slice(0, 18).join(", ")}${wrong.length > 18 ? "…" : ""}</span>` : `<span class="badge green">Perfect score</span>`}</div></div>`;
      box.classList.add("show");
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    reset() {
      this.allQEls().forEach((el) => {
        el.classList.remove("correct", "wrong");
        $$("input", el).forEach((i) => { if (i.type === "text") i.value = ""; else i.checked = false; });
        $$("select", el).forEach((s) => { s.value = ""; });
        $$(".opt", el).forEach((o) => o.classList.remove("is-key"));
        $(".fb", el).innerHTML = "";
      });
      $(".quiz-result", this.host).classList.remove("show");
      if (this.reviewHost) { this.reviewHost.innerHTML = ""; this.reviewHost.hidden = true; }
      this.checked = false;
      if (this.timer) this.timer.reset();
      store.del("draft:" + this.spec.id);
      this.updateCount();
      if (this.spec.onReset) this.spec.onReset();
    }
  }

  window.IELTS.Quiz = Quiz;
  window.IELTS.answerMatches = matches;
})();
