/* =========================================================================
   CAMBRIDGE_TEST: a companion for the official Cambridge IELTS books.
   The site holds no Cambridge material. The learner does the test from their
   own book, types answers into a 40-box answer sheet, copies the book's
   answer key once (kept only in this browser), and gets marking, a band,
   a mistake-by-mistake review and a running analysis of their weaknesses.
   ========================================================================= */
(function () {
  "use strict";
  const { $, $$, esc, store, toast, Timer, rawToBand, overallBand, fmtBand, saveResult, getResults, initTabs } = window.IELTS;
  const Review = window.IELTS.Review;

  const SK = {
    listening: { name: "Listening", icon: "🎧", short: "L" },
    reading: { name: "Reading", icon: "📖", short: "R" },
    writing: { name: "Writing", icon: "✍️", short: "W" },
    speaking: { name: "Speaking", icon: "🎙️", short: "S" },
  };
  const ORDER = ["listening", "reading", "writing", "speaking"];
  const span = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const RANGES = [
    { id: "15-19", label: "Cambridge 15–19", note: "Recommended · 20 tests", books: span(15, 19) },
    { id: "20-21", label: "Cambridge 20–21", note: "Newest · 8 tests", books: span(20, 21) },
    { id: "10-14", label: "Cambridge 10–14", note: "20 tests", books: span(10, 14) },
    { id: "1-9", label: "Cambridge 1–9", note: "Older format · 36 tests", books: span(1, 9) },
  ];
  const SECTIONS = {
    listening: [[1, 10, "Part 1"], [11, 20, "Part 2"], [21, 30, "Part 3"], [31, 40, "Part 4"]],
    reading: [[1, 13, "Passage 1"], [14, 26, "Passage 2"], [27, 40, "Passage 3"]],
  };

  /* ================================================== Storage */
  const tid = (b, t) => `b${b}t${t}`;
  const name = (b, t) => `Cambridge ${b} · Test ${t}`;
  const resId = (b, t, k) => `cambridge:${tid(b, t)}:${k}`;
  const camSelf = () => store.get("cam-self", {});
  const setCamSelf = (b, t, patch) => { const all = camSelf(); all[tid(b, t)] = { ...(all[tid(b, t)] || {}), ...patch }; store.set("cam-self", all); };
  function scoresFor(b, t) {
    const res = getResults(), s = camSelf()[tid(b, t)] || {};
    return { listening: res[resId(b, t, "listening")], reading: res[resId(b, t, "reading")], writing: s.writing, speaking: s.speaking };
  }

  /* ================================================== Answer-key logic */
  const TF = ["TRUE", "FALSE", "NOT GIVEN"], YN = ["YES", "NO", "NOT GIVEN"];
  const up = (s) => String(s || "").trim().toUpperCase().replace(/\s+/g, " ");
  function familyAt(keys, i) {
    const k = up(keys[i]);
    if (k === "TRUE" || k === "FALSE") return "tf";
    if (k === "YES" || k === "NO") return "yn";
    if (k !== "NOT GIVEN") return null;
    for (let d = 1; d < 8; d++) for (const j of [i - d, i + d]) {
      const n = up(keys[j]);
      if (n === "TRUE" || n === "FALSE") return "tf";
      if (n === "YES" || n === "NO") return "yn";
    }
    return "tf";
  }
  function fromShort(g, fam) {
    const G = up(g).replace(/\./g, "");
    if (fam === "tf") return { T: "TRUE", F: "FALSE", NG: "NOT GIVEN", N: "NOT GIVEN" }[G] || G;
    if (fam === "yn") return { Y: "YES", N: "NO", NG: "NOT GIVEN" }[G] || G;
    return g;
  }
  /** "(the) car park / parking" → ["the car park", "car park", "parking"] */
  function expandKey(k) {
    const out = [];
    String(k || "").split(/\s*\/\s*|\s+OR\s+/i).forEach((alt) => {
      const parts = alt.split(/(\([^)]*\))/);
      let vars = [""];
      parts.forEach((p) => {
        if (/^\(.*\)$/.test(p)) { const inner = p.slice(1, -1); vars = vars.flatMap((v) => [v + inner, v]); }
        else vars = vars.map((v) => v + p);
      });
      vars.forEach((v) => { const t = v.replace(/\s+/g, " ").trim(); if (t && !out.includes(t)) out.push(t); });
    });
    return out;
  }
  const isLetter = (k) => /^[A-L]$/i.test(String(k).trim()) || /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i.test(String(k).trim());
  function matchOne(g, k, fam) {
    if (!String(g || "").trim()) return false;
    if (fam) return up(fromShort(g, fam)) === up(k);
    if (isLetter(k)) return up(g) === up(k);
    return expandKey(k).some((a) => Review.compact(a) === Review.compact(g));
  }
  const parsePairs = (s) => String(s || "").split(/[,;]+/).map((x) => x.match(/(\d{1,2})\s*(?:-|–|&|and)\s*(\d{1,2})/)).filter(Boolean)
    .map((m) => span(+m[1], +m[2]).map((n) => n - 1)).filter((g) => g.length > 1 && g.every((i) => i >= 0 && i < 40));
  function mark(ans, keyState) {
    const keys = keyState.k, ok = Array(40).fill(false);
    const grouped = new Set();
    parsePairs(keyState.pairs).forEach((grp) => {
      const used = new Set();
      grp.forEach((i) => grouped.add(i));
      grp.forEach((i) => {
        const j = grp.find((jj) => !used.has(jj) && keys[jj] && matchOne(ans[i], keys[jj], familyAt(keys, jj)));
        if (j != null) { used.add(j); ok[i] = true; }
      });
    });
    keys.forEach((k, i) => { if (!grouped.has(i) && k) ok[i] = matchOne(ans[i], k, familyAt(keys, i)); });
    return ok;
  }
  /** Parses a pasted answer key: "1 station", "2. (the) library", "21&22 IN EITHER ORDER B D", "21-22 B, D". */
  function parseKey(text) {
    const k = Array(40).fill(""), pairs = [];
    let pending = null;
    String(text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean).forEach((line) => {
      const m = line.match(/^(?:Q(?:uestion)?\s*)?(\d{1,2})\s*(?:(?:&|and|-|–)\s*(\d{1,2}))?\s*[.):]?\s*(.*)$/i);
      if (m && +m[1] >= 1 && +m[1] <= 40) {
        const a = +m[1], b = m[2] ? +m[2] : null;
        let rest = m[3].replace(/\b(IN\s+)?EITHER\s+ORDER\b/i, "").replace(/^[:\-–\s]+/, "").trim();
        if (b && b > a && b <= 40) {
          const nums = span(a, b);
          pairs.push(`${a}-${b}`);
          const vals = rest ? rest.split(/[\s,;]+/).filter(Boolean) : [];
          nums.forEach((n, i) => { if (vals[i]) k[n - 1] = vals[i]; });
          pending = vals.length < nums.length ? { nums, at: vals.length } : null;
        } else { k[a - 1] = rest; pending = null; }
      } else if (pending && pending.at < pending.nums.length) {
        line.split(/[\s,;]+/).filter(Boolean).forEach((v) => { if (pending.at < pending.nums.length) k[pending.nums[pending.at++] - 1] = v; });
      }
    });
    return { k, pairs: pairs.join(", ") };
  }

  /* ================================================== Question types & mistake reasons */
  const CTYPES = {
    listening: [
      ["form", "Form / note / table completion", "gap-l"], ["sentence", "Sentence / flow-chart completion", "gap-l"], ["mcq", "Multiple choice", "mcq-l"],
      ["multi", "Choose TWO / THREE", "multi"], ["matching", "Matching", "match-l"], ["map", "Map / plan labelling", "match-l"],
    ],
    reading: [
      ["tf", "TRUE / FALSE / NOT GIVEN", "tf"], ["yn", "YES / NO / NOT GIVEN", "yn"], ["headings", "Matching headings", "headings"],
      ["info", "Matching information (which paragraph)", "match-r"], ["features", "Matching features / people", "match-r"], ["endings", "Matching sentence endings", "match-r"],
      ["mcq", "Multiple choice", "mcq-r"], ["multi", "Choose TWO / THREE", "multi"], ["sentence", "Sentence completion", "gap-r"],
      ["summary", "Summary / note / table completion", "gap-r"], ["short", "Short-answer questions", "gap-r"], ["diagram", "Diagram / flow-chart labelling", "gap-r"],
    ],
  };
  const REASONS = [
    ["", "— choose a reason —", ""],
    ["spelling", "Spelling or singular/plural", "Keep a personal spelling list of every word you lose, and test yourself on it weekly. Before you move on, read each gap answer back against the sentence: does a/an or a plural verb tell you the form?"],
    ["limit", "Word limit / extra words", "Circle the word limit before you start each set. “NO MORE THAN TWO WORDS AND/OR A NUMBER” means 3 words is wrong, even if the key word is there. Write only what fills the gap grammatically."],
    ["distractor", "Fell for a distractor", "Distractors are mentioned on purpose: an option is suggested, then rejected (“we thought about…, but”), corrected, or belongs to someone else. Wait for the confirmation before you commit."],
    ["paraphrase", "Missed the paraphrase", "The question and the text almost never use the same words. Write down the synonym pair you missed (question word → text word) and review your list before each test."],
    ["tfng", "TRUE / FALSE / NOT GIVEN confusion", "FALSE needs a clear contradiction; NOT GIVEN means the exact claim isn't covered. Ask “Could both be true at once?” Yes → NOT GIVEN; no → FALSE. Check every qualifier (all, some, only, more)."],
    ["location", "Couldn't find it / lost my place", "Listening: keep your eyes one question ahead, so if you miss one you don't miss three. Reading: use names, numbers and capitals to locate, and remember most question sets follow the order of the text."],
    ["vocab", "Didn't know a key word", "Add the word with its collocation and an example to your flashcards. If a whole passage felt hard, read more on that topic area (science, history, psychology) this week."],
    ["time", "Ran out of time / left blank", "Reading: 20 minutes per passage, then move on. Never leave a blank, because a guess can still score. Listening: if you lose one answer, let it go and catch the next."],
    ["careless", "Careless / transfer error", "Read every answer back once at the end: number, spelling, letter (B vs D), and the right box. On paper tests, transfer in CAPITALS."],
    ["guess", "I guessed", "A lucky or unlucky guess shows a gap in the method. Re-do the question with the transcript or passage open and find the exact evidence."],
  ];
  const REASON = Object.fromEntries(REASONS.map((r) => [r[0], r]));
  function inferType(k, fam, skill) {
    if (!String(k || "").trim()) return null;
    if (fam === "tf") return "tf";
    if (fam === "yn") return "yn";
    if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i.test(String(k).trim()) && skill === "reading") return "headings";
    if (isLetter(k)) return skill === "listening" ? "mcq" : "info";
    return skill === "listening" ? "form" : "summary";
  }
  function autoReason(diagHtml, fam, skill) {
    const d = diagHtml || "";
    if (/No answer/.test(d)) return "time";
    if (/Spelling|Singular/.test(d)) return "spelling";
    if (/Too many words/.test(d)) return "limit";
    if (/Number error|Incomplete/.test(d)) return "careless";
    if (fam) return "tfng";
    return skill === "listening" ? "distractor" : "paraphrase";
  }

  /* ================================================== Picker */
  const pick = store.get("cam-pick", { range: "15-19", book: 15, test: 1, skill: "listening" });
  const grid = $("#cam-grid");
  function renderRanges() {
    $("#cam-ranges").innerHTML = RANGES.map((r) => `<button type="button" data-r="${r.id}" class="${pick.range === r.id ? "sel" : ""}"><b>${esc(r.label)}</b><small>${esc(r.note)}</small></button>`).join("");
  }
  function chip(k, v) {
    if (v == null) return `<span>${SK[k].short} –</span>`;
    const band = typeof v === "object" ? v.band : v;
    const label = typeof v === "object" ? `${v.raw}/40` : fmtBand(v);
    return `<span class="${band >= 7 ? "ok" : "low"}" title="${SK[k].name}: band ${fmtBand(band)}">${SK[k].short} ${label}</span>`;
  }
  function renderGrid() {
    const r = RANGES.find((x) => x.id === pick.range) || RANGES[0];
    grid.innerHTML = r.books.map((b) => `
      <div class="cam-book"><div class="cam-book-h">📚 Cambridge IELTS ${b}</div>
        <div class="test-grid cam">${[1, 2, 3, 4].map((t) => {
          const sc = scoresFor(b, t);
          return `<button type="button" class="test-card ${pick.book === b && pick.test === t ? "sel" : ""}" data-b="${b}" data-t="${t}"><b>Test ${t}</b><span class="tc-scores">${ORDER.map((k) => chip(k, sc[k])).join("")}</span></button>`;
        }).join("")}</div>
      </div>`).join("");
  }
  function paintPick() {
    $$("#cam-skill button").forEach((b) => b.classList.toggle("sel", b.dataset.skill === pick.skill));
    $$("#cam-ranges button").forEach((b) => b.classList.toggle("sel", b.dataset.r === pick.range));
    $$(".test-card", grid).forEach((c) => c.classList.toggle("sel", +c.dataset.b === pick.book && +c.dataset.t === pick.test));
    $("#cam-summary").innerHTML = `<b>${name(pick.book, pick.test)} · ${SK[pick.skill].icon} ${SK[pick.skill].name}</b> <span class="muted">· have your book ready</span>`;
    $("#cam-start").textContent = `Open ${SK[pick.skill].name} answer sheet →`;
    store.set("cam-pick", pick);
  }
  $("#cam-skill").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { pick.skill = b.dataset.skill; paintPick(); } });
  $("#cam-ranges").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    pick.range = b.dataset.r;
    const r = RANGES.find((x) => x.id === pick.range);
    if (!r.books.includes(pick.book)) { pick.book = r.books[0]; pick.test = 1; }
    renderGrid(); paintPick();
  });
  grid.addEventListener("click", (e) => { const c = e.target.closest(".test-card"); if (c) { pick.book = +c.dataset.b; pick.test = +c.dataset.t; paintPick(); } });
  $("#cam-start").addEventListener("click", () => open(pick.book, pick.test, pick.skill));

  /* ================================================== Room */
  let current = null;
  const body = $("#cam-body");
  function open(b, t, skill) {
    if (current && current.destroy) current.destroy();
    current = null;
    history.replaceState(null, "", `#b=${b}&t=${t}&s=${skill}`);
    $("#cam-empty").hidden = true;
    $("#cam-wrap").hidden = false;
    $("#cam-eyebrow").textContent = `${name(b, t)} · your book`;
    $("#cam-title").textContent = `${SK[skill].icon} ${SK[skill].name}`;
    body.innerHTML = "";
    const host = document.createElement("div");
    body.appendChild(host);
    if (skill === "listening" || skill === "reading") current = runSheet(host, b, t, skill);
    else if (skill === "writing") current = runWriting(host, b, t);
    else current = runSpeaking(host, b, t);
    $("#room").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $("#cam-exit").addEventListener("click", () => {
    if (current && current.destroy) current.destroy();
    current = null;
    $("#cam-wrap").hidden = true; $("#cam-empty").hidden = false;
    history.replaceState(null, "", location.pathname);
    renderGrid(); renderResults();
    $("#choose").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------------------------------------------- Listening / Reading answer sheet */
  function runSheet(host, b, t, skill) {
    const id = `${tid(b, t)}:${skill}`;
    const L = skill === "listening";
    const ans = store.get("cam-ans:" + id, Array(40).fill(""));
    const keyState = store.get("cam-key:" + id, { k: Array(40).fill(""), pairs: "" });
    const rev = store.get("cam-rev:" + id, {});
    let module = store.get("cam-mod:" + id, "ac");
    const boxes = (cls, vals, ph) => SECTIONS[skill].map(([a, z, lab]) => `
      <div class="as-sec"><div class="as-h">${lab} <span class="muted">· Q${a}–${z}</span></div>
        ${span(a, z).map((n) => `<label class="as-cell"><span>${n}</span><input class="${cls}" data-i="${n - 1}" value="${esc(vals[n - 1] || "")}" autocomplete="off" spellcheck="false" ${ph ? `placeholder="${ph}"` : ""} aria-label="${cls === "as-ans" ? "Answer" : "Key"} ${n}"></label>`).join("")}
      </div>`).join("");
    host.innerHTML = `
      <div class="quiz-bar"><span class="qb-title">${esc(name(b, t))} · ${SK[skill].name} · answer sheet</span><span class="qb-count as-count"></span><span class="spacer"></span><span class="as-timer"></span></div>
      <div class="tabs" data-tabs>
        <div class="tab-list" role="tablist"><button data-tab="sheet">1 · Answer sheet</button><button data-tab="key">2 · Answer key</button><button data-tab="result">3 · Results &amp; explanations</button></div>
        <div class="tab-panel" data-panel="sheet">
          <div class="callout note"><div class="ci">📘</div><div>
            ${L ? `Open <b>Cambridge IELTS ${b}, Test ${t}, Listening</b> and play the official audio (from the book's online resources). Play it <b>once</b>, without pausing, and type your answers here as you listen. The timer starts with your first answer.`
              : `Open <b>Cambridge IELTS ${b}, Test ${t}, Reading</b> in your book. Write your answers here and stop when the 60-minute timer ends. The timer starts with your first answer.`}
            <br><span class="small muted">Shortcuts: T / F / NG and Y / N / NG are accepted. Letters and Roman numerals are not case-sensitive.</span>
            ${L ? "" : `<div class="row mt"><label class="small">Module <select class="inp as-mod"><option value="ac" ${module === "ac" ? "selected" : ""}>Academic</option><option value="gt" ${module === "gt" ? "selected" : ""}>General Training</option></select></label></div>`}
          </div></div>
          <div class="as-grid">${boxes("as-ans", ans)}</div>
          <div class="row mt"><button class="btn primary as-done" type="button">I've finished → enter the answer key</button><button class="btn ghost as-clear" type="button">⟲ Clear my answers</button></div>
        </div>
        <div class="tab-panel" data-panel="key">
          <div class="callout warn"><div class="ci">🔑</div><div>Copy the answers from the <b>Answer key</b> at the back of your book (Cambridge IELTS ${b}, Test ${t}, ${SK[skill].name}). Your key is saved only in this browser. It is never uploaded or shared.
            <ul class="small" style="margin:6px 0 0"><li><b>Alternatives:</b> <code>car park / parking</code></li><li><b>Optional words:</b> <code>(the) station</code> accepts “the station” and “station”</li><li><b>Either order:</b> type the letters in both boxes and list the pair below, e.g. <code>21-22, 25-26</code></li></ul></div></div>
          <details class="acc"><summary>⚡ Paste the whole key at once</summary><div class="acc-body">
            <p class="small muted">One answer per line, e.g. <code>1 station</code>, <code>2 (the) library</code>, <code>21&amp;22 IN EITHER ORDER B D</code>.</p>
            <textarea class="inp as-paste" rows="8" style="width:100%" placeholder="1 station&#10;2 (the) library&#10;3 Tuesday&#10;…"></textarea>
            <div class="row mt"><button class="btn as-parse" type="button">Fill the boxes below</button></div>
          </div></details>
          <div class="as-grid key">${boxes("as-key", keyState.k)}</div>
          <div class="row mt"><label class="small">Either-order pairs <input class="inp as-pairs" value="${esc(keyState.pairs)}" placeholder="e.g. 21-22, 25-26" style="width:200px"></label><span class="spacer"></span><span class="small muted as-keycount"></span><button class="btn primary as-mark" type="button">✓ Mark my answers</button></div>
        </div>
        <div class="tab-panel" data-panel="result"><div class="as-result"><p class="muted">Finish the test, enter the key, then press <b>Mark my answers</b>.</p></div></div>
      </div>`;
    initTabs(host);
    const go = (tab) => { const btn = $(`[data-tab="${tab}"]`, host); if (btn) btn.click(); };
    const timer = new Timer($(".as-timer", host), { minutes: L ? 30 : 60, label: "Time left", warnAt: L ? 120 : 600 });
    const count = () => { $(".as-count", host).textContent = `${ans.filter((x) => String(x).trim()).length} / 40 answered`; $(".as-keycount", host).textContent = `${keyState.k.filter((x) => String(x).trim()).length} / 40 key answers`; };
    host.addEventListener("input", (e) => {
      const i = +e.target.dataset.i;
      if (e.target.classList.contains("as-ans")) {
        ans[i] = e.target.value; store.set("cam-ans:" + id, ans);
        if (!timer.running && !timer.ended && timer.left === timer.total) timer.start();
      } else if (e.target.classList.contains("as-key")) { keyState.k[i] = e.target.value; store.set("cam-key:" + id, keyState); }
      else if (e.target.classList.contains("as-pairs")) { keyState.pairs = e.target.value; store.set("cam-key:" + id, keyState); }
      count();
    });
    const mod = $(".as-mod", host);
    if (mod) mod.addEventListener("change", () => { module = mod.value; store.set("cam-mod:" + id, module); });
    $(".as-done", host).addEventListener("click", () => { if (timer.running) timer.pause(); go("key"); });
    $(".as-clear", host).addEventListener("click", () => {
      if (!confirm("Clear all your answers for this test? (The answer key is kept.)")) return;
      ans.fill(""); store.set("cam-ans:" + id, ans);
      $$(".as-ans", host).forEach((i) => { i.value = ""; });
      timer.reset(); count();
    });
    $(".as-parse", host).addEventListener("click", () => {
      const parsed = parseKey($(".as-paste", host).value);
      const n = parsed.k.filter(Boolean).length;
      if (!n) { toast("No numbered answers found. Use one line per answer, e.g. “1 station”."); return; }
      parsed.k.forEach((v, i) => { if (v) keyState.k[i] = v; });
      if (parsed.pairs) keyState.pairs = parsed.pairs;
      store.set("cam-key:" + id, keyState);
      $$(".as-key", host).forEach((inp) => { inp.value = keyState.k[+inp.dataset.i]; });
      $(".as-pairs", host).value = keyState.pairs;
      count(); toast(`Filled ${n} answers from the pasted key.`);
    });
    $(".as-mark", host).addEventListener("click", () => {
      const missing = keyState.k.filter((x) => !String(x).trim()).length;
      if (missing === 40) { toast("Enter the answer key first."); return; }
      if (missing && !confirm(`${missing} key box(es) are empty. Those questions will be marked wrong. Continue?`)) return;
      showResult(true);
      go("result");
    });

    const table = () => (L ? "listening" : module === "gt" ? "reading-gt" : "reading-ac");
    function showResult(save) {
      const ok = mark(ans, keyState);
      const raw = ok.filter(Boolean).length;
      const band = rawToBand(raw, 40, table());
      const types = keyState.k.map((k, i) => inferType(k, familyAt(keyState.k, i), skill));
      if (save) {
        saveResult(resId(b, t, skill), { raw, total: 40, band, pct: Math.round((raw / 40) * 100) });
        store.set("cam-mark:" + id, { ok, types, date: new Date().toISOString(), raw, band });
        if (timer.running) timer.pause();
        renderGrid(); renderResults();
      }
      const target = table() === "reading-gt" ? 34 : 30;
      const out = $(".as-result", host);
      const wrongIdx = ok.map((x, i) => (x ? null : i)).filter((x) => x != null);
      out.innerHTML = `
        <div class="quiz-result glass show">
          <div class="qr-band ${band >= 7 ? "ok" : "low"}"><div><b>${fmtBand(band)}</b><small>est. band</small></div></div>
          <div><h4>${raw} / 40 correct</h4>
            <p style="margin:0 0 8px">${band >= 7 ? `<b class="c-green">On target for Band 7.</b> Review the few you missed: at 7.0 they are usually careless.` : `<b class="c-amber">${Math.max(0, target - raw)} more correct answer(s) to reach Band 7.</b> Work through every wrong answer below with the ${L ? "transcript" : "passage"} open.`}</p>
            <div class="row">${wrongIdx.length ? `<span class="badge red">Missed: ${wrongIdx.map((i) => i + 1).join(", ")}</span>` : `<span class="badge green">Perfect score</span>`}<span class="badge gray">${L ? "Listening" : module === "gt" ? "General Training reading" : "Academic reading"} conversion</span></div>
          </div>
        </div>
        <div class="review glass">
          <div class="rv-head"><h4>📋 Answers &amp; explanations</h4><span class="spacer"></span>
            <div class="rv-filter" role="group"><button type="button" data-f="all" class="on">All (40)</button><button type="button" data-f="wrong">❌ Wrong (${wrongIdx.length})</button><button type="button" data-f="right">✅ Correct (${40 - wrongIdx.length})</button></div></div>
          <p class="small muted" style="margin:6px 0 12px">For every wrong answer: read the automatic diagnosis, then open the ${L ? "<b>audioscript</b> at the back of your book (the answers are underlined there)" : "<b>passage</b>"}, find the evidence and copy the key phrase into the box. Choose the reason for each mistake to see how to fix it.</p>
          <div class="rv-list">${ok.map((good, i) => item(i, good, types[i])).join("")}</div>
        </div>`;
      wireReview(out);
    }
    function item(i, good, inferred) {
      const k = keyState.k[i], fam = familyAt(keyState.k, i), g = ans[i];
      const r = rev[i] || {};
      const typeId = r.type || inferred;
      const T = CTYPES[skill].find((x) => x[0] === typeId) || CTYPES[skill][0];
      const tip = Review.TYPES[T[2]];
      const q = fam ? { n: i + 1, type: "tfng", mode: fam === "yn" ? "yn" : "tf", answer: up(k) } : isLetter(k) ? { n: i + 1, type: "select", answer: up(k) } : { n: i + 1, type: "gap", answer: expandKey(k) };
      const noKey = !String(k || "").trim();
      const diag = good || noKey ? "" : Review.diagnose(q, fam ? fromShort(g, fam) : g, skill, null);
      const reason = r.reason != null ? r.reason : good || noKey ? "" : autoReason(diag, fam, skill);
      const display = k ? esc(k) : `<span class="muted">no key</span>`;
      return `<details class="rv-item ${good ? "ok" : "bad"}" data-ok="${good ? 1 : 0}" data-i="${i}" ${good ? "" : "open"}>
        <summary><span class="rv-n">${i + 1}</span><span class="rv-mark">${good ? "✅" : "❌"}</span>
          <span class="rv-ans"><span class="rv-key">${display}</span>${good ? "" : `<span class="rv-you">you: ${String(g).trim() ? esc(g) : "—"}</span>`}</span>
          <span class="rv-tt">${esc(T[1])}</span></summary>
        <div class="rv-body">
          <div><b>Answer:</b> <span class="key">${display}</span>${expandKey(k).length > 1 && !fam ? `<span class="muted"> · accepted: ${expandKey(k).map(esc).join(" / ")}</span>` : ""}</div>
          ${diag ? `<div class="rv-diag"><b>🔎 Why yours didn't score:</b> ${diag}</div>` : ""}
          <div class="rv-edit">
            <label>Question type <select class="inp rv-type">${CTYPES[skill].map(([v, lab]) => `<option value="${v}" ${v === typeId ? "selected" : ""}>${esc(lab)}</option>`).join("")}</select></label>
            ${good ? "" : `<label>My mistake <select class="inp rv-reason">${REASONS.map(([v, lab]) => `<option value="${v}" ${v === reason ? "selected" : ""}>${esc(lab)}</option>`).join("")}</select></label>`}
          </div>
          ${good ? "" : `<div class="rv-fix">${reason && REASON[reason] ? `<b>🛠 How to fix it:</b> ${esc(REASON[reason][2])}` : ""}</div>`}
          <label class="rv-note-l small">📍 Evidence from the ${L ? "audioscript" : "passage"}, or your note${good ? " (optional)" : ""}
            <textarea class="inp rv-note" rows="2" placeholder="${L ? "e.g. “…we'd originally planned Tuesday, but it's now Thursday” → I wrote the first day I heard" : "e.g. Para C: “the majority of” = most → the statement says “all” → FALSE"}">${esc(r.note || "")}</textarea></label>
          ${tip ? `<div class="rv-tip"><b>💡 ${esc(T[1])}:</b> ${tip.tip}</div>` : ""}
        </div>
      </details>`;
    }
    function wireReview(out) {
      const save = () => store.set("cam-rev:" + id, rev);
      // Save the automatic reasons so they stay with the review even if the learner changes nothing.
      $$(".rv-item", out).forEach((it) => {
        const i = +it.dataset.i, sel = $(".rv-reason", it);
        if (sel && String(keyState.k[i] || "").trim() && !(rev[i] && rev[i].reason != null) && sel.value) { rev[i] = { ...(rev[i] || {}), reason: sel.value, auto: true }; }
      });
      save();
      out.addEventListener("change", (e) => {
        const it = e.target.closest(".rv-item"); if (!it) return;
        const i = +it.dataset.i;
        rev[i] = rev[i] || {};
        if (e.target.classList.contains("rv-type")) {
          rev[i].type = e.target.value;
          const T = CTYPES[skill].find((x) => x[0] === e.target.value), tip = Review.TYPES[T[2]];
          $(".rv-tt", it).textContent = T[1];
          const tipEl = $(".rv-tip", it); if (tipEl && tip) tipEl.innerHTML = `<b>💡 ${esc(T[1])}:</b> ${tip.tip}`;
        }
        if (e.target.classList.contains("rv-reason")) {
          rev[i].reason = e.target.value; rev[i].auto = false;
          const r = REASON[e.target.value];
          $(".rv-fix", it).innerHTML = r && r[0] ? `<b>🛠 How to fix it:</b> ${esc(r[2])}` : "";
        }
        save();
      });
      let noteT = null;
      out.addEventListener("input", (e) => {
        if (!e.target.classList.contains("rv-note")) return;
        const i = +e.target.closest(".rv-item").dataset.i;
        rev[i] = { ...(rev[i] || {}), note: e.target.value };
        clearTimeout(noteT); noteT = setTimeout(save, 400);
      });
      $(".rv-filter", out).addEventListener("click", (e) => {
        const btn = e.target.closest("button"); if (!btn) return;
        $$("button", btn.parentElement).forEach((x) => x.classList.toggle("on", x === btn));
        $$(".rv-item", out).forEach((it) => {
          const good = it.dataset.ok === "1";
          it.hidden = (btn.dataset.f === "wrong" && good) || (btn.dataset.f === "right" && !good);
        });
      });
    }
    count();
    if (store.get("cam-mark:" + id, null)) showResult(false);
    return { destroy() { timer.pause(); } };
  }

  /* ---------------------------------------------- Writing */
  function runWriting(host, b, t) {
    const s = camSelf()[tid(b, t)] || {};
    return window.IELTS.WritingRoom(host, { task1: {}, task2: {} }, {
      title: `${name(b, t)} · Writing · 60 minutes`,
      promptKey: (k) => `cam-wp:${tid(b, t)}:${k}`,
      draftKey: (k) => `cam-w:${tid(b, t)}:${k}`,
      note: "Then compare with the <b>sample answers and examiner comments</b> at the back of your Cambridge book.",
      saved: { band: s.writing, crit: s.wcrit },
      onScore: (band, crit) => { setCamSelf(b, t, { writing: band, wcrit: crit }); renderGrid(); renderResults(); },
    });
  }

  /* ---------------------------------------------- Speaking */
  function runSpeaking(host, b, t) {
    const key = `cam-sq:${tid(b, t)}`;
    const q = store.get(key, { p1: "", p2: "", p3: "" });
    host.innerHTML = `
      <div class="glass card sp-setup">
        <p class="small" style="margin-top:0">Type the examiner's questions from <b>Cambridge IELTS ${b}, Test ${t}, Speaking</b>. The examiner voice will read them to you, with the real Part 2 timings. Your questions are saved only in this browser.</p>
        <div class="grid grid-3">
          <label class="small"><b>Part 1</b>: one question per line. A line ending in “:” starts a topic.<textarea class="inp" data-p="p1" rows="9" placeholder="Work or studies:&#10;What do you do?&#10;Why did you choose…?&#10;Music:&#10;…">${esc(q.p1)}</textarea></label>
          <label class="small"><b>Part 2</b>: the cue card (first line = topic, then the points, last line “and explain…”)<textarea class="inp" data-p="p2" rows="9" placeholder="Describe a …&#10;You should say:&#10;what it was&#10;when it happened&#10;…&#10;and explain why …">${esc(q.p2)}</textarea></label>
          <label class="small"><b>Part 3</b>: one question per line<textarea class="inp" data-p="p3" rows="9" placeholder="Why do people…?&#10;Do you think…?&#10;…">${esc(q.p3)}</textarea></label>
        </div>
        <div class="row mt"><button class="btn primary sp-go" type="button">▶ Start the speaking test</button><span class="small muted">No questions yet? Leave a part empty and it will be skipped.</span></div>
      </div>
      <div class="sp-room mt"></div>`;
    $$("textarea[data-p]", host).forEach((ta) => ta.addEventListener("input", () => { q[ta.dataset.p] = ta.value; store.set(key, q); }));
    let room = null;
    const lines = (s) => String(s || "").split(/\r?\n/).map((x) => x.replace(/^[\s\-•*·\d.)]+/, "").trim()).filter(Boolean);
    $(".sp-go", host).addEventListener("click", () => {
      const part1 = [];
      lines(q.p1).forEach((l) => {
        if (/:$/.test(l)) part1.push({ topic: l.slice(0, -1).trim(), qs: [] });
        else { if (!part1.length) part1.push({ topic: "", qs: [] }); part1[part1.length - 1].qs.push(l); }
      });
      const p2 = lines(q.p2).filter((l) => !/^you should say:?$/i.test(l));
      const S = {
        part1: part1.filter((x) => x.qs.length),
        part2: p2.length ? { card: p2[0], bullets: p2.slice(1).filter((l) => !/^and\b/i.test(l)), end: p2.slice(1).find((l) => /^and\b/i.test(l)) || "", theme: p2[0].replace(/^describe\s+/i, "").replace(/\.$/, "") } : null,
        part3: lines(q.p3),
      };
      if (!S.part1.length && !S.part2 && !S.part3.length) { toast("Type at least one question first."); return; }
      if (room) room.destroy();
      const s = camSelf()[tid(b, t)] || {};
      room = window.IELTS.SpeakingRoom($(".sp-room", host), S, {
        name: `cambridge${b}-test${t}-speaking`, label: `${name(b, t)} speaking`,
        saved: { band: s.speaking, crit: s.scrit },
        onScore: (band, crit) => { setCamSelf(b, t, { speaking: band, scrit: crit }); renderGrid(); renderResults(); },
      });
      $(".sp-room", host).scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return { destroy() { if (room) room.destroy(); } };
  }

  /* ================================================== Results & analysis */
  function renderResults() {
    const res = getResults(), self = camSelf();
    const ids = new Set();
    Object.keys(res).forEach((k) => { const m = k.match(/^cambridge:(b\d+t\d+):/); if (m) ids.add(m[1]); });
    Object.keys(self).forEach((k) => { const s = self[k]; if (s.writing != null || s.speaking != null) ids.add(k); });
    const rows = [...ids].map((k) => { const [, b, t] = k.match(/b(\d+)t(\d+)/); return [+b, +t]; }).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
    const host = $("#cam-results");
    if (!rows.length) { host.innerHTML = `<p class="muted">No Cambridge results yet. Mark a Listening or Reading test, or score a Writing or Speaking test, and it will appear here.</p>`; return; }
    host.innerHTML = `<div class="table-wrap"><table class="t compact"><thead><tr><th>Test</th><th class="num">Listening</th><th class="num">Reading</th><th class="num">Writing</th><th class="num">Speaking</th><th class="num">Overall</th><th></th></tr></thead><tbody>${rows.map(([b, t]) => {
      const sc = scoresFor(b, t);
      const L = sc.listening, R = sc.reading;
      const bands = [L && L.band, R && R.band, sc.writing, sc.speaking];
      const o = bands.every((x) => x != null) ? overallBand(bands) : null;
      const cell = (v, raw) => (v == null ? `<td class="num muted">–</td>` : `<td class="num ${v >= 7 ? "c-green" : ""}">${fmtBand(v)}${raw != null ? ` <span class="muted small">(${raw}/40)</span>` : ""}</td>`);
      return `<tr><td><a href="#b=${b}&t=${t}&s=listening">${esc(name(b, t))}</a></td>${cell(L && L.band, L && L.raw)}${cell(R && R.band, R && R.raw)}${cell(sc.writing)}${cell(sc.speaking)}<td class="num"><b class="${o && o.band >= 7 ? "c-green" : ""}">${o ? fmtBand(o.band) : "–"}</b></td>
        <td><button class="btn sm ghost" type="button" data-track="${b}-${t}">📈 To tracker</button></td></tr>`;
    }).join("")}</tbody></table></div>`;
    $$("[data-track]", host).forEach((btn) => btn.addEventListener("click", () => {
      const [b, t] = btn.dataset.track.split("-").map(Number), sc = scoresFor(b, t);
      const mocks = store.get("mocks", []);
      mocks.push({ date: new Date().toISOString().slice(0, 10), l: sc.listening ? sc.listening.raw : "", r: sc.reading ? sc.reading.raw : "", w: sc.writing != null ? sc.writing : "", s: sc.speaking != null ? sc.speaking : "", note: name(b, t) });
      store.set("mocks", mocks);
      btn.disabled = true; btn.textContent = "✓ Saved";
    }));
  }

  /* ================================================== Boot */
  renderRanges();
  renderGrid();
  paintPick();
  renderResults();
  function route() {
    const m = location.hash.match(/b=(\d+)&t=(\d)&s=(\w+)/);
    if (!m || +m[1] < 1 || +m[1] > 21 || +m[2] < 1 || +m[2] > 4 || !SK[m[3]]) return;
    pick.book = +m[1]; pick.test = +m[2]; pick.skill = m[3];
    const r = RANGES.find((x) => x.books.includes(pick.book));
    if (r) pick.range = r.id;
    renderRanges(); renderGrid(); paintPick();
    open(pick.book, pick.test, pick.skill);
  }
  window.addEventListener("hashchange", route);
  route();
  window.addEventListener("beforeunload", () => { if (current && current.destroy) current.destroy(); });

  // Exposed for tests
  window.IELTS.Cambridge = { parseKey, expandKey, mark, matchOne };
})();
