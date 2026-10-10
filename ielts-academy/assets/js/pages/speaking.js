/* Speaking page: drills, Part 1 / Part 2+3 simulator, recorder, live transcript, question bank. */
(function () {
  "use strict";
  const { $, $$, esc, pick, shuffle, TTS, toast, store } = window.IELTS;
  const B = window.SPEAKING_BANK;
  const EXAMINER = 2; // voice index used for the examiner

  /* ================================================== Pronunciation drills */
  const PAIRS = [["ship", "sip"], ["sheet", "seat"], ["think", "sink"], ["three", "tree"], ["they", "day"], ["like", "lie"], ["bike", "buy"], ["five", "fight"], ["rice", "rise"], ["price", "prize"], ["cost", "costs"], ["walk", "walked"], ["light", "right"], ["fan", "van"]];
  const STRESS = [["ECOnomy", "economy"], ["ecoNOMic", "economic"], ["enVIronment", "environment"], ["deVELopment", "development"], ["PHOtograph", "photograph"], ["phoTOgraphy", "photography"], ["techNOLogy", "technology"], ["COMfortable", "comfortable"], ["VEGetable", "vegetable"], ["INteresting", "interesting"], ["deTERmine", "determine"], ["caTAStrophe", "catastrophe"], ["ADvertisement (UK: adVERtisement)", "advertisement"], ["preFER", "prefer"], ["PREFerable", "preferable"]];
  $("#drill-pairs").innerHTML = PAIRS.map(([a, b]) => `<button class="chip" type="button" data-say="${a}. ${b}. ${a}. ${b}.">${a} / ${b}</button>`).join("");
  $("#drill-stress").innerHTML = STRESS.map(([shown, w]) => `<button class="chip" type="button" data-say="${w}">${shown}</button>`).join("");
  $("#p2-listen").addEventListener("click", () => {
    if (!TTS.ok) { toast("Text-to-speech isn't available in this browser."); return; }
    TTS.cancel();
    $$("#m-p2 p").forEach((p) => TTS.speak(p.textContent, { rate: 0.95, speaker: 1 }));
  });

  const say = (text) => { if (TTS.ok) { TTS.cancel(); TTS.speak(text, { rate: 0.95, speaker: EXAMINER }); } };

  /* ================================================== Part 1 */
  const topicSel = $("#p1-topic");
  topicSel.innerHTML = `<option value="mix">🎲 Mixed topics</option>` + B.part1.map((t, i) => `<option value="${i}">${esc(t.topic)}</option>`).join("");
  let p1Queue = [], p1Cur = null;
  const fillQueue = () => {
    p1Queue = topicSel.value === "mix"
      ? shuffle(B.part1).slice(0, 3).flatMap((t) => t.qs.slice(0, 4).map((q) => [t.topic, q]))
      : B.part1[+topicSel.value].qs.map((q) => [B.part1[+topicSel.value].topic, q]);
  };
  topicSel.addEventListener("change", () => { p1Queue = []; });
  $("#p1-next").addEventListener("click", () => {
    if (!p1Queue.length) fillQueue();
    p1Cur = p1Queue.shift();
    $("#p1-q").innerHTML = `<span class="badge purple">${esc(p1Cur[0])}</span><p style="margin:10px 0 0">${esc(p1Cur[1])}</p><p class="small muted" style="margin:6px 0 0">Answer in 2–4 sentences: answer → reason → detail. ${p1Queue.length} question(s) left in this set.</p>`;
    say(p1Cur[1]);
  });
  $("#p1-repeat").addEventListener("click", () => { if (p1Cur) say(p1Cur[1]); });

  /* ================================================== Part 2 + 3 */
  let card = null, phase = "idle", left = 0, tick = null, p3Queue = [];
  const ring = $("#p2-ring"), timeEl = $("#p2-time"), labelEl = $("#p2-label");
  function showCard(c) {
    card = c;
    $("#p2-card").innerHTML = `<h4>${esc(c.card)}</h4><p class="small" style="margin:0">You should say:</p><ul>${c.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul><p class="cc-foot">${esc(c.end)}</p>`;
    $("#p3-box").hidden = true;
    $("#p2-notes").value = "";
    stopTimer();
    setStage(null);
    paintRing(60, 60, "prep");
  }
  function setStage(s) {
    const order = ["prep", "talk", "p3"];
    $$("#p2-stage span").forEach((el) => {
      const i = order.indexOf(el.dataset.s), cur = order.indexOf(s);
      el.classList.toggle("on", el.dataset.s === s);
      el.classList.toggle("done", s && i < cur);
    });
  }
  function paintRing(l, total, label) {
    const s = Math.max(0, l);
    timeEl.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    labelEl.textContent = label;
    ring.style.setProperty("--p", ((total - s) / total) * 100);
    ring.style.setProperty("--rc", label === "talk" ? "var(--purple)" : "var(--blue)");
  }
  function stopTimer() { clearInterval(tick); tick = null; phase = "idle"; }
  function run(kind, secs, onDone) {
    clearInterval(tick);
    phase = kind; left = secs;
    setStage(kind);
    paintRing(left, secs, kind);
    tick = setInterval(() => {
      left--;
      paintRing(left, secs, kind);
      if (left <= 0) { clearInterval(tick); tick = null; onDone(); }
    }, 1000);
  }
  function startTalk() {
    say("Alright? Remember, you have one to two minutes for this, so don't worry if I stop you. Please start speaking now.");
    run("talk", 120, () => {
      say("Thank you. Now let's talk about some more general questions related to this topic.");
      if (rec.active) rec.stop();
      startP3();
    });
    if (!rec.active) rec.start("Part 2 · " + card.card);
  }
  function startP3() {
    setStage("p3");
    phase = "p3";
    p3Queue = card.p3.slice();
    $("#p3-box").hidden = false;
    $("#p3-q").textContent = "Press “Next Part 3 question”.";
  }
  $("#p2-new").addEventListener("click", () => showCard(pick(B.part2.filter((c) => c !== card))));
  $("#p2-start").addEventListener("click", () => {
    if (phase !== "idle" && phase !== "p3") return;
    say("Here is your topic. You have one minute to prepare. You can make some notes if you wish.");
    $("#p2-notes").focus();
    run("prep", 60, startTalk);
  });
  $("#p2-skip").addEventListener("click", () => { if (phase === "prep") { clearInterval(tick); startTalk(); } });
  $("#p2-stop").addEventListener("click", () => { stopTimer(); TTS.cancel(); if (rec.active) rec.stop(); setStage(null); paintRing(60, 60, "prep"); });
  $("#p3-next").addEventListener("click", () => {
    if (!p3Queue.length) { $("#p3-q").innerHTML = "That is the end of the speaking test. 🎉 Listen to your recordings below."; say("Thank you. That is the end of the speaking test."); return; }
    const q = p3Queue.shift();
    $("#p3-q").innerHTML = `<p style="margin:0">${esc(q)}</p><p class="small muted" style="margin:6px 0 0">Direct answer → reason → example → balance. ${p3Queue.length} left.</p>`;
    say(q);
  });
  showCard(B.part2[0]);

  /* ================================================== Recorder */
  const rec = {
    active: false, mr: null, chunks: [], stream: null, started: 0, label: "",
    async start(label) {
      if (!navigator.mediaDevices || !window.MediaRecorder) { toast("Recording isn't supported in this browser."); return; }
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) { toast("Microphone permission was denied."); return; }
      this.chunks = []; this.label = label || "Practice";
      this.mr = new MediaRecorder(this.stream);
      this.mr.ondataavailable = (e) => { if (e.data.size) this.chunks.push(e.data); };
      this.mr.onstop = () => this.save();
      this.mr.start();
      this.active = true; this.started = Date.now();
      paintRec();
      if ($("#asr-on").checked) asr.start();
    },
    stop() {
      if (!this.active) return;
      this.mr.stop();
      this.stream.getTracks().forEach((t) => t.stop());
      this.active = false;
      paintRec();
      asr.stop();
    },
    save() {
      const blob = new Blob(this.chunks, { type: this.mr.mimeType || "audio/webm" });
      const url = URL.createObjectURL(blob);
      const secs = Math.round((Date.now() - this.started) / 1000);
      const words = asr.words();
      const div = document.createElement("div");
      div.className = "rec";
      div.innerHTML = `<b>${esc(this.label)}</b><span class="muted">${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}${words ? ` · ${words} words · ${Math.round(words / Math.max(1, secs) * 60)} wpm` : ""}</span><audio controls src="${url}"></audio><a class="btn sm ghost" download="ielts-speaking-${Date.now()}.webm" href="${url}">⬇ Save</a>`;
      $("#recs").prepend(div);
    },
  };
  let recTimer = null;
  function paintRec() {
    const btn = $("#rec-btn"), st = $("#rec-status");
    clearInterval(recTimer);
    if (rec.active) {
      btn.textContent = "■ Stop recording"; btn.classList.add("danger");
      const upd = () => { const s = Math.round((Date.now() - rec.started) / 1000); st.innerHTML = `<span class="rec-dot"></span> Recording ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
      upd(); recTimer = setInterval(upd, 1000);
    } else { btn.textContent = "🎙️ Start recording"; btn.classList.remove("danger"); st.textContent = ""; }
  }
  $("#rec-btn").addEventListener("click", () => {
    if (rec.active) rec.stop();
    else {
      const tab = $("#sp-tabs .tab-list [aria-selected='true']");
      rec.start(tab && tab.dataset.tab === "p1" && p1Cur ? "Part 1 · " + p1Cur[1] : phase === "p3" ? "Part 3" : "Practice");
    }
  });

  /* ================================================== Live transcript (Web Speech API) */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const FILLERS = /\b(um+|uh+|er+|erm|ah+|like|you know|i mean|kind of|sort of|basically|actually)\b/gi;
  const asr = {
    r: null, final: "", on: false,
    start() {
      if (!SR) { toast("Live transcript needs Chrome or Edge."); $("#asr-on").checked = false; return; }
      this.final = ""; this.on = true;
      const box = $("#asr-text"); box.hidden = false; box.textContent = "Listening…";
      this.r = new SR();
      this.r.lang = "en-GB"; this.r.continuous = true; this.r.interimResults = true;
      this.r.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) this.final += e.results[i][0].transcript + " ";
          else interim += e.results[i][0].transcript;
        }
        const html = (esc(this.final) + `<span class="muted">${esc(interim)}</span>`).replace(FILLERS, '<span class="filler">$1</span>');
        box.innerHTML = html;
        const f = (this.final.match(FILLERS) || []).length;
        $("#asr-stats").textContent = `${this.words()} words · filler words: ${f}`;
      };
      this.r.onend = () => { if (this.on) { try { this.r.start(); } catch (e) { /* already started */ } } };
      try { this.r.start(); } catch (e) { /* ignore */ }
    },
    stop() { this.on = false; if (this.r) try { this.r.stop(); } catch (e) { /* ignore */ } },
    words() { return (this.final.trim().match(/\S+/g) || []).length; },
  };

  /* ================================================== Question bank */
  $("#bank-p1").innerHTML = B.part1.map((t) => `<div class="glass card" style="padding:16px 18px"><h4 style="margin:0 0 6px">${esc(t.topic)}</h4><ul class="small" style="margin:0">${t.qs.map((q) => `<li>${esc(q)}</li>`).join("")}</ul></div>`).join("");
  $("#bank-p2").innerHTML = B.part2.map((c) => `<details class="acc"><summary>${esc(c.card)}</summary><div class="acc-body">
    <p class="small"><b>You should say:</b> ${c.bullets.map(esc).join(" · ")} — ${esc(c.end)}</p>
    <p class="small" style="margin-bottom:4px"><b>Part 3:</b></p><ul class="small">${c.p3.map((q) => `<li>${esc(q)}</li>`).join("")}</ul></div></details>`).join("");

  window.addEventListener("beforeunload", () => { TTS.cancel(); if (rec.active) rec.stop(); });
  store.set("visited:speaking", true);
})();
