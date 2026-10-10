/* Speaking Mockups: Band 6.5–7 model answers for Parts 1, 2 and 3, set in Vietnam. */
(function () {
  "use strict";
  const { $, $$, esc, store, toast, TTS } = window.IELTS;
  const SETS = {
    p1: { items: window.SPEAKING_P1 || [], name: "Part 1", kinds: "" },
    p23: { items: window.SPEAKING_P23 || [], name: "Parts 2 & 3", kinds: "Cue card type" },
  };
  const words = (s) => (String(s).trim().match(/\S+/g) || []).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const st = store.get("speaking-mockups", { set: "p1", topic: "", kind: "", id: "", hide: false });
  if (!SETS[st.set]) st.set = "p1";

  /* ---------------------------------------------- Voice (browser text-to-speech) */
  const EXAMINER = 1, CANDIDATE = 0;
  let playToken = 0;
  const chunks = (text) => String(text).match(/[^.!?]+[.!?]+["”’)]*|[^.!?]+$/g) || [text];
  /** Read segments one after another ({text, speaker, el}); each sentence is a separate utterance so long answers aren't cut off. */
  function play(segs, btn) {
    stop();
    if (!TTS.ok) { toast("Text-to-speech is not supported in this browser."); return; }
    const token = ++playToken;
    if (btn) { btn.classList.add("on"); btn.dataset.label = btn.textContent; btn.textContent = "■ Stop"; }
    const queue = [];
    segs.forEach((s) => chunks(s.text).forEach((c, i) => queue.push({ text: c.trim(), speaker: s.speaker, el: s.el, first: i === 0 })));
    let i = 0;
    const next = () => {
      if (token !== playToken) return;
      $$(".smk-speaking").forEach((x) => x.classList.remove("smk-speaking"));
      if (i >= queue.length) { stop(); return; }
      const q = queue[i++];
      if (q.el) {
        q.el.classList.add("smk-speaking");
        if (q.first && q.el.hidden === false) q.el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      // Keep a reference to the utterance: Chrome can drop onend for utterances that get garbage-collected.
      play.current = TTS.speak(q.text, { rate: q.speaker === EXAMINER ? 0.95 : 1, speaker: q.speaker, onend: next });
    };
    next();
  }
  function stop() {
    playToken++;
    TTS.cancel();
    $$(".smk-speaking").forEach((x) => x.classList.remove("smk-speaking"));
    $$(".smk-play.on").forEach((b) => { b.classList.remove("on"); b.textContent = b.dataset.label || b.textContent; });
  }

  /* ---------------------------------------------- Recorder (kept in memory only) */
  const rec = {
    active: false, mr: null, chunks: [], stream: null, started: 0, label: "", box: null, btn: null, t: null,
    async start(label, box, btn) {
      if (!navigator.mediaDevices || !window.MediaRecorder) { toast("Recording isn't supported in this browser."); return; }
      try { this.stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { toast("Microphone permission was denied."); return; }
      this.chunks = []; this.label = label; this.box = box; this.btn = btn;
      this.mr = new MediaRecorder(this.stream);
      this.mr.ondataavailable = (e) => { if (e.data.size) this.chunks.push(e.data); };
      this.mr.onstop = () => this.save();
      this.mr.start();
      this.active = true; this.started = Date.now();
      btn.classList.add("danger");
      const upd = () => { const s = Math.round((Date.now() - this.started) / 1000); btn.innerHTML = `<span class="rec-dot"></span> Stop · ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
      upd(); this.t = setInterval(upd, 1000);
    },
    stop() {
      if (!this.active) return;
      this.mr.stop(); this.stream.getTracks().forEach((t) => t.stop());
      this.active = false; clearInterval(this.t);
      if (this.btn) { this.btn.classList.remove("danger"); this.btn.textContent = "🎙️ Record my answer"; }
    },
    save() {
      if (!this.box || !this.box.isConnected) return;
      const url = URL.createObjectURL(new Blob(this.chunks, { type: this.mr.mimeType || "audio/webm" }));
      const secs = Math.round((Date.now() - this.started) / 1000);
      const div = document.createElement("div");
      div.className = "rec";
      div.innerHTML = `<b>${esc(this.label)}</b><span class="muted">${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</span><audio controls src="${url}"></audio><a class="btn sm ghost" download="ielts-speaking-${Date.now()}.webm" href="${url}">⬇ Save</a>`;
      this.box.prepend(div);
    },
  };

  /* ---------------------------------------------- Lists */
  const host = $("#smk-app");
  host.innerHTML = `
    <div class="mk-set" role="group" aria-label="Part">
      <button type="button" data-set="p1"><b>🗣️ Part 1 · Interview</b><small>${SETS.p1.items.length} topics · ${SETS.p1.items.reduce((n, m) => n + m.qa.length, 0)} questions with model answers</small></button>
      <button type="button" data-set="p23"><b>🎤 Parts 2 &amp; 3 · Cue card + discussion</b><small>${SETS.p23.items.length} cue cards, each with a 2-minute talk and 3 Part 3 questions</small></button>
    </div>
    <div class="mk-layout">
      <aside class="mk-side glass">
        <div class="mk-h">Topics</div>
        <div class="mk-topics"></div>
        <div class="mk-h mk-kind-h"></div>
        <div class="mk-kinds"></div>
        <div class="mk-h">Questions</div>
        <div class="mk-list"></div>
      </aside>
      <article class="mk-reader smk-reader"></article>
    </div>`;
  const q = (s) => $(s, host);
  const set = () => SETS[st.set];
  const filtered = () => set().items.filter((m) => (!st.topic || m.topic === st.topic) && (!st.kind || m.kind === st.kind));
  const countBy = (key, list) => list.reduce((o, m) => ((o[m[key]] = (o[m[key]] || 0) + 1), o), {});

  function paintLists() {
    $$(".mk-set button", host).forEach((b) => b.classList.toggle("sel", b.dataset.set === st.set));
    const S = set();
    const topics = countBy("topic", S.items);
    q(".mk-topics").innerHTML = [["", "All topics", S.items.length], ...Object.entries(topics).map(([t, n]) => [t, t, n])]
      .map(([v, l, n]) => `<button type="button" class="mk-topic ${st.topic === v ? "sel" : ""}" data-topic="${esc(v)}"><span>${esc(l)}</span><b>${n}</b></button>`).join("");
    q(".mk-kind-h").textContent = S.kinds;
    q(".mk-kind-h").hidden = !S.kinds;
    if (S.kinds) {
      const kinds = countBy("kind", S.items.filter((m) => !st.topic || m.topic === st.topic));
      q(".mk-kinds").innerHTML = [["", "All"], ...Object.keys(kinds).map((k) => [k, k])]
        .map(([v, l]) => `<button type="button" class="chip mk-kind ${st.kind === v ? "sel" : ""}" data-kind="${esc(v)}">${esc(l)}${v ? ` · ${kinds[v]}` : ""}</button>`).join("");
    } else q(".mk-kinds").innerHTML = "";
    const list = filtered();
    q(".mk-list").innerHTML = list.length ? list.map((m) => `<button type="button" class="mk-item ${m.id === st.id ? "sel" : ""}" data-id="${m.id}">
        <span class="mk-item-t">${esc(m.title)}</span>
        <span class="mk-item-m">${esc(m.topic)}${m.kind ? " · " + esc(m.kind) : ` · ${m.qa.length} questions`}</span></button>`).join("")
      : `<p class="small muted">No questions match these filters.</p>`;
  }

  /* ---------------------------------------------- Reader */
  const qaBlock = (pairs, prefix) => pairs.map(([qq, a], i) => `
    <div class="smk-qa" data-k="${prefix}${i}">
      <div class="smk-q"><span class="smk-n">${i + 1}</span><span class="smk-qt">${esc(qq)}</span><button class="speak-btn smk-say" type="button" data-seg="${prefix}q${i}" title="Hear the examiner ask this" aria-label="Hear the question">🔊</button></div>
      <div class="smk-a" ${st.hide ? "hidden" : ""}><p>${esc(a)}</p><div class="smk-a-foot"><span class="small muted">${words(a)} words</span><button class="btn sm ghost smk-play" type="button" data-seg="${prefix}a${i}">▶ Listen</button></div></div>
      <button class="btn sm ghost smk-reveal" type="button" ${st.hide ? "" : "hidden"}>👁 Show model answer</button>
    </div>`).join("");
  const extras = (m) => `
    <div class="grid grid-2 mt">
      <div class="glass card"><h4 style="margin-top:0">🔎 Why this reaches Band 6.5–7</h4><ul class="small">${m.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>
      <div class="glass card"><h4 style="margin-top:0">🧰 Language to reuse</h4><div class="chip-list">${m.language.map((l) => `<span class="chip">${esc(l)}</span>`).join("")}</div>
        ${m.glossary.length ? `<h4>🇻🇳 Vietnamese words explained</h4><ul class="small smk-gloss">${m.glossary.map(([t, d]) => `<li><b>${esc(t)}</b>: ${esc(d)}</li>`).join("")}</ul>` : ""}
        <p class="small muted" style="margin:10px 0 0">Borrow the phrases, not the story: replace every detail with your own life.</p></div>
    </div>`;
  const recBar = () => `<div class="smk-rec"><button class="btn sm smk-rec-btn" type="button">🎙️ Record my answer</button><span class="small muted">Recordings stay in this browser tab only.</span></div><div class="smk-recs recordings"></div>`;

  let p2timer = null;
  function paintReader() {
    stop(); rec.stop(); clearInterval(p2timer);
    const S = set();
    const list = filtered();
    let m = S.items.find((x) => x.id === st.id);
    if (!m || !list.includes(m)) { m = list[0]; st.id = m ? m.id : ""; }
    const r = q(".mk-reader");
    if (!m) { r.innerHTML = ""; return; }
    const i = list.indexOf(m);
    const segs = {};
    const head = `
      <div class="mk-r-head">
        <div><div class="eyebrow">${S.name} · ${esc(m.topic)}${m.kind ? " · " + esc(m.kind) : ""}</div><h3>${esc(m.title)}</h3></div>
        <div class="mk-nav"><button class="btn sm ghost" type="button" data-step="-1" ${i <= 0 ? "disabled" : ""}>← Previous</button><span class="small muted">${i + 1} / ${list.length}</span><button class="btn sm ghost" type="button" data-step="1" ${i >= list.length - 1 ? "disabled" : ""}>Next →</button></div>
      </div>
      <div class="smk-tools glass">
        <label class="small"><input type="checkbox" class="smk-hide" ${st.hide ? "checked" : ""}> Hide the model answers until I've tried</label>
        ${TTS.ok ? "" : `<span class="small muted">🔇 Your browser has no text-to-speech voice, so the listen buttons are switched off.</span>`}
      </div>`;
    if (st.set === "p1") {
      r.innerHTML = `${head}
        <div class="smk-bar"><span class="badge purple">Band 6.5–7 models</span><span class="small muted">Part 1 · 4–5 minutes · short, natural answers of 2–4 sentences</span><span class="spacer"></span><button class="btn sm smk-play" type="button" data-seg="all">▶ Play the whole interview</button></div>
        ${recBar()}
        <div class="smk-qas">${qaBlock(m.qa, "")}</div>
        ${extras(m)}`;
      m.qa.forEach(([qq, a], k) => { segs["q" + k] = [{ text: qq, speaker: EXAMINER }]; segs["a" + k] = [{ text: a, speaker: CANDIDATE }]; });
      segs.all = m.qa.flatMap((_, k) => [...segs["q" + k], ...segs["a" + k]]);
    } else {
      const text = m.model.join(" "), wc = words(text);
      r.innerHTML = `${head}
        <div class="smk-p2">
          <div class="cue-card"><div class="eyebrow">Part 2 · cue card</div><h4>${esc(m.card.prompt)}</h4><div class="small muted">You should say:</div><ul>${m.card.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul><div class="cc-foot">${esc(m.card.last)}</div></div>
          <div class="glass card smk-try">
            <h4 style="margin-top:0">⏱ Try it first</h4>
            <p class="small muted" style="margin-top:0">1 minute to make notes, then speak for 2 minutes, just like the exam.</p>
            <div class="row"><span class="smk-clock" aria-live="polite">1:00</span><button class="btn sm primary smk-go" type="button">▶ Start</button><button class="btn sm ghost smk-reset" type="button" title="Reset" aria-label="Reset the timer">⟲</button><span class="small muted smk-phase">Plan</span></div>
            <textarea class="inp smk-notes" rows="4" spellcheck="false" placeholder="Your notes (keywords only)…"></textarea>
            ${recBar()}
          </div>
        </div>
        <div class="smk-model-wrap" ${st.hide ? "hidden" : ""}>
          <div class="grid smk-p2-model">
            <div class="glass card smk-plan"><h4 style="margin-top:0">📝 The 1-minute notes</h4><ul class="small">${m.plan.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
            <div>
              <div class="model-head"><span class="badge purple">Band 6.5–7 model · ${wc} words · about ${Math.round((wc / 140) * 2) / 2} min</span><span class="spacer"></span><button class="btn sm smk-play" type="button" data-seg="model">▶ Listen</button></div>
              <div class="model smk-model">${m.model.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
            </div>
          </div>
        </div>
        <button class="btn sm smk-show" type="button" ${st.hide ? "" : "hidden"}>👁 Show the model answer</button>
        <div class="smk-p3">
          <div class="smk-bar"><span class="badge purple">Part 3 · Discussion</span><b>${esc(m.p3.theme)}</b><span class="spacer"></span><button class="btn sm smk-play" type="button" data-seg="p3all">▶ Play the discussion</button></div>
          <p class="small muted" style="margin-top:0">Longer answers (about 30–45 seconds): answer directly, give a reason, an example and, where you can, the other side.</p>
          <div class="smk-qas">${qaBlock(m.p3.qa, "p")}</div>
        </div>
        ${extras(m)}`;
      segs.model = [{ text: `${m.card.prompt}`, speaker: EXAMINER }, ...m.model.map((p, k) => ({ text: p, speaker: CANDIDATE, el: $$(".smk-model p", r)[k] }))];
      m.p3.qa.forEach(([qq, a], k) => { segs["pq" + k] = [{ text: qq, speaker: EXAMINER }]; segs["pa" + k] = [{ text: a, speaker: CANDIDATE }]; });
      segs.p3all = m.p3.qa.flatMap((_, k) => [...segs["pq" + k], ...segs["pa" + k]]);
      wireP2(r, m);
    }
    // Link each Q&A segment to its element so it is highlighted while it plays.
    $$(".smk-qa", r).forEach((el) => {
      const k = el.dataset.k, pre = k[0] === "p" ? "p" : "", n = k.replace(/^p/, "");
      (segs[pre + "q" + n] || []).forEach((s) => (s.el = $(".smk-q", el)));
      (segs[pre + "a" + n] || []).forEach((s) => (s.el = $(".smk-a", el)));
    });
    if (!TTS.ok) $$(".smk-play, .smk-say", r).forEach((b) => (b.hidden = true));

    r.onclick = (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.step) {
        const nx = list[i + +b.dataset.step]; if (!nx) return;
        st.id = nx.id; save(); paintLists(); paintReader();
        $("#browse").scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (b.dataset.seg) {
        if (b.classList.contains("on")) { stop(); return; }
        const key = b.dataset.seg;
        // Revealing an answer by listening to it is allowed even in hide mode.
        if (/a\d$/.test(key)) { const qa = b.closest(".smk-qa"); if (qa) { $(".smk-a", qa).hidden = false; $(".smk-reveal", qa).hidden = true; } }
        play(segs[key] || [], b.classList.contains("smk-play") ? b : null);
      } else if (b.classList.contains("smk-reveal")) {
        const qa = b.closest(".smk-qa"); $(".smk-a", qa).hidden = false; b.hidden = true;
      } else if (b.classList.contains("smk-show")) {
        $(".smk-model-wrap", r).hidden = false; b.hidden = true;
      } else if (b.classList.contains("smk-rec-btn")) {
        if (rec.active) rec.stop();
        else rec.start(`${S.name} · ${m.title}`, $(".smk-recs", b.closest(".smk-try") || r), b);
      }
    };
    $(".smk-hide", r).addEventListener("change", (e) => { st.hide = e.target.checked; save(); paintReader(); });
  }

  /** Part 2 practice clock: 1 minute to plan, then 2 minutes to speak. */
  function wireP2(r, m) {
    const clock = $(".smk-clock", r), go = $(".smk-go", r), notes = $(".smk-notes", r);
    const key = "smk-notes:" + m.id;
    notes.value = store.get(key, "");
    notes.addEventListener("input", () => store.set(key, notes.value));
    let phase = "idle", left = 60;
    const paint = () => {
      const s = Math.max(0, left);
      clock.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      clock.dataset.phase = phase;
      $(".smk-phase", r).textContent = phase === "talk" ? "Speaking" : phase === "done" ? "Finished" : "Plan";
      go.textContent = phase === "idle" ? "▶ Start" : phase === "plan" ? "Speak now →" : phase === "talk" ? "■ Finish" : "▶ Again";
    };
    const startTalk = () => {
      phase = "talk"; left = 120; paint();
      toast("🎤 Start speaking now: 2 minutes.");
      const btn = $(".smk-rec-btn", r);
      if (btn && !rec.active && navigator.mediaDevices && window.MediaRecorder) rec.start(`Part 2 · ${m.title}`, $(".smk-recs", r), btn);
    };
    const finish = () => { clearInterval(p2timer); phase = "done"; left = 0; paint(); if (rec.active) rec.stop(); toast("⏰ Time's up. Now compare with the model."); };
    go.addEventListener("click", () => {
      if (phase === "plan") { startTalk(); return; }
      if (phase === "talk") { finish(); return; }
      clearInterval(p2timer);
      phase = "plan"; left = 60; paint(); notes.focus();
      p2timer = setInterval(() => {
        left--;
        if (left <= 0) { if (phase === "plan") startTalk(); else { finish(); return; } }
        paint();
      }, 1000);
    });
    $(".smk-reset", r).addEventListener("click", () => { clearInterval(p2timer); if (rec.active) rec.stop(); phase = "idle"; left = 60; paint(); });
    paint();
  }

  function save() {
    store.set("speaking-mockups", st);
    if (st.id) history.replaceState(null, "", "#" + st.id);
  }
  function paint() { paintLists(); paintReader(); save(); }

  host.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b || (!q(".mk-side").contains(b) && !b.closest(".mk-set"))) return;
    if (b.dataset.set) { if (b.dataset.set !== st.set) { st.set = b.dataset.set; st.topic = ""; st.kind = ""; st.id = ""; } }
    else if (b.dataset.topic != null && b.classList.contains("mk-topic")) { st.topic = b.dataset.topic; st.kind = ""; st.id = ""; }
    else if (b.dataset.kind != null && b.classList.contains("mk-kind")) { st.kind = b.dataset.kind; st.id = ""; }
    else if (b.dataset.id) {
      st.id = b.dataset.id;
      if (window.matchMedia("(max-width: 900px)").matches) setTimeout(() => q(".mk-reader").scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
    paint();
  });
  function route() {
    const id = location.hash.slice(1);
    const s = /^p1-/.test(id) ? "p1" : /^p2-/.test(id) ? "p23" : null;
    if (!s || !SETS[s].items.some((m) => m.id === id)) return false;
    st.set = s; st.id = id; st.topic = ""; st.kind = "";
    return true;
  }
  window.addEventListener("hashchange", () => { if (route()) paint(); });
  window.addEventListener("pagehide", () => { stop(); rec.stop(); });
  route();
  paint();
})();
