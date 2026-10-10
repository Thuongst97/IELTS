/* Study plan: diagnosis, saved roadmap, mock tracker with chart, checklists. */
(function () {
  "use strict";
  const { $, $$, esc, store, rawToBand, overallBand, fmtBand, getResults, toast } = window.IELTS;

  /* ================================================== Diagnose */
  const SK = [["l", "Listening"], ["r", "Reading"], ["w", "Writing"], ["s", "Speaking"]];
  const bandOpts = (v) => Array.from({ length: 13 }, (_, i) => 3 + i * 0.5).reverse().map((b) => `<option ${+v === b ? "selected" : ""}>${b.toFixed(1)}</option>`).join("");
  const dg = store.get("diagnose", { l: 6.5, r: 6.5, w: 6, s: 6 });
  $("#dg").innerHTML = SK.map(([k, n]) => `<label>${n}<select class="inp" data-k="${k}">${bandOpts(dg[k])}</select></label>`).join("") + `<span></span>`;
  const ADVICE = {
    l: "Do the dictation trainer daily and one Listening section per day; build a spelling list.",
    r: "Practise timed passages (20 min each) and the TFNG trainer; review every mistake by question type.",
    w: "Write 3 essays a week, rewrite each one using the Band 6 → 7 upgrades, and get some marked by a teacher.",
    s: "Record yourself daily (Part 2 + Part 3), work on final sounds and word stress, and use the 4-step Part 3 framework.",
  };
  const LINK = { l: "listening.html", r: "reading.html", w: "writing.html", s: "speaking.html" };
  function diagnose() {
    $$("#dg select").forEach((s) => { dg[s.dataset.k] = +s.value; });
    store.set("diagnose", dg);
    const res = overallBand(SK.map(([k]) => dg[k]));
    const weak = SK.filter(([k]) => dg[k] < 7).sort((a, b) => dg[a[0]] - dg[b[0]]);
    $("#dg-out").innerHTML = `<div class="calc-out" style="margin:0"><div><span class="small muted">Current overall</span><div class="big">${fmtBand(res.band)}</div></div>
      <div class="small">${res.band >= 7 ? `<span class="c-green">You're at 7.0 — now secure every skill at 7 for a safety margin.</span>` : `Gap to 7.0: <b>${(27 - SK.reduce((a, [k]) => a + dg[k], 0)).toFixed(1)}</b> band point(s) in total.`}</div></div>
      ${weak.length ? `<h4>Your priorities</h4><ol class="small">${weak.map(([k, n]) => `<li><b>${n} (${fmtBand(dg[k])})</b> — ${ADVICE[k]} <a href="${LINK[k]}">Open module →</a></li>`).join("")}</ol>` : ""}`;
  }
  $("#dg").addEventListener("change", diagnose);
  diagnose();

  /* ================================================== Roadmap */
  const PHASES = [
    { name: "Phase 1 · Foundation", weeks: "Weeks 1–3", accent: "var(--blue)", items: [
      ["Week 1", ["Read the Overview module (structure & scoring)", "Diagnostic: Listening test on this site", "Diagnostic: Reading test on this site (60 min)", "Write one Task 2 essay in 40 min (Writing studio)", "Record a Part 2 answer and listen back", "Start a mistake log (notebook or spreadsheet)"]],
      ["Week 2", ["Dictation trainer: 5 days × 5 min", "TFNG trainer + Reading question-type tactics", "Grammar 7.2–7.4 (complex sentences, tenses, conditionals)", "Write 2 Task 1 reports (line graph, bar chart)", "Flashcards: Environment + Education"]],
      ["Week 3", ["Speaking Part 1: practise 5 topics, recorded", "Grammar 7.7 (articles & agreement) + error quiz", "Write 2 Task 2 essays (opinion, discussion)", "Compare your essays with the model essays", "Flashcards: Technology + Health"]],
    ] },
    { name: "Phase 2 · Skill building", weeks: "Weeks 4–7", accent: "var(--green)", items: [
      ["Week 4", ["3 matching-headings passages (timed)", "Listening Part 3 practice ×2", "Task 1: process diagram + maps", "Speaking Part 2: 5 cue cards with 1-min notes"]],
      ["Week 5", ["Listening Part 4 lectures ×2 + spelling list", "3 timed Reading passages", "Task 2: problem/solution + advantages/disadvantages", "Pronunciation drills daily (final sounds, stress)"]],
      ["Week 6", ["Full mock #1 (Cambridge): L + R + W", "Speaking Part 3: answer 10 questions with the 4-step framework", "Rewrite your weakest essay with the Band 6 → 7 upgrades", "Flashcards: Work + Society"]],
      ["Week 7", ["Analyse mock #1 mistakes by question type", "3 timed Task 2 essays", "Paraphrasing drills (Vocabulary 6.4)", "Flashcards: Crime + Culture"]],
    ] },
    { name: "Phase 3 · Exam practice", weeks: "Weeks 8–10", accent: "var(--gold)", items: [
      ["Week 8", ["Full mock #2", "Get one essay marked by a teacher or partner", "Full Speaking test ×2, recorded", "Flashcards: Cities + Media"]],
      ["Week 9", ["Full mock #3", "Focus week: your weakest skill (see diagnosis)", "Writing: 2 Task 1 + 2 Task 2 timed"]],
      ["Week 10", ["Full mock #4", "Speaking mock with a partner/teacher", "Review all flashcards (Practise all)"]],
    ] },
    { name: "Phase 4 · Final polish", weeks: "Weeks 11–12", accent: "var(--red)", items: [
      ["Week 11", ["Full mock #5 at the same time of day as your real test", "Re-read your whole mistake log", "Polish Task 1 overviews and Task 2 introductions"]],
      ["Week 12", ["Light practice only (no new material)", "Complete the test-day checklist", "Sleep well for two nights before the test"]],
    ] },
  ];
  let done = store.get("roadmap", {});
  const host = $("#roadmap-host");
  function renderRoadmap() {
    let total = 0, ticked = 0;
    host.innerHTML = PHASES.map((ph, pi) => {
      let pt = 0, pd = 0;
      const weeks = ph.items.map(([wk, tasks], wi) => `<div class="plan-week"><h4>${wk}</h4><div class="checklist">${tasks.map((t, ti) => {
        const id = `${pi}-${wi}-${ti}`; pt++; total++;
        if (done[id]) { pd++; ticked++; }
        return `<label><input type="checkbox" data-id="${id}" ${done[id] ? "checked" : ""}><span>${esc(t)}</span></label>`;
      }).join("")}</div></div>`).join("");
      return `<div class="plan-phase glass" style="--accent:${ph.accent}"><header><h3>${ph.name}</h3><span class="badge gray">${ph.weeks}</span><span class="pp-prog">${pd}/${pt}</span></header><div class="plan-weeks">${weeks}</div></div>`;
    }).join("");
    $("#rm-total").textContent = `Overall progress: ${ticked}/${total} tasks (${Math.round((ticked / total) * 100)}%)`;
    store.set("roadmap-pct", Math.round((ticked / total) * 100));
  }
  host.addEventListener("change", (e) => {
    const id = e.target.dataset.id; if (!id) return;
    if (e.target.checked) done[id] = Date.now(); else delete done[id];
    store.set("roadmap", done);
    renderRoadmap();
  });
  $("#rm-reset").addEventListener("click", () => { if (confirm("Clear all ticked tasks?")) { done = {}; store.set("roadmap", done); renderRoadmap(); } });
  renderRoadmap();

  /* ================================================== Tracker */
  const form = $("#tr-form");
  const b9 = Array.from({ length: 15 }, (_, i) => 9 - i * 0.5).map((b) => `<option>${b.toFixed(1)}</option>`).join("");
  form.w.insertAdjacentHTML("beforeend", b9);
  form.s.insertAdjacentHTML("beforeend", b9);
  form.date.valueAsDate = new Date();
  let mocks = store.get("mocks", []);
  const bandsOf = (m) => ({
    l: m.l === "" || m.l == null ? null : rawToBand(+m.l, 40, "listening"),
    r: m.r === "" || m.r == null ? null : rawToBand(+m.r, 40, "reading-ac"),
    w: m.w === "" || m.w == null ? null : +m.w,
    s: m.s === "" || m.s == null ? null : +m.s,
  });
  function renderTracker() {
    mocks.sort((a, b) => a.date.localeCompare(b.date));
    const tb = $("#tr-table tbody");
    tb.innerHTML = mocks.length ? mocks.map((m, i) => {
      const b = bandsOf(m);
      const o = [b.l, b.r, b.w, b.s].every((x) => x != null) ? overallBand([b.l, b.r, b.w, b.s]).band : null;
      const cell = (raw, band) => band == null ? "–" : `${raw} <span class="muted">(${fmtBand(band)})</span>`;
      return `<tr><td>${esc(m.date)}</td><td class="num">${cell(m.l, b.l)}</td><td class="num">${cell(m.r, b.r)}</td><td class="num">${fmtBand(b.w)}</td><td class="num">${fmtBand(b.s)}</td><td class="num"><b class="${o >= 7 ? "c-green" : ""}">${fmtBand(o)}</b></td><td><button class="btn sm ghost" data-del="${i}" type="button" aria-label="Delete">✕</button></td></tr>`;
    }).join("") : `<tr><td colspan="7" class="muted">No mock tests logged yet.</td></tr>`;
    renderChart();
  }
  function renderChart() {
    const host = $("#tr-chart");
    if (mocks.length < 2) { host.innerHTML = `<p class="small muted">Add at least two tests to see your progress chart.</p>`; return; }
    const W = 640, H = 240, P = { l: 36, r: 16, t: 14, b: 30 }, min = 4, max = 9;
    const xs = (i) => P.l + (i / (mocks.length - 1)) * (W - P.l - P.r);
    const ys = (v) => H - P.b - ((v - min) / (max - min)) * (H - P.t - P.b);
    const COL = { l: "#70cff8", r: "#34d399", w: "#d4af37", s: "#a78bfa" };
    let s = "";
    for (let v = min; v <= max; v++) s += `<line class="ch-grid" x1="${P.l}" x2="${W - P.r}" y1="${ys(v)}" y2="${ys(v)}"/><text class="ch-tick" x="${P.l - 6}" y="${ys(v) + 4}" text-anchor="end">${v}</text>`;
    s += `<line class="tgt" x1="${P.l}" x2="${W - P.r}" y1="${ys(7)}" y2="${ys(7)}"/><text class="ch-tick" x="${W - P.r}" y="${ys(7) - 5}" text-anchor="end" style="fill:var(--gold)">target 7.0</text>`;
    SK.forEach(([k]) => {
      const pts = mocks.map((m, i) => [i, bandsOf(m)[k]]).filter(([, v]) => v != null);
      if (!pts.length) return;
      s += `<polyline class="ln" stroke="${COL[k]}" points="${pts.map(([i, v]) => `${xs(i)},${ys(v)}`).join(" ")}"/>`;
      s += pts.map(([i, v]) => `<circle class="dot" cx="${xs(i)}" cy="${ys(v)}" r="4" fill="${COL[k]}"><title>${k.toUpperCase()} ${v}</title></circle>`).join("");
    });
    mocks.forEach((m, i) => { s += `<text class="ch-tick" x="${xs(i)}" y="${H - 10}" text-anchor="middle">${esc(m.date.slice(5))}</text>`; });
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mock test bands over time">${s}</svg><div class="ch-legend">${SK.map(([k, n]) => `<span><i style="background:${COL[k]}"></i>${n}</span>`).join("")}</div>`;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const m = { date: f.get("date"), l: f.get("l"), r: f.get("r"), w: f.get("w"), s: f.get("s") };
    if (!m.l && !m.r && !m.w && !m.s) { toast("Enter at least one score."); return; }
    mocks.push(m);
    store.set("mocks", mocks);
    form.reset(); form.date.valueAsDate = new Date();
    renderTracker();
    toast("Mock test saved");
  });
  $("#tr-table").addEventListener("click", (e) => {
    const b = e.target.closest("[data-del]"); if (!b) return;
    mocks.splice(+b.dataset.del, 1);
    store.set("mocks", mocks);
    renderTracker();
  });
  renderTracker();

  // Results from this site's quizzes
  const LABELS = { "listening:full": "Listening test (40)", "reading:full": "Reading test (40)", "reading:tfng": "TFNG trainer", "grammar:errors": "Grammar error quiz", "vocabulary:collocations": "Collocation quiz", "vocabulary:paraphrase": "Paraphrase quiz", "overview:sample": "Overview sample questions" };
  const res = getResults();
  const keys = Object.keys(res);
  $("#tr-site").innerHTML = keys.length
    ? `<div class="table-wrap"><table class="t compact"><thead><tr><th>Practice</th><th class="num">Last score</th><th class="num">Best</th><th class="num">Est. band</th><th class="num">Attempts</th><th>Last attempt</th></tr></thead><tbody>${keys.map((k) => {
        const r = res[k];
        const m = k.match(/^practice:t(\d+):(\w+)$/);
        const label = LABELS[k] || (m ? `Practice Test ${m[1]} · ${m[2][0].toUpperCase() + m[2].slice(1)}` : k);
        return `<tr><td>${esc(label)}</td><td class="num">${r.raw}/${r.total}</td><td class="num">${r.best}/${r.total}</td><td class="num">${r.band != null ? fmtBand(r.band) : "–"}</td><td class="num">${r.attempts || 1}</td><td>${esc(new Date(r.date).toLocaleDateString())}</td></tr>`;
      }).join("")}</tbody></table></div>`
    : `<p class="muted">No results yet — try the <a href="listening.html#practice">Listening</a> or <a href="reading.html#practice">Reading</a> test.</p>`;

  /* ================================================== Checklists */
  const LISTS = {
    before: ["Confirm the test date, time and venue (and Speaking time)", "Check your passport/ID is valid and the same one you registered with", "Do your last full mock test at least 3 days before", "Visit or look up the route to the test centre", "Read the test centre rules (what you can bring)"],
    day: ["Eat a proper breakfast; bring water if allowed", "Arrive at least 30 minutes early with your ID", "Use the toilet before Listening — the first three papers run without a break", "Wear comfortable layers (rooms can be cold)", "Stay calm: one difficult section doesn't decide your band"],
    during: ["Listening: read ahead during every pause", "Listening (paper): transfer answers in CAPITAL letters", "Reading: stick to ~20 minutes per passage; never leave blanks", "Writing: start with Task 2 if you prefer — it's worth double", "Writing: leave 3 minutes to check articles, plurals and verb tenses", "Check word limits in Listening and Reading answers"],
    speaking: ["Smile and treat it as a conversation", "Extend Part 1 answers (answer → reason → detail)", "Use the full minute to make Part 2 notes", "Keep talking in Part 2 until the examiner stops you", "Ask the examiner to repeat a question if needed — it's allowed"],
  };
  const ticks = store.get("checklists", {});
  $$("[data-list]").forEach((box) => {
    const name = box.dataset.list;
    box.innerHTML = LISTS[name].map((t, i) => `<label><input type="checkbox" data-id="${name}-${i}" ${ticks[`${name}-${i}`] ? "checked" : ""}><span>${esc(t)}</span></label>`).join("");
  });
  document.addEventListener("change", (e) => {
    const id = e.target.dataset && e.target.dataset.id;
    if (!id || !e.target.closest("[data-list]")) return;
    ticks[id] = e.target.checked;
    store.set("checklists", ticks);
  });
})();
