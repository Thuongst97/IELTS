/* =========================================================================
   IELTS 7.0 Academy — shared test runners
   - IELTS.Charts            : line / bar / pie / table / process visuals (Writing Task 1)
   - IELTS.ListeningRunner   : TTS player + transcripts + 40-question quiz
   - IELTS.ReadingRunner     : split-screen passages + timed 40-question quiz
   Used by the skill pages and by the Practice Tests module.
   ========================================================================= */
(function () {
  "use strict";
  const { $, $$, esc, TTS, toast, initTabs } = window.IELTS;

  /* ================================================== Charts */
  const COLORS = ["#70cff8", "#d4af37", "#a78bfa", "#34d399", "#f472b6", "#fb923c"];
  const legend = (names) => `<div class="ch-legend">${names.map((n, i) => `<span><i style="background:${COLORS[i % COLORS.length]}"></i>${esc(n)}</span>`).join("")}</div>`;
  function axes(W, H, P, max, step, min = 0) {
    let g = "";
    for (let v = min; v <= max + 1e-9; v += step) {
      const y = H - P.b - ((v - min) / (max - min)) * (H - P.t - P.b);
      g += `<line class="${v !== min ? "ch-grid" : "ch-axis"}" x1="${P.l}" x2="${W - P.r}" y1="${y}" y2="${y}"/><text class="ch-tick" x="${P.l - 8}" y="${y + 4}" text-anchor="end">${+v.toFixed(2)}</text>`;
    }
    return g;
  }
  const Charts = {
    line(d) {
      const W = 640, H = 300, P = { l: 48, r: 20, t: 16, b: 34 }, min = d.min || 0;
      const xs = (i) => P.l + (i / (d.x.length - 1)) * (W - P.l - P.r);
      const ys = (v) => H - P.b - ((v - min) / (d.max - min)) * (H - P.t - P.b);
      let s = axes(W, H, P, d.max, d.step, min);
      d.x.forEach((x, i) => { s += `<text class="ch-tick" x="${xs(i)}" y="${H - 12}" text-anchor="middle">${esc(x)}</text>`; });
      d.series.forEach(([name, vals], k) => {
        const c = COLORS[k % COLORS.length];
        s += `<polyline class="ch-line" stroke="${c}" points="${vals.map((v, i) => `${xs(i)},${ys(v)}`).join(" ")}"/>`;
        vals.forEach((v, i) => { s += `<circle cx="${xs(i)}" cy="${ys(v)}" r="3.5" fill="${c}"><title>${esc(name)} ${esc(d.x[i])}: ${v}</title></circle>`; });
      });
      return `<h5>${esc(d.title)}</h5><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(d.title)}">${s}</svg>${legend(d.series.map((x) => x[0]))}`;
    },
    bar(d) {
      const W = 640, H = 300, P = { l: 48, r: 20, t: 18, b: 34 };
      const groupW = (W - P.l - P.r) / d.x.length, bw = Math.min(46, (groupW - 18) / d.series.length);
      const ys = (v) => H - P.b - (v / d.max) * (H - P.t - P.b);
      let s = axes(W, H, P, d.max, d.step);
      d.x.forEach((x, i) => {
        const gx = P.l + i * groupW + (groupW - bw * d.series.length) / 2;
        d.series.forEach(([name, vals], k) => {
          const v = vals[i];
          s += `<rect x="${gx + k * bw}" y="${ys(v)}" width="${bw - 4}" height="${H - P.b - ys(v)}" rx="3" fill="${COLORS[k % COLORS.length]}"><title>${esc(name)} ${esc(x)}: ${v}</title></rect>`;
          s += `<text class="ch-tick" x="${gx + k * bw + (bw - 4) / 2}" y="${ys(v) - 5}" text-anchor="middle" style="font-size:10px">${v}</text>`;
        });
        s += `<text class="ch-tick" x="${P.l + i * groupW + groupW / 2}" y="${H - 12}" text-anchor="middle">${esc(x)}</text>`;
      });
      return `<h5>${esc(d.title)}</h5><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(d.title)}">${s}</svg>${legend(d.series.map((x) => x[0]))}`;
    },
    pie(d) {
      const R = 82, names = d.pies[0].slices.map((s) => s[0]);
      const one = (p) => {
        const total = p.slices.reduce((a, s) => a + s[1], 0);
        let a0 = -Math.PI / 2, out = "";
        p.slices.forEach(([n, v], i) => {
          const a1 = a0 + (v / total) * Math.PI * 2;
          const large = a1 - a0 > Math.PI ? 1 : 0;
          const x0 = 100 + R * Math.cos(a0), y0 = 100 + R * Math.sin(a0), x1 = 100 + R * Math.cos(a1), y1 = 100 + R * Math.sin(a1);
          out += `<path d="M100,100 L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z" fill="${COLORS[i % COLORS.length]}" stroke="var(--paper)" stroke-width="1.5"><title>${esc(n)}: ${v}%</title></path>`;
          const am = (a0 + a1) / 2;
          if (v >= 5) out += `<text x="${100 + R * 0.62 * Math.cos(am)}" y="${100 + R * 0.62 * Math.sin(am) + 4}" text-anchor="middle" style="font:700 11px var(--font);fill:#0b0c0e">${v}%</text>`;
          a0 = a1;
        });
        return `<div style="flex:1 1 200px;max-width:260px;text-align:center"><svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.label)}">${out}</svg><div class="small" style="color:var(--text);font-weight:650">${esc(p.label)}</div></div>`;
      };
      return `<h5>${esc(d.title)}</h5><div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">${d.pies.map(one).join("")}</div>${legend(names)}`;
    },
    table(d) {
      return `<h5>${esc(d.title)}</h5><div class="table-wrap" style="margin:6px 0 0"><table class="t compact"><thead><tr>${d.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${d.rows.map((r) => `<tr>${r.map((c, i) => `<td${i ? ' class="num"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    },
    process(d) {
      return `<h5>${esc(d.title)}</h5><div class="flow">${d.steps.map((s, i) => `<div class="flow-step"><span class="fs-n">${i + 1}</span>${esc(s)}</div>`).join('<div class="flow-arrow">→</div>')}</div>`;
    },
    render(d) { return `<div class="chart-wrap">${(Charts[d.type] || Charts.table)(d)}</div>`; },
  };

  /* ================================================== Listening runner */
  const strip = (s) => s.replace(/\[\[|\]\]/g, "");
  const RANGES = { 1: "1 to 10", 2: "11 to 20", 3: "21 to 30", 4: "31 to 40" };
  const sentences = (s) => (strip(s).match(/[^.!?]+[.!?]+["”’]?|[^.!?]+$/g) || []).map((x) => x.trim()).filter(Boolean);

  function ListeningRunner(host, T, opts = {}) {
    host.innerHTML = `
      <div class="callout warn lr-warn" hidden><div class="ci">🔇</div><div><span class="ct">No speech engine found</span><p>Your browser does not support text-to-speech. Open the transcripts and use the test as a detailed reading exercise.</p></div></div>
      <div class="glass player">
        <div class="pl-top">
          <label>Play <select class="inp pl-part"><option value="all">All parts (full test)</option>${T.parts.map((p) => `<option value="${p.id}">Part ${p.id}</option>`).join("")}</select></label>
          <label>Speed <select class="inp pl-rate"><option value="0.85">0.85×</option><option value="0.95" selected>0.95×</option><option value="1.05">1.05×</option></select></label>
          <label><input type="checkbox" class="pl-exam" checked> Exam mode (30 s reading time, no pause)</label>
          <span class="spacer"></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </div>
        <div class="row">
          <button class="btn primary pl-play" type="button">▶ Play</button>
          <button class="btn pl-pause" type="button" disabled>⏸ Pause</button>
          <button class="btn ghost pl-stop" type="button" disabled>■ Stop</button>
          <button class="btn ghost pl-tr" type="button">📜 Show transcripts</button>
        </div>
        <div class="pl-status">Ready. Choose a part and press <b>Play</b>. Answer the questions below while you listen.</div>
        <div class="pl-prog"><div class="pl-bar"></div></div>
      </div>
      <div class="lr-transcripts" hidden></div>
      <div class="lr-quiz"></div>`;
    const q = (s) => host.querySelector(s);
    const status = q(".pl-status"), bar = q(".pl-bar"), player = q(".player");
    const btnPlay = q(".pl-play"), btnPause = q(".pl-pause"), btnStop = q(".pl-stop"), btnTr = q(".pl-tr");
    const partSel = q(".pl-part"), rateSel = q(".pl-rate"), exam = q(".pl-exam"), trHost = q(".lr-transcripts");

    // Transcripts
    trHost.innerHTML = T.parts.map((p) => `
      <div class="transcript glass" data-part="${p.id}">
        <h4>${esc(p.title)}</h4><p class="small muted">${esc(p.scene)}</p>
        ${p.lines.map((ln, i) => `<p data-line="${i}"><span class="spk">${esc(p.speakers[ln[0]].split(" ")[0])}</span>${esc(ln[1]).replace(/\[\[(.+?)\]\]/g, '<span class="ans">$1</span>')}</p>`).join("")}
      </div>`).join("");
    btnTr.addEventListener("click", () => {
      trHost.hidden = !trHost.hidden;
      btnTr.textContent = trHost.hidden ? "📜 Show transcripts" : "📜 Hide transcripts";
    });

    // Player state machine: say items are spoken sentence by sentence; wait items are reading time.
    let items = [], idx = 0, state = "idle", waitT = null, waitLeft = 0, guard = null, token = 0;
    function build() {
      const sel = partSel.value;
      const parts = sel === "all" ? T.parts : T.parts.filter((p) => String(p.id) === sel);
      const out = [];
      parts.forEach((p) => {
        if (exam.checked) {
          out.push({ say: `Part ${p.id}. ${p.scene} First, you have thirty seconds to look at questions ${p.split ? p.split[1] : RANGES[p.id]}.`, speaker: 3, part: p.id });
          out.push({ wait: 30, part: p.id });
        }
        p.lines.forEach((ln, li) => {
          // Exam tests pause halfway, as the real recordings do, so the next questions can be read.
          if (exam.checked && p.split && (p.split[0] === li || p.split[0] === ln[1])) {
            out.push({ say: `Before you hear the rest, you have some time to look at questions ${p.split[2]}.`, speaker: 3, part: p.id });
            out.push({ wait: 30, part: p.id });
          }
          sentences(ln[1]).forEach((s) => out.push({ say: s, speaker: ln[0] + (p.id - 1), who: p.speakers[ln[0]], part: p.id, line: li }));
        });
        if (exam.checked) {
          out.push({ say: `That is the end of part ${p.id}.${p.check ? " You now have thirty seconds to check your answers." : ""}`, speaker: 3, part: p.id });
          if (p.check) out.push({ wait: 30, part: p.id });
        }
      });
      return out;
    }
    function highlight(it) {
      $$("p.cur", trHost).forEach((x) => x.classList.remove("cur"));
      if (it && it.line != null) {
        const el = $(`.transcript[data-part="${it.part}"] p[data-line="${it.line}"]`, trHost);
        if (el) el.classList.add("cur");
      }
    }
    function paint() {
      bar.style.width = items.length ? (idx / items.length) * 100 + "%" : "0";
      player.classList.toggle("playing", state === "playing");
      btnPlay.disabled = !TTS.ok || state === "playing" || state === "waiting";
      btnPlay.textContent = state === "paused" ? "▶ Resume" : "▶ Play";
      btnPause.disabled = !(state === "playing" || state === "waiting");
      btnStop.disabled = state === "idle";
      partSel.disabled = state !== "idle";
      exam.disabled = state !== "idle";
      btnPause.hidden = exam.checked && state !== "idle";
    }
    function next() {
      clearTimeout(guard);
      if (state !== "playing" && state !== "waiting") return;
      if (idx >= items.length) { state = "idle"; highlight(null); status.innerHTML = "✅ Finished. Check your answers below."; paint(); toast("Recording finished — check your answers."); return; }
      const it = items[idx];
      if (it.wait) {
        state = "waiting";
        waitLeft = waitLeft || it.wait;
        const tick = () => {
          status.innerHTML = `📖 <b>Part ${it.part}</b> — reading time: ${waitLeft}s. Look at questions ${RANGES[it.part]}.`;
          if (waitLeft <= 0) { waitLeft = 0; idx++; state = "playing"; next(); return; }
          waitLeft--;
          waitT = setTimeout(tick, 1000);
        };
        paint(); tick();
        return;
      }
      state = "playing";
      const my = ++token;
      status.innerHTML = `🔊 <b>Part ${it.part}</b>${it.who ? ` · ${esc(it.who)}` : ""}`;
      highlight(it);
      paint();
      const done = () => { if (my !== token || state !== "playing") return; idx++; next(); };
      TTS.speak(it.say, { rate: +rateSel.value, speaker: it.speaker, onend: done });
      // Safety net: some engines never fire onend. Advance only once nothing is being spoken.
      const est = (it.say.split(/\s+/).length * 0.55) / +rateSel.value * 1000 + 4000;
      const watch = () => { if (my !== token || state !== "playing") return; if (speechSynthesis.speaking) guard = setTimeout(watch, 1000); else done(); };
      guard = setTimeout(watch, est);
    }
    function stop(msg) {
      token++; clearTimeout(waitT); clearTimeout(guard);
      TTS.cancel();
      state = "idle"; idx = 0; waitLeft = 0; highlight(null);
      if (msg) status.textContent = msg;
      paint();
    }
    btnPlay.addEventListener("click", () => {
      if (state === "paused") { state = items[idx] && items[idx].wait ? "waiting" : "playing"; next(); return; }
      TTS.cancel();
      items = build(); idx = 0; waitLeft = 0;
      state = "playing";
      next();
    });
    btnPause.addEventListener("click", () => {
      token++; clearTimeout(waitT); clearTimeout(guard);
      TTS.cancel();
      state = "paused";
      status.innerHTML = "⏸ Paused. Press Resume to repeat the current sentence and continue.";
      paint();
    });
    btnStop.addEventListener("click", () => stop("Stopped."));
    exam.addEventListener("change", paint);
    if (!TTS.ok) { q(".lr-warn").hidden = false; status.textContent = "Audio unavailable — use the transcripts."; }
    paint();

    const quiz = new window.IELTS.Quiz(q(".lr-quiz"), {
      id: opts.id,
      title: opts.title || "Listening · 40 questions",
      table: "listening",
      groups: T.groups,
      review: { kind: "listening", source: T.parts },
      onCheck(res) {
        $$(".transcript", trHost).forEach((t) => t.classList.add("reveal"));
        if (trHost.hidden) btnTr.textContent = "📜 Show transcripts (answers highlighted)";
        if (opts.onCheck) opts.onCheck(res);
      },
      onReset() { $$(".transcript", trHost).forEach((t) => t.classList.remove("reveal")); },
    });
    return { quiz, destroy() { stop(); } };
  }

  /* ================================================== Reading runner */
  const LETTERS = "ABCDEFGHIJ";
  function ReadingRunner(host, R, opts = {}) {
    const ranges = R.passages.map((p) => {
      const ns = p.groups.flatMap((g) => g.questions.flatMap((qq) => (Array.isArray(qq.n) ? qq.n : [qq.n])));
      return `Q${Math.min(...ns)}–${Math.max(...ns)}`;
    });
    host.innerHTML = `<div class="rr-quiz"></div>
      <div class="tabs" data-tabs>
        <div class="tab-list" role="tablist">${R.passages.map((p, i) => `<button data-tab="p${i}">Passage ${i + 1} · ${ranges[i]}</button>`).join("")}</div>
        ${R.passages.map((p, i) => `<div class="tab-panel" data-panel="p${i}"><div class="reader" data-p="${i}"></div></div>`).join("")}
      </div>
      <div class="rr-review" hidden></div>`;
    const mounts = [];
    R.passages.forEach((p, i) => {
      const reader = $(`.reader[data-p="${i}"]`, host);
      reader.innerHTML = `
        <article class="passage" tabindex="0" aria-label="Reading Passage ${i + 1}">
          <div class="sub">${esc(p.sub || `You should spend about 20 minutes on ${ranges[i].replace("Q", "Questions ")}, which are based on Reading Passage ${i + 1}.`)}</div>
          <h3>${esc(p.title)}</h3>
          ${p.paras.map((t, k) => `<p>${p.lettered ? `<span class="pl">${LETTERS[k]}</span>` : ""}${esc(t)}</p>`).join("")}
        </article>
        <div class="reader-qs">
          <div class="reader-tools"><span>Passage ${i + 1}</span><span class="spacer"></span><button class="btn sm ghost" data-clear type="button">🧽 Clear highlights</button></div>
        </div>`;
      const qs = $(".reader-qs", reader);
      p.groups.forEach((g) => { const m = document.createElement("div"); qs.appendChild(m); mounts.push({ ...g, mount: m }); });
    });
    initTabs(host);
    const quiz = new window.IELTS.Quiz($(".rr-quiz", host), {
      id: opts.id,
      title: opts.title || "Academic Reading · 40 questions",
      table: "reading-ac",
      timer: opts.timer === false ? null : { minutes: 60, label: "Time left", warnAt: 600 },
      groups: mounts,
      review: { kind: "reading", source: R.passages },
      reviewMount: $(".rr-review", host),
      onCheck: opts.onCheck,
    });
    return { quiz, destroy() { if (quiz.timer) quiz.timer.pause(); } };
  }

  /* ---------------------------------------------- Passage highlighter (all pages) */
  document.addEventListener("mouseup", () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const node = range.commonAncestorContainer;
    const passage = (node.nodeType === 1 ? node : node.parentElement).closest(".passage");
    if (!passage || sel.toString().trim().length < 2) return;
    const span = document.createElement("span");
    span.className = "hlt";
    try { range.surroundContents(span); sel.removeAllRanges(); }
    catch (e) { toast("Highlight within one paragraph at a time."); }
  });
  document.addEventListener("click", (e) => {
    const h = e.target.closest(".hlt");
    if (h && !window.getSelection().toString()) { h.replaceWith(...h.childNodes); return; }
    const b = e.target.closest("[data-clear]");
    if (b) $$(".hlt", b.closest(".reader")).forEach((x) => x.replaceWith(...x.childNodes));
  });

  Object.assign(window.IELTS, { Charts, ListeningRunner, ReadingRunner });
})();
