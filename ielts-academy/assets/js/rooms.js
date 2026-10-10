/* =========================================================================
   IELTS 7.0 Academy — Writing and Speaking test rooms
   Shared by the Practice Tests (built-in tasks) and the Cambridge companion
   (tasks typed in from the learner's own book).

   IELTS.WritingRoom(host, W, opts)
     W:    { task1: { prompt, chart?, plan? }, task2: { prompt, plan? } }
     opts: { draftKey(k), promptKey?(k), saved: { band, crit }, onScore(band, crit), note? }
   IELTS.SpeakingRoom(host, S, opts)
     S:    { part1: [{ topic, qs }], part2?: { card, bullets, end, theme }, part3: [q] }
     opts: { name, saved: { band, crit }, onScore(band, crit) }
   Both return { destroy(), band() }.
   ========================================================================= */
(function () {
  "use strict";
  const { $, $$, esc, store, toast, TTS, Timer, fmtBand, initTabs } = window.IELTS;
  const BANDS = Array.from({ length: 13 }, (_, i) => 3 + i * 0.5);
  const bandSelect = (cls, v, data = "") => `<select class="inp ${cls}" ${data}>${BANDS.slice().reverse().map((b) => `<option value="${b}" ${+v === b ? "selected" : ""}>${b.toFixed(1)}</option>`).join("")}</select>`;
  const halfDown = (x) => Math.floor(x * 2 + 1e-9) / 2;
  const halfNear = (x) => Math.round(x * 2) / 2;
  const words = (s) => (String(s || "").trim().match(/\S+/g) || []).filter((w) => /[A-Za-z0-9]/.test(w)).length;

  const CHECKS = {
    1: ["An overview sentence with the main trends or stages, without numbers", "Key features selected and compared (not every number listed)", "Accurate data with approximation language (around, just under)", "Paragraphs grouped logically (by trend, category or stage)", "At least 150 words, no personal opinion"],
    2: ["Every part of the question answered (both views / both questions)", "A clear position in the introduction and conclusion (when asked)", "One main idea per body paragraph, explained and supported by an example", "Linking that is varied but not mechanical (not “Firstly… Secondly…” everywhere)", "At least 250 words; articles, plurals and verb tenses checked"],
  };

  /* ================================================== Writing */
  function WritingRoom(host, W, opts = {}) {
    const saved = opts.saved || {};
    const crit = saved.crit ? { t1: [...saved.crit.t1], t2: [...saved.crit.t2] } : { t1: [6, 6, 6, 6], t2: [6, 6, 6, 6] };
    const task = (k, t) => {
      const min = k === 1 ? 150 : 250;
      const prompt = opts.promptKey
        ? `<label class="small muted" style="display:block;margin-bottom:6px">Task ${k} question: type or paste it from your book. It's saved only in this browser.</label>
           <textarea class="inp w-prompt" data-p="${k}" rows="5" placeholder="${k === 1 ? "e.g. The chart below shows… Summarise the information by selecting and reporting the main features, and make comparisons where relevant." : "e.g. Some people believe… To what extent do you agree or disagree?"}"></textarea>`
        : `<div class="studio-prompt"><b>Task ${k} · about ${k === 1 ? 20 : 40} minutes.</b> ${esc(t.prompt).replace(/ • /g, "<br>• ")}</div>`;
      return `
      <div class="task-panel">
        <div>
          ${prompt}
          ${t.chart ? window.IELTS.Charts.render(t.chart) : ""}
          ${t.plan ? `<details class="acc"><summary>Band 7 plan: open after you finish</summary><div class="acc-body"><ul class="small">${t.plan.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div></details>` : ""}
          <details class="acc"><summary>Band 7 self-check for Task ${k}</summary><div class="acc-body"><div class="checklist">${CHECKS[k].map((c) => `<label><input type="checkbox"><span>${esc(c)}</span></label>`).join("")}</div></div></details>
        </div>
        <div>
          <textarea class="w-essay" data-task="${k}" spellcheck="false" placeholder="Write your Task ${k} answer here…"></textarea>
          <div class="studio-stats"><span>Words: <b class="wc">0</b> / ${min}</span><span>Paragraphs: <b class="pc">0</b></span><span class="saved small"></span></div>
        </div>
      </div>`;
    };
    host.innerHTML = `
      <div class="quiz-bar"><span class="qb-title">${esc(opts.title || "Writing · 2 tasks · 60 minutes")}</span><span class="qb-count">Task 2 counts twice as much as Task 1</span><span class="spacer"></span><span class="w-timer"></span></div>
      <div class="tabs" data-tabs>
        <div class="tab-list" role="tablist"><button data-tab="t1">Task 1</button><button data-tab="t2">Task 2</button><button data-tab="self">Self-assessment</button></div>
        <div class="tab-panel" data-panel="t1">${task(1, W.task1 || {})}</div>
        <div class="tab-panel" data-panel="t2">${task(2, W.task2 || {})}</div>
        <div class="tab-panel" data-panel="self">
          <div class="glass card">
            <p class="small">Score each criterion honestly against the <a href="writing.html#criteria" target="_blank">Band 7 descriptors</a>. ${opts.note || "Compare with the model answers and the Band 7 plans."} Each task's score is the average of its four criteria (rounded down, to be safe); the Writing band weights Task 2 twice.</p>
            <h4>Task 1</h4><div class="crit-grid">${["Task Achievement", "Coherence & Cohesion", "Lexical Resource", "Grammar"].map((c, i) => `<label>${c}${bandSelect("wcrit", crit.t1[i], `data-t="t1" data-i="${i}"`)}</label>`).join("")}</div>
            <h4>Task 2</h4><div class="crit-grid">${["Task Response", "Coherence & Cohesion", "Lexical Resource", "Grammar"].map((c, i) => `<label>${c}${bandSelect("wcrit", crit.t2[i], `data-t="t2" data-i="${i}"`)}</label>`).join("")}</div>
            <div class="calc-out w-out"></div>
          </div>
        </div>
      </div>`;
    initTabs(host);
    const timer = new Timer($(".w-timer", host), { minutes: 60, label: "Time left", warnAt: 600 });
    if (opts.promptKey) $$(".w-prompt", host).forEach((ta) => {
      const key = opts.promptKey(ta.dataset.p);
      ta.value = store.get(key, "");
      ta.addEventListener("input", () => store.set(key, ta.value));
    });
    let saveT = null;
    $$(".w-essay", host).forEach((ta) => {
      const key = opts.draftKey(ta.dataset.task);
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
    const out = $(".w-out", host);
    const compute = (save = true) => {
      $$(".wcrit", host).forEach((s) => { crit[s.dataset.t][+s.dataset.i] = +s.value; });
      const t1 = halfDown(crit.t1.reduce((a, b) => a + b, 0) / 4), t2 = halfDown(crit.t2.reduce((a, b) => a + b, 0) / 4);
      const band = halfNear((t1 + 2 * t2) / 3);
      const w1 = words(store.get(opts.draftKey(1), "")), w2 = words(store.get(opts.draftKey(2), ""));
      out.innerHTML = `<div><span class="small muted">Writing band (estimate)</span><div class="big ${band >= 7 ? "c-green" : ""}">${fmtBand(band)}</div></div>
        <div class="small">Task 1: ${fmtBand(t1)} · Task 2: ${fmtBand(t2)}<br>Words: Task 1 ${w1}/150 · Task 2 ${w2}/250
        ${w1 < 150 || w2 < 250 ? `<br><span class="c-amber">⚠ Under-length answers lose marks in Task Achievement / Response.</span>` : ""}</div>`;
      if (save && opts.onScore) opts.onScore(band, crit);
      else if (!save && saved.band == null) out.insertAdjacentHTML("beforeend", `<div class="small c-amber">Not saved yet: change any score to record your self-assessment.</div>`);
      return band;
    };
    host.addEventListener("change", (e) => { if (e.target.classList.contains("wcrit")) compute(); });
    compute(saved.band != null);
    return { destroy() { timer.pause(); }, band: compute };
  }

  /* ================================================== Speaking */
  function SpeakingRoom(host, S, opts = {}) {
    const saved = opts.saved || {};
    const crit = saved.crit ? [...saved.crit] : [6, 6, 6, 6];
    const name = opts.name || "speaking";
    const seq = [{ kind: "intro" }];
    (S.part1 || []).forEach((t) => t.qs.forEach((q, k) => seq.push({ kind: "p1", topic: t.topic, q, first: k === 0 })));
    if (S.part2 && S.part2.card) seq.push({ kind: "p2" });
    (S.part3 || []).forEach((q) => seq.push({ kind: "p3", q }));
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
        const t = "Good morning. My name is Sarah, and I'm your examiner. In this first part, I'd like to ask you some questions about yourself.";
        card.innerHTML = `<span class="badge purple">Part 1</span><p class="sp-q">${t}</p>`;
        say(t);
        btnNext.textContent = "▶ Next question";
      } else if (it.kind === "p1" || it.kind === "p3") {
        stage(it.kind);
        const same = seq.filter((x) => x.kind === it.kind), pos = same.indexOf(it) + 1;
        const lead = it.kind === "p1" && it.first && it.topic ? `Let's talk about ${it.topic.toLowerCase()}. ` : it.kind === "p3" && pos === 1 ? `We've been talking about ${(S.part2 && S.part2.theme) || "this topic"}, and now I'd like to discuss some more general questions related to this. ` : "";
        card.innerHTML = `<span class="badge purple">Part ${it.kind === "p1" ? 1 : 3}${it.topic ? " · " + esc(it.topic) : ""}</span> <span class="small muted">Question ${pos} of ${same.length}</span><p class="sp-q">${esc(it.q)}</p>`;
        say(lead + it.q);
        btnNext.textContent = "▶ Next question";
      } else if (it.kind === "p2") {
        stage("p2");
        const P = S.part2;
        card.innerHTML = `<div class="grid grid-2" style="align-items:start">
          <div><span class="badge purple">Part 2</span><h4 style="margin:10px 0 6px">${esc(P.card)}</h4>${P.bullets && P.bullets.length ? `<p class="small" style="margin:0">You should say:</p><ul>${P.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${P.end ? `<p class="cc-foot">${esc(P.end)}</p>` : ""}</div>
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
          div.innerHTML = `<b>${esc(opts.label || "Speaking test")}</b><span class="muted">${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</span><audio controls src="${url}"></audio><a class="btn sm ghost" download="ielts-${esc(name)}.webm" href="${url}">⬇ Save</a>`;
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
      if (opts.onScore) opts.onScore(band, crit);
      return band;
    };
    host.addEventListener("change", (e) => { if (e.target.classList.contains("scrit")) compute(); });
    if (saved.band != null) { q(".sp-self").hidden = false; compute(); }
    return { destroy() { clearInterval(timerT); clearInterval(recT); TTS.cancel(); if (rec.active) rec.stop(); }, band: compute };
  }

  Object.assign(window.IELTS, { WritingRoom, SpeakingRoom, halfDown, halfNear, wordCount: words });
})();
