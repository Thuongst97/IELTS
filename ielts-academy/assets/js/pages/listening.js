/* Listening page: dictation trainer, TTS test player, map, transcripts and quiz. */
(function () {
  "use strict";
  const { $, $$, esc, pick, TTS, toast, store } = window.IELTS;
  const T = window.LISTENING_TEST;

  /* ================================================== Dictation trainer */
  const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const NAMES = ["Fairweather", "Gilchrist", "Jeavons", "Vaughan", "Pemberton", "Whitlock", "Kavanagh", "Bridgewater", "Ashcombe", "Ellison", "Quigley", "Yardley", "Hawthorne", "Beaumont", "Ingram", "Galloway", "Jessop", "Prentice", "Rafferty", "Wexford", "Haverford", "Mcintyre", "Lockwood", "Penhaligon", "Ravensworth", "Dempsey", "Harcourt", "Elphick", "Burgess", "Valentine"];
  const ORD = (d) => d + (d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th");
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const DIGIT = ["oh", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const L = "ABCDEFGHJKLMNPRSTUVWXY";

  function sayDigits(group) {
    const out = [];
    for (let i = 0; i < group.length; i++) {
      if (group[i] === group[i + 1] && group[i] !== group[i + 2]) { out.push("double " + DIGIT[+group[i]]); i++; }
      else out.push(DIGIT[+group[i]]);
    }
    return out.join(" ");
  }

  const GEN = {
    phone() {
      const d = "07" + Array.from({ length: 9 }, () => rnd(0, 9)).join("");
      const g = [d.slice(0, 5), d.slice(5, 8), d.slice(8)];
      return { say: `My number is ${g.map(sayDigits).join(", ")}.`, answer: d, check: (v) => v.replace(/\D/g, "") === d };
    },
    spell() {
      const n = pick(NAMES);
      return { say: `The surname is ${n}. That's ${n.toUpperCase().split("").join(", ")}.`, answer: n, check: (v) => v.trim().toLowerCase().replace(/\s/g, "") === n.toLowerCase() };
    },
    date() {
      const d = rnd(1, 28), m = rnd(0, 11);
      const mName = MONTHS[m][0].toUpperCase() + MONTHS[m].slice(1);
      return {
        say: pick([`The course starts on the ${ORD(d)} of ${mName}.`, `Your appointment is on ${mName} the ${ORD(d)}.`, `The deadline is the ${ORD(d)} of ${mName}.`]),
        answer: `${d} ${mName}`,
        check(v) {
          const s = v.toLowerCase();
          const dd = (s.match(/\d+/) || [])[0];
          const hasMonth = MONTHS.findIndex((x) => s.includes(x) || new RegExp("\\b" + x.slice(0, 3) + "\\b").test(s));
          if (hasMonth >= 0) return +dd === d && hasMonth === m;
          const nums = s.match(/\d+/g) || [];
          return nums.length === 2 && +nums[0] === d && +nums[1] === m + 1;
        },
      };
    },
    money() {
      const p = rnd(3, 480), c = pick([0, 0, 50, 75, 95, 25, 99, 20]);
      const val = c ? `${p}.${String(c).padStart(2, "0")}` : String(p);
      return {
        say: pick([`The total comes to £${val}.`, `That one costs £${val}.`, `The deposit is £${val}, payable in advance.`]),
        answer: "£" + val,
        check: (v) => { const n = parseFloat(v.replace(/[^\d.]/g, "")); return Math.abs(n - parseFloat(val)) < 0.001; },
      };
    },
    post() {
      const code = pick(L) + pick(L) + rnd(1, 20) + " " + rnd(1, 9) + pick(L) + pick(L);
      return { say: `The postcode is ${code.replace(" ", "").split("").join(", ")}.`, answer: code, check: (v) => v.replace(/\s/g, "").toUpperCase() === code.replace(/\s/g, "") };
    },
    time() {
      const h = rnd(1, 11), m = pick([0, 5, 10, 15, 20, 30, 40, 45, 50, 55]);
      const nextH = h + 1;
      let say;
      if (m === 15) say = `a quarter past ${h}`;
      else if (m === 30) say = `half past ${h}`;
      else if (m === 45) say = `a quarter to ${nextH}`;
      else if (m === 0) say = `${h} o'clock`;
      else say = `${h}:${String(m).padStart(2, "0")}`;
      const ans = m === 45 ? `${h}:45` : `${h}:${String(m).padStart(2, "0")}`;
      return {
        say: pick([`The last bus leaves at ${say}.`, `The meeting starts at ${say}.`, `Please arrive by ${say}.`]),
        answer: ans,
        check: (v) => { const digits = v.replace(/\D/g, "").replace(/^0+/, ""); return digits === ans.replace(/\D/g, ""); },
      };
    },
  };

  function initDictation() {
    const cat = $("#dict-cat"), rate = $("#dict-rate"), input = $("#dict-input"), fb = $("#dict-fb");
    const btnNew = $("#dict-new"), btnAgain = $("#dict-again"), btnCheck = $("#dict-check");
    const stats = store.get("dict-stats", { right: 0, total: 0, streak: 0 });
    let item = null;
    const paint = () => { $("#dict-score").textContent = `${stats.right} / ${stats.total}`; $("#dict-streak").textContent = `🔥 ${stats.streak}`; };
    paint();
    const play = () => { if (!item) return; TTS.cancel(); TTS.speak(item.say, { rate: +rate.value, speaker: rnd(0, 3) }); };
    btnNew.addEventListener("click", () => {
      if (!TTS.ok) { toast("Text-to-speech isn't available in this browser."); return; }
      const keys = Object.keys(GEN);
      const k = cat.value === "mix" ? pick(keys) : cat.value;
      item = GEN[k]();
      fb.innerHTML = "";
      input.value = "";
      input.focus();
      btnAgain.disabled = false; btnCheck.disabled = false;
      play();
    });
    btnAgain.addEventListener("click", play);
    const check = () => {
      if (!item) return;
      const ok = item.check(input.value);
      stats.total++; if (ok) { stats.right++; stats.streak++; } else stats.streak = 0;
      store.set("dict-stats", stats);
      paint();
      fb.innerHTML = ok
        ? `<span class="c-green">✅ Correct — <b>${esc(item.answer)}</b>.</span> <span class="muted">Press New item for the next one.</span>`
        : `<span class="c-red">❌ The answer was <b>${esc(item.answer)}</b>.</span> <span class="muted">You heard: “${esc(item.say)}”</span>`;
      btnCheck.disabled = true;
      item = ok ? null : item;
      btnNew.focus();
    };
    btnCheck.addEventListener("click", check);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (!btnCheck.disabled) check(); else btnNew.click(); } });
  }

  /* ================================================== Map (Part 2) */
  function mapSVG() {
    const pin = (l, x, y) => `<g class="map-pin"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 4.5}" text-anchor="middle">${l}</text></g>`;
    return `<div class="map-wrap"><svg viewBox="0 0 600 440" role="img" aria-label="Map of Westbrook Heritage Park with places labelled A to H">
      <rect class="map-grass" x="20" y="20" width="560" height="380" rx="18"/>
      <ellipse class="map-wood" cx="130" cy="92" rx="105" ry="66"/>
      <text class="map-label" x="150" y="140">Woodland</text>
      <ellipse class="map-water" cx="430" cy="190" rx="95" ry="58"/>
      <text class="map-label" x="430" y="194" text-anchor="middle">Lake</text>
      <path class="map-path" d="M300,400 L300,62"/>
      <path class="map-path" d="M300,215 L80,215"/>
      <path class="map-path" d="M300,215 L313,206"/>
      <ellipse class="map-path" cx="430" cy="190" rx="118" ry="82" style="stroke-width:6"/>
      <circle class="map-feature" cx="300" cy="215" r="13"/><text class="map-label" x="318" y="244">Fountain</text>
      <rect class="map-feature" x="196" y="282" width="46" height="26" rx="4"/><text class="map-label" x="219" y="326" text-anchor="middle">Café</text>
      <rect fill="var(--paper)" x="276" y="392" width="48" height="12"/>
      <text class="map-label" x="300" y="428" text-anchor="middle" style="font-weight:800">▲ Main entrance</text>
      <g transform="translate(548 52)"><path d="M0,-18 L7,6 L0,1 L-7,6 Z" fill="var(--text)"/><text class="map-label" x="0" y="22" text-anchor="middle">N</text></g>
      <text class="map-label" x="572" y="250" text-anchor="end" style="font-size:10px">Westbrook Manor →</text>
      ${pin("A", 352, 352)}${pin("B", 248, 352)}${pin("C", 100, 70)}${pin("D", 58, 215)}
      ${pin("E", 430, 292)}${pin("F", 430, 86)}${pin("G", 560, 190)}${pin("H", 300, 46)}
    </svg></div>`;
  }

  /* ================================================== Transcripts */
  const strip = (s) => s.replace(/\[\[|\]\]/g, "");
  const ranges = { 1: "1 to 10", 2: "11 to 20", 3: "21 to 30", 4: "31 to 40" };

  function renderTranscripts() {
    const host = $("#transcripts");
    host.innerHTML = T.parts.map((p) => `
      <div class="transcript glass" data-part="${p.id}">
        <h4>${esc(p.title)}</h4><p class="small muted">${esc(p.scene)}</p>
        ${p.lines.map((ln, i) => `<p data-line="${i}"><span class="spk">${esc(p.speakers[ln[0]].split(" ")[0])}</span>${esc(ln[1]).replace(/\[\[(.+?)\]\]/g, '<span class="ans">$1</span>')}</p>`).join("")}
      </div>`).join("");
    const btn = $("#pl-tr");
    btn.addEventListener("click", () => {
      host.hidden = !host.hidden;
      btn.textContent = host.hidden ? "📜 Show transcripts" : "📜 Hide transcripts";
    });
  }

  /* ================================================== TTS player */
  function initPlayer() {
    const status = $("#pl-status"), bar = $("#pl-bar"), player = $("#player");
    const btnPlay = $("#pl-play"), btnPause = $("#pl-pause"), btnStop = $("#pl-stop");
    const partSel = $("#pl-part"), rateSel = $("#pl-rate"), exam = $("#pl-exam");
    if (!TTS.ok) {
      $("#tts-warn").hidden = false;
      [btnPlay, btnPause, btnStop].forEach((b) => (b.disabled = true));
      status.textContent = "Audio unavailable — use the transcripts.";
      return;
    }
    let items = [], idx = 0, state = "idle", waitT = null, waitLeft = 0, guard = null, token = 0;

    const sentences = (s) => strip(s).match(/[^.!?]+[.!?]+["”’]?|[^.!?]+$/g).map((x) => x.trim()).filter(Boolean);
    function build() {
      const sel = partSel.value;
      const parts = sel === "all" ? T.parts : [T.parts[+sel - 1]];
      const out = [];
      parts.forEach((p) => {
        if (exam.checked) {
          out.push({ say: `Part ${p.id}. ${p.scene} First, you have thirty seconds to look at questions ${ranges[p.id]}.`, speaker: 3, part: p.id });
          out.push({ wait: 30, part: p.id });
        }
        p.lines.forEach((ln, li) => sentences(ln[1]).forEach((s) => out.push({ say: s, speaker: ln[0] + (p.id - 1), who: p.speakers[ln[0]], part: p.id, line: li })));
        if (exam.checked) out.push({ say: `That is the end of part ${p.id}.`, speaker: 3, part: p.id });
      });
      return out;
    }
    function highlight(it) {
      $$("#transcripts p.cur").forEach((x) => x.classList.remove("cur"));
      if (it && it.line != null) {
        const el = $(`#transcripts .transcript[data-part="${it.part}"] p[data-line="${it.line}"]`);
        if (el) el.classList.add("cur");
      }
    }
    function paint() {
      bar.style.width = items.length ? (idx / items.length) * 100 + "%" : "0";
      player.classList.toggle("playing", state === "playing");
      btnPlay.disabled = state === "playing" || state === "waiting";
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
          status.innerHTML = `📖 <b>Part ${it.part}</b> — reading time: ${waitLeft}s. Look at questions ${ranges[it.part]}.`;
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
    btnStop.addEventListener("click", () => {
      token++; clearTimeout(waitT); clearTimeout(guard);
      TTS.cancel();
      state = "idle"; idx = 0; waitLeft = 0; highlight(null);
      status.textContent = "Stopped.";
      paint();
    });
    exam.addEventListener("change", paint);
    window.addEventListener("beforeunload", () => TTS.cancel());
    paint();
  }

  /* ================================================== Quiz */
  function initQuiz() {
    const groups = T.groups.map((g) => ({ ...g, context: g.map ? mapSVG() : g.context }));
    new window.IELTS.Quiz($("#listening-quiz"), {
      id: "listening:full",
      title: "Listening practice test · 40 questions",
      table: "listening",
      groups,
      onCheck() {
        $$("#transcripts .transcript").forEach((t) => t.classList.add("reveal"));
        const btn = $("#pl-tr");
        btn.textContent = $("#transcripts").hidden ? "📜 Show transcripts (answers highlighted)" : btn.textContent;
      },
      onReset() { $$("#transcripts .transcript").forEach((t) => t.classList.remove("reveal")); },
    });
  }

  initDictation();
  renderTranscripts();
  initPlayer();
  initQuiz();
})();
