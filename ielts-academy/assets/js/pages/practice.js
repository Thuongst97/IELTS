/* =========================================================================
   Practice Tests: choose mode / skill / test, then run it.
   Test data lives in assets/js/data/tests/test-NN.js and is loaded on demand.
   ========================================================================= */
(function () {
  "use strict";
  const { $, $$, esc, store, overallBand, fmtBand, getResults } = window.IELTS;
  const INDEX = window.IELTS_TEST_INDEX || [];
  const SK = {
    listening: { name: "Listening", icon: "🎧", short: "L", accent: "#70cff8" },
    reading: { name: "Reading", icon: "📖", short: "R", accent: "#34d399" },
    writing: { name: "Writing", icon: "✍️", short: "W", accent: "#d4af37" },
    speaking: { name: "Speaking", icon: "🎙️", short: "S", accent: "#a78bfa" },
  };
  const ORDER = ["listening", "reading", "writing", "speaking"];

  /* ================================================== Loading */
  const VERSION = ((document.querySelector('script[src*="core.js"]') || {}).src || "").split("v=")[1] || "";
  const pad = (n) => String(n).padStart(2, "0");
  const files = (n) => (n === 1 ? ["data/listening-test.js", "data/reading-test.js", "data/tests/test-01.js"] : [`data/tests/test-${pad(n)}.js`]);
  const loaded = {};
  const loadScript = (src) => new Promise((resolve, reject) => {
    if (loaded[src]) return resolve();
    const s = document.createElement("script");
    s.src = `assets/js/${src}${VERSION ? "?v=" + VERSION : ""}`;
    s.onload = () => { loaded[src] = true; resolve(); };
    s.onerror = () => reject(new Error("Could not load " + src));
    document.body.appendChild(s);
  });
  async function loadTest(n) {
    for (const f of files(n)) await loadScript(f);
    const t = (window.IELTS_TESTS || {})[n];
    if (!t) throw new Error(`Test ${n} is not available.`);
    return t;
  }

  /* ================================================== Scores */
  const self = () => store.get("practice-self", {});
  const setSelf = (n, patch) => { const all = self(); all["t" + n] = { ...(all["t" + n] || {}), ...patch }; store.set("practice-self", all); };
  function scoresFor(n) {
    const res = getResults(), s = self()["t" + n] || {};
    const q = (k) => res[`practice:t${n}:${k}`];
    return { listening: q("listening"), reading: q("reading"), writing: s.writing, speaking: s.speaking, full: s.full };
  }

  /* ================================================== Picker */
  const pick = store.get("practice-pick", { mode: "skill", skill: "listening", test: 1 });
  const grid = $("#test-grid");
  function renderGrid() {
    grid.innerHTML = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
      const m = INDEX[n - 1] || {}, sc = scoresFor(n);
      const chip = (k) => {
        const v = sc[k];
        if (v == null) return `<span>${SK[k].short} –</span>`;
        const band = typeof v === "object" ? v.band : v;
        const label = typeof v === "object" ? `${v.best}/40` : fmtBand(v);
        return `<span class="${band >= 7 ? "ok" : "low"}" title="${SK[k].name}: band ${fmtBand(band)}">${SK[k].short} ${label}</span>`;
      };
      return `<button type="button" class="test-card ${pick.test === n ? "sel" : ""}" data-n="${n}">
        <b>Test ${n}</b>
        <span class="tc-topics">${esc(m.topics || "")}</span>
        <span class="tc-scores">${ORDER.map(chip).join("")}${sc.full ? `<span class="${sc.full.band >= 7 ? "ok" : "low"}">Full ${fmtBand(sc.full.band)}</span>` : ""}</span>
      </button>`;
    }).join("");
  }
  function paintPick() {
    $$("#mode-pick button").forEach((b) => b.classList.toggle("sel", b.dataset.mode === pick.mode));
    $$("#skill-pick button").forEach((b) => b.classList.toggle("sel", b.dataset.skill === pick.skill));
    $("#skill-step").classList.toggle("off", pick.mode === "full");
    $$(".test-card", grid).forEach((c) => c.classList.toggle("sel", +c.dataset.n === pick.test));
    $("#start-summary").innerHTML = pick.mode === "full"
      ? `<b>Test ${pick.test} · Full test</b> — Listening → Reading → Writing → Speaking, then your overall band.`
      : `<b>Test ${pick.test} · ${SK[pick.skill].icon} ${SK[pick.skill].name}</b>`;
    $("#start-btn").textContent = pick.mode === "full" ? `Start full Test ${pick.test} →` : `Start ${SK[pick.skill].name} · Test ${pick.test} →`;
    store.set("practice-pick", pick);
  }
  $("#mode-pick").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { pick.mode = b.dataset.mode; paintPick(); } });
  $("#skill-pick").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { pick.skill = b.dataset.skill; pick.mode = "skill"; paintPick(); } });
  grid.addEventListener("click", (e) => { const b = e.target.closest(".test-card"); if (b) { pick.test = +b.dataset.n; paintPick(); } });
  $("#start-btn").addEventListener("click", () => start(pick.test, pick.mode === "full" ? "full" : pick.skill));

  /* ================================================== Session */
  let session = null, current = null;
  const body = $("#runner-body"), foot = $("#runner-foot");

  async function start(n, what, review) {
    if (current && current.destroy) current.destroy();
    history.replaceState(null, "", `#t=${n}&s=${what}`);
    $("#runner-empty").hidden = true;
    $("#runner-wrap").hidden = false;
    body.innerHTML = `<p class="muted">Loading Test ${n}…</p>`;
    foot.innerHTML = "";
    $("#runner").scrollIntoView({ behavior: "smooth", block: "start" });
    let T;
    try { T = await loadTest(n); } catch (err) { body.innerHTML = `<div class="callout warn"><div class="ci">⚠️</div><div>${esc(err.message)}</div></div>`; return; }
    session = { n, T, full: what === "full", steps: what === "full" ? [...ORDER, "result"] : [what], i: 0, res: {} };
    renderStep();
    if (review && current && current.quiz) current.quiz.showLastAttempt();
  }
  /** Re-open a submitted Listening/Reading paper with its answers, marks and explanations. */
  function openReview(n, skill) {
    pick.test = n; pick.mode = "skill"; pick.skill = skill;
    paintPick();
    start(n, skill, true);
  }

  function renderStep() {
    if (current && current.destroy) current.destroy();
    current = null;
    const { n, T, full, steps, i } = session;
    const step = steps[i];
    $("#rh-eyebrow").textContent = `Test ${n} · ${full ? "Full test (4 skills)" : "Single skill"}`;
    $("#rh-title").textContent = step === "result" ? "🏁 Your band report" : `${SK[step].icon} ${SK[step].name}`;
    const stepper = $("#stepper");
    stepper.hidden = !full;
    if (full) stepper.innerHTML = steps.map((s, k) => `<span class="${k === i ? "on" : k < i ? "done" : ""}">${k + 1} · ${s === "result" ? "Result" : SK[s].name}</span>`).join("");
    body.innerHTML = "";
    const host = document.createElement("div");
    body.appendChild(host);
    const id = (k) => `practice:t${n}:${k}`;
    if (step === "listening") current = window.IELTS.ListeningRunner(host, T.listening, { id: id("listening"), title: `Test ${n} · Listening · 40 questions`, onCheck: (r) => { session.res.listening = r; renderGrid(); } });
    else if (step === "reading") current = window.IELTS.ReadingRunner(host, T.reading, { id: id("reading"), title: `Test ${n} · Reading · 40 questions`, onCheck: (r) => { session.res.reading = r; renderGrid(); } });
    else if (step === "writing") current = runWriting(host, T.writing, n);
    else if (step === "speaking") current = runSpeaking(host, T.speaking, n);
    else current = runResult(host);

    foot.innerHTML = "";
    if (full && step !== "result") {
      const btn = document.createElement("button");
      btn.className = "btn primary"; btn.type = "button";
      btn.textContent = i === 3 ? "Finish test & see my band →" : `Submit ${SK[step].name} & continue to ${SK[steps[i + 1]].name} →`;
      btn.addEventListener("click", () => {
        if ((step === "listening" || step === "reading") && current.quiz && !current.quiz.checked) {
          if (!confirm(`Submit your ${SK[step].name} answers now? Unanswered questions will be marked wrong.`)) return;
          current.quiz.check();
        }
        session.i++;
        renderStep();
        $("#runner").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      foot.appendChild(btn);
    } else if (!full) {
      foot.innerHTML = `<a class="btn ghost" href="#choose">↑ Choose another test</a>` +
        (session.n < 10 ? `<button class="btn" type="button" data-next>Next: Test ${session.n + 1} · ${SK[step].name} →</button>` : "");
      const nx = $("[data-next]", foot);
      if (nx) nx.addEventListener("click", () => { pick.test = session.n + 1; paintPick(); start(session.n + 1, step); });
    }
  }
  $("#rh-exit").addEventListener("click", () => {
    if (!confirm("Exit this test? Listening/Reading answers and writing drafts are saved in this browser.")) return;
    if (current && current.destroy) current.destroy();
    current = null; session = null;
    $("#runner-wrap").hidden = true; $("#runner-empty").hidden = false;
    history.replaceState(null, "", location.pathname);
    renderGrid();
    $("#choose").scrollIntoView({ behavior: "smooth" });
  });

  /* ================================================== Writing & Speaking (shared rooms in rooms.js) */
  function runWriting(host, W, n) {
    const s = self()["t" + n] || {};
    return window.IELTS.WritingRoom(host, W, {
      draftKey: (k) => `pw:${n}:${k}`,
      saved: { band: s.writing, crit: s.wcrit },
      onScore: (band, crit) => { setSelf(n, { writing: band, wcrit: crit }); renderGrid(); },
    });
  }
  function runSpeaking(host, S, n) {
    const s = self()["t" + n] || {};
    return window.IELTS.SpeakingRoom(host, S, {
      name: `test${n}-speaking`, label: `Test ${n} speaking`,
      saved: { band: s.speaking, crit: s.scrit },
      onScore: (band, crit) => { setSelf(n, { speaking: band, scrit: crit }); renderGrid(); },
    });
  }

  /* ================================================== Result (full test) */
  function runResult(host) {
    const { n, res } = session;
    const s = self()["t" + n] || {};
    const L = res.listening ? res.listening.band : null, R = res.reading ? res.reading.band : null;
    const W = s.writing != null ? s.writing : null, Sp = s.speaking != null ? s.speaking : null;
    const all = [L, R, W, Sp];
    const o = all.every((x) => x != null) ? overallBand(all) : null;
    if (o) setSelf(n, { full: { band: o.band, l: L, r: R, w: W, s: Sp, date: new Date().toISOString() } });
    renderGrid();
    const cell = (label, v, extra = "") => `<div><small>${label}</small><b class="${v != null && v >= 7 ? "c-green" : ""}">${fmtBand(v)}</b>${extra}</div>`;
    const weakest = o ? ORDER.map((k, i) => [k, all[i]]).sort((a, b) => a[1] - b[1])[0] : null;
    host.innerHTML = `
      <div class="result-grid">
        ${cell("Listening", L, res.listening ? `<span class="small muted">${res.listening.raw}/40</span>` : "")}
        ${cell("Reading", R, res.reading ? `<span class="small muted">${res.reading.raw}/40</span>` : "")}
        ${cell("Writing", W, `<span class="small muted">self-assessed</span>`)}
        ${cell("Speaking", Sp, `<span class="small muted">self-assessed</span>`)}
        <div class="overall"><small>Overall</small><b class="${o && o.band >= 7 ? "c-green" : ""}">${o ? fmtBand(o.band) : "–"}</b>${o ? `<span class="small muted">avg ${o.avg.toFixed(2)}</span>` : ""}</div>
      </div>
      ${o ? `<div class="callout ${o.band >= 7 ? "tip" : "target"}"><div class="ci">${o.band >= 7 ? "🎉" : "🎯"}</div><div><span class="ct">${o.band >= 7 ? "Band 7 reached" : "Next step"}</span>
        <p>${o.band >= 7 ? "Excellent. Keep a safety margin: aim for 7 or above in every skill, not just overall." : `Your lowest skill is <b>${SK[weakest[0]].name} (${fmtBand(weakest[1])})</b>. Spend most of next week there — see the <a href="${weakest[0]}.html">${SK[weakest[0]].name} module</a>.`}</p></div></div>`
      : `<div class="callout warn"><div class="ci">⚠️</div><div>Some sections have no score yet (complete the self-assessment in Writing/Speaking, or submit Listening/Reading).</div></div>`}
      <div class="row">
        ${o ? `<button class="btn" type="button" id="to-tracker">📈 Save to mock-test tracker</button>` : ""}
        <a class="btn ghost" href="plan.html#tracker">Open tracker</a>
        ${res.listening ? `<button class="btn ghost" type="button" data-review="listening">📋 Listening answers &amp; explanations</button>` : ""}
        ${res.reading ? `<button class="btn ghost" type="button" data-review="reading">📋 Reading answers &amp; explanations</button>` : ""}
        ${n < 10 ? `<button class="btn primary" type="button" id="next-full">Next: full Test ${n + 1} →</button>` : ""}
      </div>`;
    const t = $("#to-tracker", host);
    if (t) t.addEventListener("click", () => {
      const mocks = store.get("mocks", []);
      mocks.push({ date: new Date().toISOString().slice(0, 10), l: res.listening ? res.listening.raw : "", r: res.reading ? res.reading.raw : "", w: W, s: Sp, note: `Practice Test ${n}` });
      store.set("mocks", mocks);
      t.disabled = true; t.textContent = "✓ Saved to tracker";
    });
    $$("[data-review]", host).forEach((b) => b.addEventListener("click", () => openReview(n, b.dataset.review)));
    const nx = $("#next-full", host);
    if (nx) nx.addEventListener("click", () => { pick.test = n + 1; pick.mode = "full"; paintPick(); start(n + 1, "full"); });
    return null;
  }

  /* ================================================== Boot */
  renderGrid();
  paintPick();
  function route() {
    const m = location.hash.match(/t=(\d+)&s=(\w+)/);
    if (!m || +m[1] < 1 || +m[1] > 10 || !(m[2] === "full" || SK[m[2]])) return;
    if (session && session.n === +m[1] && (session.full ? "full" : session.steps[0]) === m[2]) return;
    pick.test = +m[1];
    if (m[2] === "full") pick.mode = "full"; else { pick.mode = "skill"; pick.skill = m[2]; }
    paintPick();
    start(+m[1], m[2]);
  }
  window.addEventListener("hashchange", route);
  route();
  window.addEventListener("beforeunload", () => { if (current && current.destroy) current.destroy(); });
})();
