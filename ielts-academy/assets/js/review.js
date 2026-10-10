/* =========================================================================
   IELTS 7.0 Academy — answer review
   After marking, every question gets: the key, your answer, the author's
   explanation, the evidence (transcript line or passage sentence), a
   diagnosis of the mistake and a tip for that question type.

   IELTS.Review.render(host, details, { kind: "listening" | "reading", source })
     details: [{ q, group, given, ok, got }]   (built by IELTS.Quiz.check)
     source:  listening → T.parts            reading → R.passages
   IELTS.Review.diagnose(q, given, kind, group)  → html (also used by Cambridge)
   IELTS.Review.typeOf(q, group)                 → { id, label }
   ========================================================================= */
(function () {
  "use strict";
  const { $$, esc, norm } = window.IELTS;
  const LETTERS = "ABCDEFGHIJ";

  /* ------------------------------------------------ text helpers */
  const STOP = new Set("the a an and or but of to in on at for by with from as is are was were be been being it its this that these those there their they them he she his her we our you your i not no can could would should will may might do does did has have had than then so such which who whom what when where why how into about over after before more most less very also only just one some any all each many much other".split(" "));
  const stem = (w) => (w.length > 5 ? w.replace(/(ing|ed|es|ly|s)$/, "") : w.replace(/s$/, ""));
  const toks = (s) => norm(String(s || "").replace(/<[^>]+>/g, " ")).replace(/[^a-z0-9\s-]/g, " ").split(/[\s-]+/).filter((w) => w.length > 2 && !STOP.has(w)).map(stem);
  const sentences = (t) => (String(t).match(/[^.!?]+(?:[.!?]+["”’)]*|$)/g) || [t]).map((s) => s.trim()).filter(Boolean);
  const clean = (s) => norm(s).replace(/[“”"'’‘.,!?;:()£$€%]/g, "").replace(/-/g, " ").replace(/\s+/g, " ").trim().replace(/^(the|a|an) /, "");
  const compact = (s) => clean(s).replace(/\s+/g, "");
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 3) return 9;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  const nums = (q) => (Array.isArray(q.n) ? q.n : [q.n]);
  const label = (q) => (Array.isArray(q.n) ? `${q.n[0]}–${q.n[q.n.length - 1]}` : q.n);

  /* ------------------------------------------------ question types */
  const TYPES = {
    "gap-l": { label: "Form / note completion", tip: "Before the audio starts, predict the kind of word for each gap (name, number, plural noun, adjective). The answer usually comes after a signpost (“and the cost…”, “the main problem is…”). Spelling and plurals must be exact, and you must respect the word limit." },
    "gap-r": { label: "Completion (sentence / summary / notes)", tip: "Find the right paragraph with a unique word (a name, date or technical term), then read that sentence slowly. Copy the word exactly as it appears in the passage, check that your answer fits the grammar of the gap, and respect the word limit." },
    tf: { label: "TRUE / FALSE / NOT GIVEN", tip: "TRUE = the passage says the same thing in other words. FALSE = the passage says the opposite. NOT GIVEN = the passage says nothing about this exact claim. Watch qualifiers (all/some, always/often, only, more/less): one word can change the answer." },
    yn: { label: "YES / NO / NOT GIVEN (writer's views)", tip: "These test the writer's opinion, not facts. YES = the writer agrees, NO = the writer disagrees, NOT GIVEN = the writer's view on this exact point is not stated. Look for evaluative language: “unfortunately”, “it is a mistake to…”, “rightly”." },
    "mcq-l": { label: "Multiple choice", tip: "In Listening, all three options are usually mentioned. The right one is what the speaker finally confirms; the others are rejected, corrected or refer to someone else. Listen for “but”, “actually”, “in the end”." },
    "mcq-r": { label: "Multiple choice", tip: "Locate the part of the passage first, then test each option against it. Options that repeat words from the passage are often traps; the correct option usually paraphrases the meaning." },
    multi: { label: "Choose TWO / THREE", tip: "Each letter scores separately. Cross out options as they are rejected; the correct ones are usually spread through the recording or passage, not next to each other." },
    headings: { label: "Matching headings", tip: "A heading sums up the main idea of the whole paragraph, usually found in the first or last sentences. Ignore headings that match only one detail or example." },
    "match-l": { label: "Matching / map / plan labelling", tip: "Follow the speaker's route or list in order. For maps, find your starting point and listen for direction language (opposite, next to, at the far end, turn left). Options are not used in order." },
    "match-r": { label: "Matching information / features", tip: "Scan for the names or key terms in the passage, underline each one, then compare the surrounding sentence with the statement. Matching-information answers can be in any order, and a paragraph can be used more than once." },
  };
  function typeOf(q, group, kind) {
    const L = kind === "listening";
    let id;
    if (q.type === "gap") id = L ? "gap-l" : "gap-r";
    else if (q.type === "tfng") id = q.mode === "yn" ? "yn" : "tf";
    else if (q.type === "mcq") id = L ? "mcq-l" : "mcq-r";
    else if (q.type === "multi") id = "multi";
    else if (/^[ivx]+$/i.test(String(q.answer))) id = "headings";
    else id = L ? "match-l" : "match-r";
    return { id, ...TYPES[id] };
  }

  /* ------------------------------------------------ answer text */
  function optionText(q, group, letter) {
    if (q.options && Array.isArray(q.options[0])) { const o = q.options.find((x) => x[0] === letter); if (o) return o[1]; }
    if (group && group.box) { const o = group.box.items.find((x) => x[0] === letter); if (o) return o[1]; }
    return "";
  }
  function keyText(q) {
    if (q.type === "gap") return q.answer[0];
    if (q.type === "multi") return q.answer.join(", ");
    return q.answer;
  }
  function givenText(q, given) {
    if (q.type === "multi") return given && given.length ? given.join(", ") : "";
    return given == null ? "" : String(given).trim();
  }

  /* ------------------------------------------------ diagnosis */
  const TFNG_WHY = {
    "TRUE>FALSE": "The passage <b>agrees</b> with the statement. You probably read a paraphrase as a contradiction. Compare the statement with the evidence phrase by phrase: same meaning, different words → TRUE.",
    "TRUE>NOT GIVEN": "The information <b>is</b> in the passage, but in different words. Look for synonyms of the key words, not the same words, and don't decide NOT GIVEN until you have read the whole relevant section.",
    "FALSE>TRUE": "The passage says the <b>opposite</b>. A small word usually reverses the meaning: <i>only, never, not, more/less, all/some, before/after</i>, or a different date or number. Check each of these against the evidence.",
    "FALSE>NOT GIVEN": "The passage <b>directly contradicts</b> the statement. If one sentence makes the statement impossible, the answer is FALSE, not NOT GIVEN. Ask: “Can both be true at the same time?” If not, it's FALSE.",
    "NOT GIVEN>TRUE": "The topic is mentioned, but this <b>exact claim</b> is not. You probably filled the gap with an assumption or general knowledge. Every part of the statement (who, how much, which comparison) must be supported.",
    "NOT GIVEN>FALSE": "Nothing in the passage <b>contradicts</b> the statement; it simply isn't covered. FALSE needs a clear contradiction. If the passage and the statement could both be true, the answer is NOT GIVEN.",
  };
  const YN_WHY = {
    "YES>NO": "The writer <b>agrees</b> with this view. Re-read the evaluative words around the evidence (positive or negative?) and watch for concessions (“Although critics say…, ”) that come before the writer's real opinion.",
    "YES>NOT GIVEN": "The writer <b>does express</b> this view, but in different words. Look for the writer's own comment (“rightly”, “this is sensible”, “the evidence supports”), not just facts.",
    "NO>YES": "The writer <b>disagrees</b>. You may have chosen a view the writer reports from others (“some argue…”) and then rejects. Separate other people's opinions from the writer's.",
    "NO>NOT GIVEN": "The writer clearly <b>rejects</b> this idea. If the writer's comment makes the statement impossible, it's NO, not NOT GIVEN.",
    "NOT GIVEN>YES": "The writer never gives an opinion on this exact point. Don't infer what the writer would probably think.",
    "NOT GIVEN>NO": "The writer doesn't contradict this. NO needs a clear opposite opinion from the writer.",
  };
  function diagnose(q, given, kind, group) {
    const L = kind === "listening";
    const g = givenText(q, given);
    if (!g) return `<b>No answer.</b> Never leave a box empty: there's no penalty for a wrong answer, so an educated guess can only help.`;
    if (q.type === "gap") {
      const G = compact(g), keys = q.answer.map(compact);
      if (keys.includes(G)) return "";
      const best = q.answer[0];
      const K = compact(best);
      if (/^\d/.test(K) && /^\d/.test(G)) return `<b>Number error.</b> You wrote “${esc(g)}”, the answer is “${esc(best)}”. ${L ? "Numbers are often corrected or replaced mid-sentence (“It was 15… sorry, 50”). Listen for the final version, and for -teen vs -ty stress." : "Check units and that you copied the figure for the right year, group or item."}`;
      if (keys.some((k) => G === k + "s" || G === k + "es" || k === G + "s" || k === G + "es" || (k.endsWith("ies") && G === k.slice(0, -3) + "y") || (G.endsWith("ies") && k === G.slice(0, -3) + "y"))) return `<b>Singular / plural.</b> You wrote “${esc(g)}”, the answer is “${esc(best)}”. Check the grammar around the gap (a/an or “one” → singular; “many”, “are”, “several” → plural)${L ? ", and listen for the final -s" : ", and copy the form used in the passage"}.`;
      const dist = Math.min(...keys.map((k) => lev(G, k)));
      if (dist <= 2 && K.length > 3) return `<b>Spelling.</b> You wrote “${esc(g)}”, the answer is “${esc(best)}”. A wrong letter scores zero, so this is one of the easiest marks to win back. Add the word to your spelling list${L ? " and practise it in the dictation trainer" : ""}.`;
      if (keys.some((k) => G.includes(k))) return `<b>Too many words.</b> Your answer contains the key (“${esc(best)}”) but also extra words. Extra words make the answer wrong, so check the word limit (e.g. NO MORE THAN TWO WORDS) and write only what fills the gap.`;
      if (keys.some((k) => k.includes(G))) return `<b>Incomplete answer.</b> You wrote “${esc(g)}”, the full answer is “${esc(best)}”. A missing part of a compound noun or number scores zero, so read or listen to the end of the phrase.`;
      return L
        ? `<b>Different word.</b> You wrote “${esc(g)}”, the answer is “${esc(best)}”. This is often a <b>distractor</b>: a word the speaker says and then rejects or corrects. Read the transcript line below and find where the right answer is confirmed.`
        : `<b>Different word.</b> You wrote “${esc(g)}”, the answer is “${esc(best)}”. The question paraphrases the passage, so find the sentence below and match it meaning for meaning. The answer must be copied from the passage, not changed or guessed.`;
    }
    if (q.type === "tfng") {
      const k = String(q.answer).toUpperCase(), m = g.toUpperCase();
      return (q.mode === "yn" ? YN_WHY : TFNG_WHY)[`${k}>${m}`] || "";
    }
    if (q.type === "multi") {
      const right = given.filter((x) => q.answer.includes(x)), wrong = given.filter((x) => !q.answer.includes(x));
      const missed = q.answer.filter((x) => !given.includes(x));
      return `You scored <b>${right.length}/${q.answer.length}</b>. ${wrong.length ? `Wrong: ${wrong.map((x) => `<b>${esc(x)}</b>${optionText(q, group, x) ? ` (${esc(optionText(q, group, x))})` : ""}`).join(", ")}. ` : ""}${missed.length ? `Missed: ${missed.map((x) => `<b>${esc(x)}</b>${optionText(q, group, x) ? ` (${esc(optionText(q, group, x))})` : ""}`).join(", ")}.` : ""} ${L ? "Options that are mentioned but then rejected (“we thought about…, but”) are the usual traps." : "Check each option against the passage; options that are true but don't answer the question are common traps."}`;
    }
    // mcq / select
    const mine = optionText(q, group, g), theirs = optionText(q, group, q.answer);
    const headings = /^[ivx]+$/i.test(String(q.answer));
    let s = `You chose <b>${esc(g)}</b>${mine ? ` (“${esc(mine)}”)` : ""}; the answer is <b>${esc(q.answer)}</b>${theirs ? ` (“${esc(theirs)}”)` : ""}. `;
    if (headings) s += "Your heading probably matched one detail or example rather than the main idea of the whole paragraph.";
    else if (q.type === "mcq") s += L ? "The option you chose was probably mentioned, then rejected or corrected. In IELTS Listening, hearing an option is not enough: the speaker must confirm it." : "The option you chose probably repeats words from the passage without matching its meaning, or is true but doesn't answer this question.";
    else s += L ? "Re-trace the speaker's route or list. Labels and options don't come in order." : "Find the sentence that matches the statement's meaning, not just a shared keyword.";
    return s;
  }

  /* ------------------------------------------------ evidence */
  function listeningEvidence(q, parts) {
    const marks = [];
    parts.forEach((p) => p.lines.forEach((ln, li) => {
      const re = /\[\[(.+?)\]\]/g; let m;
      while ((m = re.exec(ln[1]))) marks.push({ part: p, line: ln, li });
    }));
    const seen = new Set();
    return nums(q).map((n) => marks[n - 1]).filter((m) => m && !seen.has(m.part.id + ":" + m.li) && seen.add(m.part.id + ":" + m.li)).map((m) => {
      const who = esc(m.part.speakers[m.line[0]].split(" ")[0]);
      return `<span class="spk">${who}</span> ${esc(m.line[1]).replace(/\[\[(.+?)\]\]/g, "<mark>$1</mark>")} <span class="muted small">(Part ${m.part.id})</span>`;
    });
  }
  function readingEvidence(q, group, passages) {
    const pIdx = passages.findIndex((p) => p.groups.some((g) => g.questions.includes(q)));
    if (pIdx < 0) return [];
    const P = passages[pIdx];
    const tag = (i) => (P.lettered ? `Paragraph ${LETTERS[i]}` : `Paragraph ${i + 1}`);
    const head = (i, s) => `<span class="muted small">${esc(P.title)} · ${tag(i)}</span> “${s}”`;
    const text = String(q.text || "").replace("{}", " ");
    // Matching headings: show the paragraph's opening (its topic sentence)
    const hm = text.match(/^\s*Paragraph\s+([A-J])\b/);
    if (hm && /^[ivx]+$/i.test(String(q.answer))) {
      const i = LETTERS.indexOf(hm[1]);
      if (P.paras[i]) return [head(i, esc(sentences(P.paras[i]).slice(0, 2).join(" ")))];
    }
    // Paragraph restriction from the explanation, the question or a paragraph-letter answer
    let only = null;
    const ref = `${q.why || ""} ${text}`.match(/paragraph\s+([A-J]|\d+)\b/i);
    if (ref) only = /\d/.test(ref[1]) ? +ref[1] - 1 : LETTERS.indexOf(ref[1].toUpperCase());
    if (q.type === "select" && P.lettered && !(group && group.box) && /^[A-J]$/.test(q.answer)) only = LETTERS.indexOf(q.answer);
    if (only != null && !P.paras[only]) only = null;
    // Score sentences by shared content words; the gap answer itself is the strongest signal.
    let extra = "";
    if (q.type === "mcq") extra = optionText(q, group, q.answer);
    else if (q.type === "multi") extra = q.answer.map((a) => optionText(q, group, a)).join(" ");
    else if (q.type === "select") extra = optionText(q, group, q.answer);
    const quote = String(q.why || "").match(/[“"]([^”"]{8,})[”"]/);
    const qset = new Set(toks(text + " " + extra + " " + (q.why || "")));
    const answers = q.type === "gap" ? q.answer.map(clean) : [];
    const quoteKey = quote ? clean(quote[1]).replace(/…|\.\.\./g, "").slice(0, 40) : "";
    let best = null;
    P.paras.forEach((para, i) => {
      if (only != null && i !== only) return;
      sentences(para).forEach((s) => {
        const cs = clean(s);
        let score = toks(s).filter((w) => qset.has(w)).length;
        if (answers.some((a) => a && (" " + cs + " ").includes(" " + a + " "))) score += 6;
        if (quoteKey && cs.includes(quoteKey.slice(0, 25))) score += 10;
        if (!best || score > best.score) best = { i, s, score };
      });
    });
    if (!best || best.score < 1) return only != null ? [head(only, esc(sentences(P.paras[only]).slice(0, 2).join(" ")))] : [];
    let html = esc(best.s);
    answers.forEach((a) => { if (!a) return; const re = new RegExp(`\\b(${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "[\\s-]+")})\\b`, "i"); html = html.replace(re, "<mark>$1</mark>"); });
    return [head(best.i, html)];
  }

  /* ------------------------------------------------ render */
  function render(host, details, opts = {}) {
    const kind = opts.kind || "reading";
    const rows = details.map((d) => {
      const t = typeOf(d.q, d.group, kind);
      const marks = d.q.type === "multi" ? d.q.answer.length : 1;
      return { ...d, t, marks, score: d.q.type === "multi" ? d.got : d.ok ? 1 : 0 };
    });
    const byType = {};
    rows.forEach((r) => { const b = (byType[r.t.id] = byType[r.t.id] || { label: r.t.label, ok: 0, n: 0 }); b.ok += r.score; b.n += r.marks; });
    const nWrong = rows.filter((r) => !r.ok).length;
    host.innerHTML = `
      <div class="review glass">
        <div class="rv-head">
          <h4>📋 Answers &amp; explanations</h4>
          <span class="spacer"></span>
          <div class="rv-filter" role="group" aria-label="Filter answers">
            <button type="button" data-f="all" class="on">All (${rows.length})</button>
            <button type="button" data-f="wrong">❌ Wrong (${nWrong})</button>
            <button type="button" data-f="right">✅ Correct (${rows.length - nWrong})</button>
          </div>
        </div>
        <div class="rv-types">${Object.values(byType).map((b) => `<span class="rv-type ${b.ok / b.n >= 0.75 ? "ok" : b.ok / b.n >= 0.5 ? "mid" : "low"}"><b>${b.ok}/${b.n}</b> ${esc(b.label)}</span>`).join("")}</div>
        <p class="small muted" style="margin:6px 0 12px">Wrong answers are open. Each one shows the evidence${kind === "listening" ? " from the transcript" : " from the passage"}, why your answer didn't score, and how to get this type of question right next time.</p>
        <div class="rv-list">${rows.map((r) => {
          const g = givenText(r.q, r.given);
          let ev = [];
          try { ev = opts.source ? (kind === "listening" ? listeningEvidence(r.q, opts.source) : readingEvidence(r.q, r.group, opts.source)) : []; } catch (e) { ev = []; }
          const diag = r.ok ? "" : diagnose(r.q, r.given, kind, r.group);
          const alt = r.q.type === "gap" && r.q.answer.length > 1 ? `<span class="muted"> · also accepted: ${r.q.answer.slice(1).map(esc).join(" / ")}</span>` : "";
          return `<details class="rv-item ${r.ok ? "ok" : "bad"}" data-ok="${r.ok ? 1 : 0}" ${r.ok ? "" : "open"}>
            <summary><span class="rv-n">${label(r.q)}</span><span class="rv-mark">${r.ok ? "✅" : "❌"}</span>
              <span class="rv-ans"><span class="rv-key">${esc(keyText(r.q))}</span>${r.ok ? "" : `<span class="rv-you">you: ${g ? esc(g) : "—"}</span>`}</span>
              <span class="rv-tt">${esc(r.t.label)}</span></summary>
            <div class="rv-body">
              ${r.q.text ? `<div class="rv-q">${String(r.q.text).replace("{}", "<span class=\"rv-blank\">_____</span>")}</div>` : ""}
              <div><b>Answer:</b> <span class="key">${esc(keyText(r.q))}</span>${alt}</div>
              ${r.q.why ? `<div class="rv-why"><b>Explanation:</b> ${r.q.why}</div>` : ""}
              ${ev.length ? `<div class="rv-ev"><b>📍 Evidence</b>${ev.map((e) => `<p>${e}</p>`).join("")}</div>` : ""}
              ${diag ? `<div class="rv-diag"><b>🔎 Why yours didn't score:</b> ${diag}</div>` : ""}
              <div class="rv-tip"><b>💡 ${esc(r.t.label)}:</b> ${r.t.tip}</div>
            </div>
          </details>`;
        }).join("")}</div>
      </div>`;
    host.hidden = false;
    host.querySelector(".rv-filter").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("button", b.parentElement).forEach((x) => x.classList.toggle("on", x === b));
      $$(".rv-item", host).forEach((it) => {
        const ok = it.dataset.ok === "1";
        it.hidden = (b.dataset.f === "wrong" && ok) || (b.dataset.f === "right" && !ok);
        if (b.dataset.f === "right" && ok) it.open = true;
      });
    });
  }

  window.IELTS.Review = { render, diagnose, typeOf, TYPES, compact, lev };
})();
