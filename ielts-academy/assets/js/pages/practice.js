/* =========================================================================
   Practice Tests: choose mode / skill / test, then run it.
   Test data lives in assets/js/data/tests/test-NN.js and is loaded on demand.
   ========================================================================= */
(function () {
  "use strict";
  const { $, $$, esc, store, toast, TTS, Timer, overallBand, fmtBand, getResults, initTabs } = window.IELTS;
  const INDEX = window.IELTS_TEST_INDEX || [];
  const SK = {
    listening: { name: "Listening", icon: "🎧", short: "L", accent: "#70cff8" },
    reading: { name: "Reading", icon: "📖", short: "R", accent: "#34d399" },
    writing: { name: "Writing", icon: "✍️", short: "W", accent: "#d4af37" },
    speaking: { name: "Speaking", icon: "🎙️", short: "S", accent: "#a78bfa" },
  };
  const ORDER = ["listening", "reading", "writing", "speaking"];
  const BANDS = Array.from({ length: 13 }, (_, i) => 3 + i * 0.5);
  const bandSelect = (cls, v, data = "") => `<select class="inp ${cls}" ${data}>${BANDS.slice().reverse().map((b) => `<option value="${b}" ${+v === b ? "selected" : ""}>${b.toFixed(1)}</option>`).join("")}</select>`;
  const halfDown = (x) => Math.floor(x * 2 + 1e-9) / 2;
  const halfNear = (x) => Math.round(x * 2) / 2;

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

  async function start(n, what) {
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

  /* ================================================== Writing */
  const words = (s) => (s.trim().match(/\S+/g) || []).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  function runWriting(host, W, n) {
    const saved = self()["t" + n] || {};
    const crit = saved.wcrit || { t1: [6, 6, 6, 6], t2: [6, 6, 6, 6] };
    const task = (k, t) => `
      <div class="task-panel">
        <div>
          <div class="studio-prompt"><b>Task ${k} · about ${k === 1 ? 20 : 40} minutes.</b> ${esc(t.prompt).replace(/ • /g, "<br>• ")}</div>
          ${t.chart ? window.IELTS.Charts.render(t.chart) : ""}
          <details class="acc"><summary>Band 7 plan — open after you finish</summary><div class="acc-body"><ul class="small">${t.plan.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div></details>
        </div>
        <div>
          <textarea data-task="${k}" spellcheck="false" placeholder="Write your Task ${k} answer here…"></textarea>
          <div class="studio-stats"><span>Words: <b class="wc">0</b> / ${k === 1 ? 150 : 250}</span><span>Paragraphs: <b class="pc">0</b></span><span class="saved small"></span></div>
        </div>
      </div>`;
    host.innerHTML = `
      <div class="quiz-bar"><span class="qb-title">Writing · 2 tasks · 60 minutes</span><span class="qb-count">Task 2 counts twice as much as Task 1</span><span class="spacer"></span><span class="w-timer"></span></div>
      <div class="tabs" data-tabs>
        <div class="tab-list" role="tablist"><button data-tab="t1">Task 1</button><button data-tab="t2">Task 2</button><button data-tab="self">Self-assessment</button></div>
        <div class="tab-panel" data-panel="t1">${task(1, W.task1)}</div>
        <div class="tab-panel" data-panel="t2">${task(2, W.task2)}</div>
        <div class="tab-panel" data-panel="self">
          <div class="glass card">
            <p class="small">Score each criterion honestly against the <a href="writing.html#criteria" target="_blank">Band 7 descriptors</a>. Compare with the model answers and the Band 7 plans. Each task's score is the average of its four criteria (rounded down, to be safe); the Writing band weights Task 2 twice.</p>
            <h4>Task 1</h4><div class="crit-grid">${["Task Achievement", "Coherence & Cohesion", "Lexical Resource", "Grammar"].map((c, i) => `<label>${c}${bandSelect("wcrit", crit.t1[i], `data-t="t1" data-i="${i}"`)}</label>`).join("")}</div>
            <h4>Task 2</h4><div class="crit-grid">${["Task Response", "Coherence & Cohesion", "Lexical Resource", "Grammar"].map((c, i) => `<label>${c}${bandSelect("wcrit", crit.t2[i], `data-t="t2" data-i="${i}"`)}</label>`).join("")}</div>
            <div class="calc-out" id="w-out"></div>
          </div>
        </div>
      </div>`;
    initTabs(host);
    const timer = new Timer($(".w-timer", host), { minutes: 60, label: "Time left", warnAt: 600 });
    let saveT = null;
    $$("textarea", host).forEach((ta) => {
      const key = `pw:${n}:${ta.dataset.task}`;
      ta.value = store.get(key, "");
      const panel = ta.parentElement;
      const stat = () => {
        const w = words(ta.value), min = ta.dataset.task === "1" ? 150 : 250;
        const wc = $(".wc", panel); wc.textContent = w; wc.className = "wc " + (w >= min ? "wc-ok" : w > min * 0.7 ? "wc-low" : "");
        $(".pc", panel).textContent = ta.value.split(/\n+/).filter((p) => p.trim()).length;
      };
      stat();
      ta.addEventListener("input", () => {
        stat();
        if (!timer.running && !timer.ended && timer.left === timer.total) timer.start();
        clearTimeout(saveT);
        saveT = setTimeout(() => { store.set(key, ta.value); $(".saved", panel).textContent = "✓ Draft saved"; }, 500);
      });
    });
    const out = $("#w-out", host);
    const compute = (save = true) => {
      $$(".wcrit", host).forEach((s) => { crit[s.dataset.t][+s.dataset.i] = +s.value; });
      const t1 = halfDown(crit.t1.reduce((a, b) => a + b, 0) / 4), t2 = halfDown(crit.t2.reduce((a, b) => a + b, 0) / 4);
      const band = halfNear((t1 + 2 * t2) / 3);
      const w1 = words(store.get(`pw:${n}:1`, "")), w2 = words(store.get(`pw:${n}:2`, ""));
      out.innerHTML = `<div><span class="small muted">Writing band (estimate)</span><div class="big ${band >= 7 ? "c-green" : ""}">${fmtBand(band)}</div></div>
        <div class="small">Task 1: ${fmtBand(t1)} · Task 2: ${fmtBand(t2)}<br>Words: Task 1 ${w1}/150 · Task 2 ${w2}/250
        ${w1 < 150 || w2 < 250 ? `<br><span class="c-amber">⚠ Under-length answers lose marks in Task Achievement / Response.</span>` : ""}</div>`;
      if (save) setSelf(n, { writing: band, wcrit: crit });
      else if (saved.writing == null) out.insertAdjacentHTML("beforeend", `<div class="small c-amber">Not saved yet — change any score to record your self-assessment.</div>`);
      return band;
    };
    host.addEventListener("change", (e) => { if (e.target.classList.contains("wcrit")) { compute(); renderGrid(); } });
    compute(saved.writing != null);
    return { destroy() { timer.pause(); }, band: compute };
  }

  /* ================================================== Speaking */
  function runSpeaking(host, S, n) {
    const saved = self()["t" + n] || {};
    const crit = saved.scrit || [6, 6, 6, 6];
    const seq = [{ kind: "intro" }];
    S.part1.forEach((t) => t.qs.forEach((q, k) => seq.push({ kind: "p1", topic: t.topic, q, first: k === 0 })));
    seq.push({ kind: "p2" });
    S.part3.forEach((q) => seq.push({ kind: "p3", q }));
    seq.push({ kind: "end" });
    host.innerHTML = `
      <div class="glass card">
        <div class="stage sp-stage"><span data-s="p1">Part 1 · Interview</span><span data-s="p2">Part 2 · Long turn</span><span data-s="p3">Part 3 · Discussion</span><span data-s="end">Self-assessment</span></div>
        <div class="cue-card sp-card"></div>
        <div class="row mt">
          <button class="btn primary sp-next" type="button">▶ Start the test</button>
          <button class="btn ghost sp-repeat" type="button">🔁 Repeat question</button>
          <span class="spacer"></span>
          <button class="btn sp-rec" type="button">🎙️ Record whole test</button>
          <span class="small muted sp-recst"></span>
        </div>
        <div class="recordings sp-recs"></div>
      </div>
      <div class="glass card mt sp-self" hidden>
        <h4 style="margin-top:0">Self-assessment</h4>
        <p class="small">Listen to your recording first. Use the <a href="speaking.html#format" target="_blank">Band 7 descriptors</a>; be strict about fluency (long pauses?) and grammar (errors in complex sentences?).</p>
        <div class="crit-grid">${["Fluency & Coherence", "Lexical Resource", "Grammar", "Pronunciation"].map((c, i) => `<label>${c}${bandSelect("scrit", crit[i], `data-i="${i}"`)}</label>`).join("")}</div>
        <div class="calc-out sp-out"></div>
      </div>`;
    const q = (s) => $(s, host);
    const card = q(".sp-card"), btnNext = q(".sp-next"), btnRep = q(".sp-repeat");
    let idx = -1, timerT = null, lastSaid = "";
    const say = (t) => { lastSaid = t; if (TTS.ok) { TTS.cancel(); TTS.speak(t, { rate: 0.95, speaker: 2 }); } };
    const stage = (s) => $$(".sp-stage span", host).forEach((el) => {
      const ord = ["p1", "p2", "p3", "end"];
      el.classList.toggle("on", el.dataset.s === s);
      el.classList.toggle("done", ord.indexOf(el.dataset.s) < ord.indexOf(s));
    });
    card.innerHTML = `<p class="muted" style="margin:0">The examiner's questions will be read aloud. Answer out loud as if you were in the real test. Part 1 answers: 2–4 sentences. Part 3 answers: 4–6 sentences.</p>`;

    function ring(secs, label, onDone) {
      clearInterval(timerT);
      let left = secs;
      const paint = () => {
        const r = $(".ring", card); if (!r) return;
        r.style.setProperty("--p", ((secs - left) / secs) * 100);
        r.style.setProperty("--rc", label === "talk" ? "var(--purple)" : "var(--blue)");
        $(".ring b", card).textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
        $(".ring small", card).textContent = label;
      };
      paint();
      timerT = setInterval(() => { left--; paint(); if (left <= 0) { clearInterval(timerT); onDone(); } }, 1000);
    }
    function show() {
      clearInterval(timerT);
      const it = seq[idx];
      btnRep.disabled = !(it.kind === "p1" || it.kind === "p3");
      if (it.kind === "intro") {
        stage("p1");
        card.innerHTML = `<span class="badge purple">Part 1</span><p class="sp-q">Good morning. My name is Sarah, and I'm your examiner. In this first part, I'd like to ask you some questions about yourself.</p>`;
        say("Good morning. My name is Sarah, and I'm your examiner. In this first part, I'd like to ask you some questions about yourself.");
        btnNext.textContent = "▶ Next question";
      } else if (it.kind === "p1" || it.kind === "p3") {
        stage(it.kind);
        const p1s = seq.filter((x) => x.kind === it.kind), pos = p1s.indexOf(it) + 1;
        const lead = it.kind === "p1" && it.first ? `Let's talk about ${it.topic.toLowerCase()}. ` : it.kind === "p3" && pos === 1 ? `We've been talking about ${S.part2.theme || "this topic"}, and now I'd like to discuss some more general questions related to this. ` : "";
        card.innerHTML = `<span class="badge purple">Part ${it.kind === "p1" ? 1 : 3}${it.topic ? " · " + esc(it.topic) : ""}</span> <span class="small muted">Question ${pos} of ${p1s.length}</span><p class="sp-q">${esc(it.q)}</p>`;
        say(lead + it.q);
        btnNext.textContent = "▶ Next question";
      } else if (it.kind === "p2") {
        stage("p2");
        card.innerHTML = `<div class="grid grid-2" style="align-items:start">
          <div><span class="badge purple">Part 2</span><h4 style="margin:10px 0 6px">${esc(S.part2.card)}</h4><p class="small" style="margin:0">You should say:</p><ul>${S.part2.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul><p class="cc-foot">${esc(S.part2.end)}</p></div>
          <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="ring"><div><span><b>1:00</b><small>prep</small></span></div></div><textarea class="inp" rows="6" style="flex:1 1 160px;min-height:120px" placeholder="Your notes…"></textarea></div></div>`;
        say("Now I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish.");
        btnNext.textContent = "⏭ Skip to Part 3";
        ring(60, "prep", () => {
          say("Alright? Remember, you have one to two minutes for this, so don't worry if I stop you. Can you start speaking now, please?");
          ring(120, "talk", () => { say("Thank you."); btnNext.textContent = "▶ Continue to Part 3"; });
        });
      } else {
        stage("end");
        card.innerHTML = `<p class="sp-q" style="margin:0">Thank you. That is the end of the speaking test. 🎉</p><p class="small muted">Stop the recording, listen back, then score yourself below.</p>`;
        say("Thank you. That is the end of the speaking test.");
        btnNext.disabled = true;
        q(".sp-self").hidden = false;
        if (rec.active) rec.stop();
      }
    }
    btnNext.addEventListener("click", () => { if (idx < seq.length - 1) { idx++; show(); } });
    btnRep.addEventListener("click", () => { if (lastSaid) say(seq[idx].q); });
    btnRep.disabled = true;

    // Recorder (kept in memory only)
    const rec = {
      active: false, mr: null, stream: null, chunks: [], t0: 0,
      async start() {
        if (!navigator.mediaDevices || !window.MediaRecorder) { toast("Recording isn't supported in this browser."); return; }
        try { this.stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { toast("Microphone permission was denied."); return; }
        this.chunks = []; this.mr = new MediaRecorder(this.stream);
        this.mr.ondataavailable = (e) => { if (e.data.size) this.chunks.push(e.data); };
        this.mr.onstop = () => {
          const url = URL.createObjectURL(new Blob(this.chunks, { type: this.mr.mimeType || "audio/webm" }));
          const secs = Math.round((Date.now() - this.t0) / 1000);
          const div = document.createElement("div"); div.className = "rec";
          div.innerHTML = `<b>Test ${n} speaking</b><span class="muted">${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</span><audio controls src="${url}"></audio><a class="btn sm ghost" download="ielts-test${n}-speaking.webm" href="${url}">⬇ Save</a>`;
          q(".sp-recs").prepend(div);
        };
        this.mr.start(); this.active = true; this.t0 = Date.now(); paintRec();
      },
      stop() { if (!this.active) return; this.mr.stop(); this.stream.getTracks().forEach((t) => t.stop()); this.active = false; paintRec(); },
    };
    let recT = null;
    function paintRec() {
      const b = q(".sp-rec"), st = q(".sp-recst");
      clearInterval(recT);
      if (rec.active) {
        b.textContent = "■ Stop recording"; b.classList.add("danger");
        const u = () => { const s = Math.round((Date.now() - rec.t0) / 1000); st.innerHTML = `<span class="rec-dot"></span> ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
        u(); recT = setInterval(u, 1000);
      } else { b.textContent = "🎙️ Record whole test"; b.classList.remove("danger"); st.textContent = ""; }
    }
    q(".sp-rec").addEventListener("click", () => (rec.active ? rec.stop() : rec.start()));

    const compute = () => {
      $$(".scrit", host).forEach((s) => { crit[+s.dataset.i] = +s.value; });
      const band = halfDown(crit.reduce((a, b) => a + b, 0) / 4);
      q(".sp-out").innerHTML = `<div><span class="small muted">Speaking band (estimate)</span><div class="big ${band >= 7 ? "c-green" : ""}">${fmtBand(band)}</div></div><div class="small">Average of the four criteria, rounded down to be safe.</div>`;
      setSelf(n, { speaking: band, scrit: crit });
      return band;
    };
    host.addEventListener("change", (e) => { if (e.target.classList.contains("scrit")) { compute(); renderGrid(); } });
    if (saved.speaking != null) { q(".sp-self").hidden = false; compute(); }
    return { destroy() { clearInterval(timerT); clearInterval(recT); TTS.cancel(); if (rec.active) rec.stop(); }, band: compute };
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
        ${n < 10 ? `<button class="btn primary" type="button" id="next-full">Next: full Test ${n + 1} →</button>` : ""}
      </div>`;
    const t = $("#to-tracker", host);
    if (t) t.addEventListener("click", () => {
      const mocks = store.get("mocks", []);
      mocks.push({ date: new Date().toISOString().slice(0, 10), l: res.listening ? res.listening.raw : "", r: res.reading ? res.reading.raw : "", w: W, s: Sp, note: `Practice Test ${n}` });
      store.set("mocks", mocks);
      t.disabled = true; t.textContent = "✓ Saved to tracker";
    });
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
