/* =========================================================================
   IELTS 7.0 Academy — core runtime
   Shared layout (header, sidebar, pager, footer), global search, scrollspy,
   tabs, tooltips, local progress storage, timers, text-to-speech and
   band-score helpers. Same architecture as AAOS 14 Academy.
   ========================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------ Site map */
  const SITE = [
    {
      id: "overview", file: "overview.html", group: "Start here",
      title: "IELTS Overview: Structure, Scoring & Band 7 Strategy", short: "Overview & Scoring", icon: "🧭", accent: "#70cff8",
      desc: "What IELTS is, how each paper is structured, every scoring criterion, the band scale, and exactly what 7.0 requires.",
      sections: [
        ["intro", "What is IELTS?", "ielts introduction who accepts versions ukvi one skill retake results validity"],
        ["format", "Test structure at a glance", "format structure timing sections minutes questions computer paper test day"],
        ["papers", "Inside each paper", "listening reading writing speaking parts tasks"],
        ["academic-gt", "Academic vs General Training", "academic general training gt difference"],
        ["scoring", "The 9-band scale", "band scale 0 9 expert good competent modest user"],
        ["criteria", "Scoring criteria by skill", "criteria marking task achievement response coherence cohesion lexical resource grammatical range accuracy fluency pronunciation"],
        ["conversion", "Raw score → band tables", "raw score conversion listening reading 30 40 correct answers"],
        ["calculator", "Overall band calculator", "calculator overall band average rounding"],
        ["examples", "Example questions from each paper", "example sample question taste"],
        ["band7", "What Band 7 really means", "band 7 good user descriptors"],
        ["strategy", "Your Band 7 strategy", "strategy plan priorities weakest skill profile"],
      ],
    },
    {
      id: "guide", file: "guide.html", group: "Start here",
      title: "Learning Guidelines: Your Path to 7.0", short: "Learning Guidelines", icon: "🗺️", accent: "#d4af37",
      desc: "A step-by-step study path for each skill — what to learn, how to practise with the 10 tests, and when to move on.",
      sections: [
        ["how", "How to use these guidelines", "how to use stages study path"],
        ["foundation", "Foundation: vocabulary & grammar", "foundation vocabulary grammar daily"],
        ["listening", "Listening study path", "listening study path stages practice tests"],
        ["reading", "Reading study path", "reading study path stages practice tests"],
        ["writing", "Writing study path", "writing study path stages feedback essays"],
        ["speaking", "Speaking study path", "speaking study path stages recording"],
        ["weekly", "A weekly study template", "weekly template timetable schedule"],
        ["milestones", "Milestones checklist", "milestones checklist progress self-check"],
      ],
    },
    {
      id: "listening", file: "listening.html", group: "Four skills",
      title: "Listening: 30/40 and Above", short: "Listening", icon: "🎧", accent: "#70cff8",
      desc: "Four parts, every question type, distractor traps, a dictation trainer and a full 40-question test with audio.",
      sections: [
        ["format", "Format & what Band 7 needs", "listening format parts 30 correct"],
        ["question-types", "Question types & tactics", "form completion map labelling multiple choice matching note completion"],
        ["traps", "Distractors & paraphrase traps", "distractor trap correction paraphrase signpost"],
        ["dictation", "Spelling & number dictation trainer", "dictation spelling numbers alphabet dates postcode phone"],
        ["practice", "Full practice test (40 questions)", "practice test mock audio part 1 2 3 4"],
        ["routine", "Band 7 training routine", "routine podcast shadowing cambridge"],
      ],
    },
    {
      id: "reading", file: "reading.html", group: "Four skills",
      title: "Reading: 30/40 and Above", short: "Reading", icon: "📖", accent: "#34d399",
      desc: "Time management, all question types, a TRUE/FALSE/NOT GIVEN trainer, paraphrase drills and a full timed test.",
      sections: [
        ["format", "Format & Band 7 target", "reading format passages academic 30"],
        ["time", "Time management", "time 20 minutes per passage skimming scanning"],
        ["question-types", "Question types & tactics", "matching headings true false not given yes no summary completion sentence endings"],
        ["tfng", "TRUE / FALSE / NOT GIVEN trainer", "true false not given trainer yes no"],
        ["paraphrase", "Paraphrase recognition", "paraphrase synonyms keywords"],
        ["practice", "Full practice test (40 questions)", "practice test mock passage beavers procrastination forgetting"],
        ["routine", "Band 7 training routine", "routine reading habit"],
      ],
    },
    {
      id: "writing", file: "writing.html", group: "Four skills",
      title: "Writing: Task 1 & Task 2 at Band 7", short: "Writing", icon: "✍️", accent: "#d4af37",
      desc: "Academic Task 1 & Task 2: step-by-step methods for every visual and essay type, Band 7+ grammar, cohesion and vocabulary frameworks, model answers and a timed studio.",
      sections: [
        ["criteria", "Scoring criteria: Band 6 vs 7 vs 8", "criteria task achievement response coherence cohesion lexical resource grammatical range accuracy"],
        ["task1", "Task 1 Academic: reports", "task 1 graph chart table process map overview"],
        ["task1-method", "Task 1 step by step: every visual type", "task 1 method steps line graph bar chart pie chart table process map two visuals overview grouping plan"],
        ["task1-language", "Task 1 language bank", "trends increase decrease fluctuate comparison approximately"],
        ["task1-model", "Task 1 model answer", "line graph model answer band 8"],
        ["task2", "Task 2: essay types & structures", "opinion discussion problem solution advantages disadvantages two-part essay structure thesis"],
        ["task2-method", "Task 2 step by step: brainstorm, argue, structure", "task 2 brainstorm ideas planning position thesis argument develop idea ladder plan builder outline essay types"],
        ["task2-models", "Task 2 model essays", "model essay band 8 opinion discussion causes"],
        ["frameworks", "Band 7+ language frameworks", "advanced grammar complex sentences structures cohesive devices linking words reference substitution vocabulary templates collocations drills"],
        ["upgrade", "From Band 6 to Band 7: upgrades", "upgrade band 6 band 7 improve sentences"],
        ["errors", "Common errors to eliminate", "errors mistakes articles comma splice"],
        ["studio", "Writing studio (timed practice)", "studio practice timer word count self assessment"],
      ],
    },
    {
      id: "mockups", file: "mockups.html", group: "Four skills",
      title: "Writing Mockups: 40 Model Answers by Topic", short: "Writing Mockups", icon: "🧾", accent: "#d4af37",
      desc: "20 Academic Task 1 and 20 Task 2 questions with Band 8 model answers, organised by topic, with examiner-style notes and reusable language.",
      sections: [
        ["browse", "Browse by topic", "mockups model answers sample essays task 1 task 2 topics education technology environment health work society cities crime media culture energy transport population tourism"],
        ["how", "How to study a model answer", "how to study model answers memorise plan compare"],
      ],
    },
    {
      id: "speaking", file: "speaking.html", group: "Four skills",
      title: "Speaking: Fluent, Natural Band 7", short: "Speaking", icon: "🎙️", accent: "#a78bfa",
      desc: "Step-by-step frameworks for every Part 1–3 question type, a 1-minute Part 2 planner, Band 7+ spoken language, pronunciation fixes and a record-yourself studio.",
      sections: [
        ["format", "Format & criteria", "speaking format criteria fluency coherence pronunciation"],
        ["part1", "Part 1: interview", "part 1 interview short answers"],
        ["part1-method", "Part 1 step by step: every question type", "part 1 question types preference frequency past change hypothetical framework"],
        ["part2", "Part 2: long turn", "part 2 cue card long turn one minute notes"],
        ["part2-method", "Part 2 step by step: the 1-minute plan", "part 2 plan notes grid route cue card types person place object event planner"],
        ["part3", "Part 3: discussion", "part 3 discussion abstract opinion speculate"],
        ["part3-method", "Part 3 step by step: every question type", "part 3 question types compare cause effect solution future hypothetical framework drill"],
        ["frameworks", "Band 7+ speaking frameworks", "spoken grammar structures discourse markers vocabulary upgrades collocations"],
        ["pronunciation", "Pronunciation for Vietnamese speakers", "pronunciation final consonants ending sounds word stress intonation vietnamese"],
        ["language", "Band 7 language toolkit", "fillers discourse markers idioms paraphrase"],
        ["studio", "Speaking studio (record & time)", "studio record timer cue card practice microphone"],
        ["bank", "Question bank", "question bank topics cue cards part 1 part 3"],
      ],
    },
    {
      id: "speaking-mockups", file: "speaking-mockups.html", group: "Four skills",
      title: "Speaking Mockups: Band 6.5–7 Answers about Vietnam", short: "Speaking Mockups", icon: "🗣️", accent: "#a78bfa",
      desc: "15 Part 1 topics and 15 cue cards with linked Part 3 discussions, each with a Band 6.5–7 model answer about life in Vietnam, read aloud, with record-yourself practice.",
      sections: [
        ["browse", "Browse by topic", "speaking mockups model answers sample part 1 part 2 part 3 cue card vietnam hometown food tet festival motorbike family teacher tourism weather"],
        ["level", "What Band 6.5–7 sounds like", "band 7 band 6.5 criteria fluency vocabulary grammar pronunciation"],
        ["vietnam", "Talking about Vietnam in English", "vietnam explain vietnamese words culture mistakes errors vietnamese speakers"],
        ["how", "How to practise with a model answer", "practise record compare memorise"],
      ],
    },
    {
      id: "vocabulary", file: "vocabulary.html", group: "Language toolkit",
      title: "Vocabulary for Band 7", short: "Vocabulary", icon: "🧠", accent: "#fbbf24",
      desc: "Less common topic vocabulary, collocations, paraphrasing and spaced-repetition flashcards.",
      sections: [
        ["lexical", "What Band 7 vocabulary means", "lexical resource less common collocation precision"],
        ["topics", "Topic vocabulary", "topics environment education technology health work society crime globalisation city"],
        ["collocations", "Collocations that score", "collocations verb noun adjective"],
        ["paraphrasing", "Paraphrasing techniques", "paraphrasing synonyms word form"],
        ["flashcards", "Flashcards (spaced repetition)", "flashcards leitner spaced repetition review"],
        ["linking", "Linking words & discourse markers", "linking words connectives cohesion however moreover"],
      ],
    },
    {
      id: "grammar", file: "grammar.html", group: "Language toolkit",
      title: "Grammar for Band 7", short: "Grammar", icon: "🧩", accent: "#f472b6",
      desc: "The complex structures examiners look for — and the accuracy that makes them count.",
      sections: [
        ["range", "Grammatical range for Band 7", "grammatical range accuracy error-free sentences"],
        ["complex", "Complex sentence toolkit", "complex sentences subordinate clauses although whereas"],
        ["tenses", "Tenses that matter in IELTS", "tenses present perfect past simple future"],
        ["conditionals", "Conditionals & hypotheticals", "conditionals if would were"],
        ["clauses", "Relative & participle clauses", "relative clauses which who participle clauses"],
        ["passive", "Passive & impersonal structures", "passive it is believed impersonal"],
        ["articles", "Articles, countability & agreement", "articles a an the countable uncountable subject verb agreement"],
        ["punctuation", "Punctuation that examiners notice", "punctuation comma splice semicolon"],
        ["quiz", "Error-correction quiz", "quiz error correction practice"],
      ],
    },
    {
      id: "plan", file: "plan.html", group: "Preparation",
      title: "Study Plan & Test Preparation", short: "Study Plan & Tracker", icon: "🗓️", accent: "#f87171",
      desc: "A 12-week roadmap to 7.0 with saved checklists, a daily routine, a mock-test tracker and a test-day checklist.",
      sections: [
        ["diagnose", "Diagnose your gap", "diagnose current level gap target"],
        ["roadmap", "12-week roadmap", "roadmap 12 weeks plan schedule checklist"],
        ["daily", "Daily & weekly routine", "daily routine weekly hours"],
        ["tracker", "Mock test tracker", "tracker mock test scores chart progress"],
        ["test-day", "Test-day checklist", "test day checklist id passport computer delivered"],
        ["resources", "Trusted resources", "resources books cambridge websites"],
      ],
    },
    {
      id: "practice", file: "practice.html", group: "Practice",
      title: "Practice Tests: 10 Full IELTS Tests", short: "Practice Tests", icon: "📝", accent: "#fb923c",
      desc: "10 complete tests. Practise one skill at a time, or sit a full 4-skill test with timers and a final band report.",
      sections: [
        ["choose", "Choose a test", "practice test choose skill full test 10 tests mock"],
        ["runner", "Test room", "test room listening reading writing speaking full test timer"],
        ["how", "How to use the practice tests", "how to use tips exam conditions review"],
      ],
    },
    {
      id: "cambridge", file: "cambridge.html", group: "Practice",
      title: "Cambridge IELTS Tests: Answer Sheets, Marking & Review", short: "Cambridge Tests", icon: "📚", accent: "#f472b6",
      desc: "Use your own Cambridge IELTS books (15–19 recommended): online answer sheets, timers, marking from the book's key, bands and a mistake-by-mistake review.",
      sections: [
        ["about", "How the Cambridge companion works", "cambridge books official past papers how it works copyright answer key"],
        ["choose", "Choose a Cambridge test", "cambridge 15 16 17 18 19 20 21 test choose book"],
        ["room", "Answer sheet & review", "answer sheet answer key mark review explanation mistakes"],
        ["results", "My Cambridge results", "results scores bands tracker cambridge"],
      ],
    },
  ];
  // Pages are numbered 1, 2, 3… in menu order; their sections are 1.1, 1.2… (see numberSections).
  SITE.forEach((p, i) => (p.num = String(i + 1)));

  /* --------------------------------------------- Trusted references */
  const R = {
    ielts: ["IELTS official website", "https://ielts.org/"],
    bcPrep: ["British Council — free IELTS preparation", "https://takeielts.britishcouncil.org/take-ielts/prepare"],
    idpPrep: ["IDP IELTS — preparation resources", "https://ielts.idp.com/prepare"],
    bbc: ["BBC Learning English", "https://www.bbc.co.uk/learningenglish"],
    bbc6: ["BBC 6 Minute English (podcast)", "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english"],
    ted: ["TED Talks (with transcripts)", "https://www.ted.com/talks"],
    camDict: ["Cambridge Dictionary (pronunciation & examples)", "https://dictionary.cambridge.org/"],
    ozdic: ["Ozdic — free collocation dictionary", "https://ozdic.com/"],
    awl: ["Academic Word List (Victoria University of Wellington)", "https://www.wgtn.ac.nz/lals/resources/academicwordlist"],
    guardian: ["The Guardian — long reads (reading practice)", "https://www.theguardian.com/news/series/the-long-read"],
    conversation: ["The Conversation — academic articles in plain English", "https://theconversation.com/"],
    youglish: ["YouGlish — hear any word in real speech", "https://youglish.com/"],
    cup: ["Cambridge University Press & Assessment — publisher of the Cambridge IELTS books", "https://www.cambridge.org/"],
  };
  const REFS = {
    overview: ["ielts", "bcPrep", "idpPrep"],
    guide: ["bcPrep", "idpPrep", "bbc6", "guardian", "ozdic"],
    listening: ["bcPrep", "idpPrep", "bbc6", "ted", "bbc"],
    reading: ["bcPrep", "idpPrep", "guardian", "conversation", "awl"],
    writing: ["bcPrep", "idpPrep", "ozdic", "camDict", "awl"],
    speaking: ["bcPrep", "idpPrep", "youglish", "camDict", "bbc"],
    vocabulary: ["awl", "ozdic", "camDict", "youglish"],
    grammar: ["bcPrep", "camDict", "bbc"],
    plan: ["ielts", "bcPrep", "idpPrep", "bbc6", "guardian"],
    practice: ["ielts", "bcPrep", "idpPrep"],
    cambridge: ["cup", "ielts", "bcPrep", "idpPrep"],
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const pageId = document.body.dataset.page || "home";
  const currentPage = SITE.find((p) => p.id === pageId);

  /* ------------------------------------------------ Local storage */
  /** Everything is kept in this browser only. Every access is guarded: storage may be blocked. */
  const NS = "ielts7:";
  const store = {
    get(k, def) {
      try { const v = localStorage.getItem(NS + k); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
    },
    set(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(NS + k); } catch (e) { /* ignore */ } },
    keys() {
      try { return Object.keys(localStorage).filter((k) => k.startsWith(NS)).map((k) => k.slice(NS.length)); } catch (e) { return []; }
    },
  };

  /* ------------------------------------------------ Band helpers */
  // Typical conversion tables published with practice materials. Real tests vary by ±1 mark.
  const LISTENING_TABLE = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
  const READING_AC_TABLE = [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
  const READING_GT_TABLE = [[40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6], [27, 5.5], [23, 5], [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5]];
  const TABLES = { listening: LISTENING_TABLE, "reading-ac": READING_AC_TABLE, "reading-gt": READING_GT_TABLE };
  /** Band for a raw score. Scores out of fewer than 40 questions are scaled to 40 first. */
  function rawToBand(raw, total, table) {
    const t = TABLES[table] || LISTENING_TABLE;
    const scaled = total && total !== 40 ? Math.round((raw / total) * 40) : raw;
    for (const [min, band] of t) if (scaled >= min) return band;
    return scaled > 0 ? 2 : 0;
  }
  /** Official rounding: average of four, .25 → up to .5, .75 → up to next whole band. */
  function overallBand(scores) {
    const v = scores.map(Number).filter((x) => !isNaN(x));
    if (v.length !== 4) return null;
    const avg = v.reduce((a, b) => a + b, 0) / 4;
    const whole = Math.floor(avg), frac = avg - whole;
    const band = frac < 0.25 ? whole : frac < 0.75 ? whole + 0.5 : whole + 1;
    return { avg, band };
  }
  const fmtBand = (b) => (b == null ? "–" : Number(b).toFixed(1));

  /** Practice results: { [quizId]: { raw, total, band, date, best } } */
  function saveResult(id, r) {
    const all = store.get("results", {});
    const prev = all[id];
    all[id] = { ...r, date: new Date().toISOString(), best: Math.max(r.raw, prev ? prev.best || prev.raw : 0), attempts: (prev ? prev.attempts || 1 : 0) + 1 };
    store.set("results", all);
    return all[id];
  }
  const getResults = () => store.get("results", {});

  /* ------------------------------------------------ Toast */
  let toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  /* ------------------------------------------------ Text-to-speech */
  /** Wraps speechSynthesis: British voices first (IELTS recordings are mostly UK/AU). */
  const TTS = {
    ok: typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined",
    voices: [],
    load() {
      if (!this.ok) return [];
      const all = speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
      const rank = (v) => (/en[-_]GB/i.test(v.lang) ? 0 : /en[-_]AU/i.test(v.lang) ? 1 : /en[-_](IE|NZ)/i.test(v.lang) ? 2 : /en[-_]US/i.test(v.lang) ? 3 : 4) * 10 + (/natural|neural|online|google/i.test(v.name) ? 0 : 1);
      this.voices = all.sort((a, b) => rank(a) - rank(b));
      return this.voices;
    },
    /** A distinct voice per speaker index, falling back to pitch changes if only one voice exists. */
    voiceFor(i) {
      if (!this.voices.length) this.load();
      if (!this.voices.length) return { voice: null, pitch: 1 };
      const v = this.voices[i % this.voices.length];
      const pitch = this.voices.length > 1 ? 1 : [1, 0.8, 1.2, 0.9][i % 4];
      return { voice: v, pitch };
    },
    speak(text, { rate = 1, speaker = 0, onend, onstart } = {}) {
      if (!this.ok) return null;
      const u = new SpeechSynthesisUtterance(text);
      const { voice, pitch } = this.voiceFor(speaker);
      if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = "en-GB";
      u.pitch = pitch; u.rate = rate;
      if (onend) { u.onend = onend; u.onerror = onend; }
      if (onstart) u.onstart = onstart;
      speechSynthesis.speak(u);
      return u;
    },
    cancel() { if (this.ok) speechSynthesis.cancel(); },
  };
  if (TTS.ok) { TTS.load(); speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", () => TTS.load()); }

  /** Small "🔊" buttons: <button class="speak-btn" data-say="word">🔊</button> */
  function initSpeakButtons() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-say]");
      if (!b) return;
      e.stopPropagation();
      if (!TTS.ok) { toast("Text-to-speech is not supported in this browser."); return; }
      TTS.cancel();
      TTS.speak(b.dataset.say, { rate: 0.9 });
    });
  }

  /* ------------------------------------------------ Timer */
  /**
   * Countdown timer widget. new Timer(host, { minutes, label, onEnd, warnAt (sec) })
   * Keeps counting into negative time (shown in red) so you can see how far over you went.
   */
  class Timer {
    constructor(host, opts = {}) {
      this.host = host; this.opts = opts;
      this.total = Math.round((opts.minutes || 20) * 60);
      this.left = this.total; this.t = null; this.ended = false;
      host.classList.add("timer");
      host.innerHTML = `<span class="tl">${esc(opts.label || "Time")}</span><span class="tm">00:00</span>
        <button class="btn sm" data-t="toggle">▶ Start</button><button class="btn sm ghost" data-t="reset" title="Reset">⟲</button>`;
      this.tm = $(".tm", host); this.btn = $('[data-t="toggle"]', host);
      host.addEventListener("click", (e) => {
        const b = e.target.closest("[data-t]"); if (!b) return;
        if (b.dataset.t === "toggle") this.running ? this.pause() : this.start();
        else this.reset();
      });
      this.paint();
    }
    get running() { return !!this.t; }
    setMinutes(m) { this.total = Math.round(m * 60); this.reset(); }
    start() {
      if (this.t) return;
      this.btn.textContent = "⏸ Pause";
      this.t = setInterval(() => {
        this.left--;
        if (this.left === 0 && !this.ended) { this.ended = true; if (this.opts.onEnd) this.opts.onEnd(); toast("⏰ Time is up!"); }
        this.paint();
        if (this.opts.onTick) this.opts.onTick(this.left);
      }, 1000);
      if (this.opts.onStart) this.opts.onStart();
    }
    pause() { clearInterval(this.t); this.t = null; this.btn.textContent = "▶ Resume"; }
    reset() { clearInterval(this.t); this.t = null; this.left = this.total; this.ended = false; this.btn.textContent = "▶ Start"; this.paint(); }
    elapsed() { return this.total - this.left; }
    paint() {
      const s = Math.abs(this.left), neg = this.left < 0;
      this.tm.textContent = (neg ? "-" : "") + String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
      this.host.classList.toggle("warn", this.left > 0 && this.left <= (this.opts.warnAt || 300));
      this.host.classList.toggle("over", this.left <= 0);
    }
  }

  const ICON_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

  /* --------------------------------------------------------------- Header */
  function renderHeader() {
    const host = $("#site-header");
    if (!host) return;
    const modLinks = SITE.map((p) => `<a href="${p.file}"><span class="dm-num">${p.num}</span><span><b>${p.icon} ${esc(p.short)}</b><i>${esc(p.desc)}</i></span></a>`).join("");
    const nav = (id, label, also = []) => `<a href="${id}.html" class="${pageId === id || also.includes(pageId) ? "active" : ""}">${label}</a>`;
    host.outerHTML = `
      <header class="site-header">
        <button class="menu-btn" id="menu-btn" aria-label="Open table of contents">☰</button>
        <a class="brand" href="index.html" aria-label="IELTS 7.0 Academy home">
          <div class="brand-mark">7.0</div>
          <span>IELTS 7.0 Academy<small>Band 7 Handbook</small></span>
        </a>
        <nav class="main-nav" aria-label="Main navigation">
          <div class="nav-drop ${currentPage ? "active" : ""}">
            <button aria-haspopup="true">Modules ▾</button>
            <div class="nav-drop-menu">${modLinks}</div>
          </div>
          ${nav("overview", "Overview")}${nav("guide", "Guide")}${nav("listening", "Listening")}${nav("reading", "Reading")}${nav("writing", "Writing", ["mockups"])}${nav("speaking", "Speaking", ["speaking-mockups"])}${nav("practice", "Practice", ["cambridge"])}${nav("plan", "Plan")}
        </nav>
        <div class="header-spacer"></div>
        <div class="global-search" role="search">
          <span class="s-icon">${ICON_SEARCH}</span>
          <input id="gs-input" type="search" placeholder="Search: TFNG, cue card, collocation…" autocomplete="off" aria-label="Search the site">
          <kbd>Ctrl K</kbd>
          <div class="search-results" id="gs-results" role="listbox"></div>
        </div>
        <button class="theme-btn" id="theme-btn" type="button"></button>
      </header>`;
  }

  /* ---------------------------------------------------------- Theme */
  function initTheme() {
    const btn = $("#theme-btn");
    if (!btn) return;
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const effective = () => root.getAttribute("data-theme") || (media.matches ? "light" : "dark");
    const paint = () => {
      const light = effective() === "light";
      btn.textContent = light ? "🌙" : "☀️";
      btn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
      btn.title = btn.getAttribute("aria-label");
    };
    btn.addEventListener("click", () => {
      const next = effective() === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ielts-theme", next); } catch (e) { /* storage unavailable */ }
      paint();
    });
    media.addEventListener("change", paint);
    paint();
  }

  /* ------------------------------------------------------- Global search */
  function buildIndex() {
    const idx = [];
    SITE.forEach((p) => {
      idx.push({ title: p.title, sub: p.desc, page: p.short, href: p.file, hay: norm(p.title + " " + p.desc + " " + p.short) });
      p.sections.forEach(([id, t, kw]) => idx.push({ title: t, sub: p.short, page: p.num, href: `${p.file}#${id}`, hay: norm(t + " " + kw + " " + p.short) }));
    });
    (window.VOCAB || []).forEach((topic) => topic.words.forEach((w) => idx.push({
      title: w.w, sub: `${topic.name} · ${w.def}`, page: "Vocabulary", href: `vocabulary.html#v-${slug(w.w)}`, hay: norm(w.w + " " + w.def + " " + topic.name),
    })));
    return idx;
  }
  function hilite(text, q) {
    if (!q) return esc(text);
    const n = norm(text), i = n.indexOf(q);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
  }
  function initGlobalSearch() {
    const input = $("#gs-input"), box = $("#gs-results");
    if (!input) return;
    let index = null, sel = -1;
    const run = () => {
      index = index || buildIndex();
      const q = norm(input.value.trim());
      if (!q) { box.classList.remove("open"); return; }
      const terms = q.split(/\s+/);
      const hits = index.filter((e) => terms.every((t) => e.hay.includes(t))).slice(0, 14);
      sel = -1;
      box.innerHTML = hits.length
        ? hits.map((h) => `<a href="${h.href}" role="option"><span class="sr-page">${esc(h.page)}</span><br><b>${hilite(h.title, q)}</b><small>${esc(h.sub)}</small></a>`).join("")
        : `<div class="sr-empty">No results for “${esc(input.value)}”.</div>`;
      box.classList.add("open");
    };
    input.addEventListener("input", run);
    input.addEventListener("focus", () => input.value && run());
    input.addEventListener("keydown", (e) => {
      const items = $$("a", box);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!items.length) return;
        sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach((a, i) => a.classList.toggle("sel", i === sel));
        items[sel].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        const t = items[sel >= 0 ? sel : 0];
        if (t) location.href = t.getAttribute("href");
      } else if (e.key === "Escape") {
        box.classList.remove("open"); input.blur();
      }
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".global-search")) box.classList.remove("open"); });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); input.focus(); input.select(); }
      else if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); input.focus(); }
    });
  }

  /* --------------------------------------------------------------- Sidebar */
  function renderSidebar() {
    const host = $("#sidebar");
    if (!host) return;
    const domSections = $$("section.doc-section[id]");
    const results = getResults();
    const groups = {};
    SITE.forEach((p) => (groups[p.group] = groups[p.group] || []).push(p));
    let html = `
      <div class="sb-progress">
        <div class="sb-progress-label"><span>Reading progress</span><span id="sb-pct">0%</span></div>
        <div class="sb-progress-bar"><div id="sb-bar"></div></div>
      </div>
      <div class="sb-filter">${ICON_SEARCH}
        <input id="sb-filter" type="search" placeholder="Filter contents…" aria-label="Filter table of contents">
        <div class="sb-filter-info" id="sb-filter-info"></div>
      </div>
      <nav aria-label="Table of contents">`;
    Object.entries(groups).forEach(([g, pages]) => {
      html += `<div class="sb-group"><div class="sb-group-title">${esc(g)}</div>`;
      pages.forEach((p) => {
        const cur = p.id === pageId;
        // Speaking has no scored tests, so it never shows a ✅.
        const done = p.id !== "speaking" && Object.keys(results).some((k) => k.startsWith(p.id + ":"));
        html += `<a class="sb-page ${cur ? "current" : ""}" href="${p.file}" data-hay="${esc(norm(p.title + " " + p.desc + " " + p.sections.map((s) => s[1] + " " + s[2]).join(" ")))}"><span class="sb-num">${p.num}</span>${esc(p.short)}${done ? `<span class="sb-ico" title="You have practice results here">✅</span>` : ""}</a>`;
        if (cur && domSections.length) {
          html += `<ul class="sb-sections">` + domSections.map((s) => {
            const title = s.dataset.title || ($("h2", s) || {}).textContent || s.id;
            return `<li><a href="#${s.id}" data-target="${s.id}">${s.dataset.num ? `<span class="sb-sub-num">${s.dataset.num}</span>` : ""}<span>${esc(title)}</span></a></li>`;
          }).join("") + `</ul>`;
        }
      });
      html += `</div>`;
    });
    html += `</nav>`;
    host.innerHTML = html;

    const sectionText = new Map(domSections.map((s) => [s.id, norm(s.textContent)]));
    const input = $("#sb-filter"), info = $("#sb-filter-info");
    input.addEventListener("input", () => {
      const q = norm(input.value.trim());
      let hitsSec = 0, hitsPage = 0;
      $$(".sb-sections a", host).forEach((a) => {
        const ok = !q || sectionText.get(a.dataset.target).includes(q) || norm(a.textContent).includes(q);
        a.parentElement.classList.toggle("sb-hidden", !ok);
        if (ok && q) hitsSec++;
      });
      $$(".sb-page", host).forEach((a) => {
        const ok = !q || a.dataset.hay.includes(q) || a.classList.contains("current");
        a.classList.toggle("sb-hidden", !ok);
        if (ok && q && !a.classList.contains("current")) hitsPage++;
      });
      $$(".sb-group", host).forEach((g) => g.classList.toggle("sb-hidden", !$$(".sb-page:not(.sb-hidden)", g).length));
      info.textContent = q ? `${hitsSec} section(s) on this page · ${hitsPage} other page(s)` : "";
    });

    const btn = $("#menu-btn");
    if (btn) {
      btn.addEventListener("click", () => host.classList.toggle("open"));
      host.addEventListener("click", (e) => { if (e.target.closest("a")) host.classList.remove("open"); });
    }
  }

  /* --------------------------------------------- Scrollspy & progress */
  function initScrollspy() {
    const links = $$(".sb-sections a");
    const bar = $("#sb-bar"), pct = $("#sb-pct");
    const sections = $$("section.doc-section[id]");
    const onScroll = () => {
      const h = document.documentElement;
      const p = Math.min(100, Math.max(0, (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100));
      if (bar) bar.style.width = p + "%";
      if (pct) pct.textContent = Math.round(p) + "%";
      let active = sections[0];
      sections.forEach((s) => { if (s.getBoundingClientRect().top - 140 <= 0) active = s; });
      links.forEach((a) => a.classList.toggle("active", active && a.dataset.target === active.id));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function decorateSections() {
    $$("section.doc-section[id]").forEach((s) => {
      const head = $(".sec-head h2", s);
      if (head && !$(".anchor", head)) head.insertAdjacentHTML("beforeend", `<a class="anchor" href="#${s.id}" aria-label="Link to section">#</a>`);
    });
  }

  /** Number the page's sections as sub-items of the page (2.1, 2.2…), the same in the headings and the sidebar. */
  function numberSections() {
    if (!currentPage) return;
    $$("section.doc-section[id]").forEach((s, i) => {
      const n = `${currentPage.num}.${i + 1}`;
      s.dataset.num = n;
      const h = $(".sec-head h2", s);
      if (!h) return;
      let el = $(".sec-num", h);
      if (!el) { el = document.createElement("span"); el.className = "sec-num"; h.prepend(el); }
      el.textContent = n;
    });
    const eb = $(".page-hero .eyebrow");
    if (eb) eb.textContent = eb.textContent.replace(/^Module [\d.]+/, `Module ${currentPage.num}`);
  }

  /* ------------------------------------------------- References */
  function renderReferences() {
    const keys = REFS[pageId];
    const pager = $("#pager");
    // Pages with their own annotated resources section (Study Plan) don't get a second one.
    if (!keys || !pager || $("#resources")) return;
    const sec = document.createElement("section");
    sec.className = "doc-section";
    sec.id = "references";
    sec.dataset.title = "Trusted resources";
    sec.innerHTML = `<div class="sec-head"><h2><span class="sec-num">📚</span>Trusted resources</h2></div>
      <p class="small muted">Official and high-quality free materials for this skill. For real exam practice, the Cambridge IELTS Academic books (authentic past papers) remain the gold standard.</p>
      <div class="ref-list">${keys.map((k) => {
        const [title, url] = R[k];
        return `<a class="ref-item glass" href="${url}" target="_blank" rel="noopener"><b>${esc(title)}</b><small>${esc(url.replace(/^https:\/\//, "").replace(/\/$/, ""))}</small></a>`;
      }).join("")}</div>`;
    pager.parentNode.insertBefore(sec, pager);
  }

  /* ----------------------------------------------------------- Pager */
  function renderPager() {
    const host = $("#pager");
    if (!host || !currentPage) return;
    const i = SITE.indexOf(currentPage);
    const prev = SITE[i - 1], next = SITE[i + 1];
    host.className = "pager";
    host.innerHTML =
      (prev ? `<a href="${prev.file}"><small>← Previous</small><b>${esc(prev.short)}</b></a>` : `<a href="index.html"><small>← Back</small><b>Home</b></a>`) +
      (next ? `<a class="next" href="${next.file}"><small>Next →</small><b>${esc(next.short)}</b></a>` : `<a class="next" href="index.html"><small>Done →</small><b>Back to dashboard</b></a>`);
  }

  /* ----------------------------------------------------------- Footer */
  function renderFooter() {
    const host = $("#site-footer");
    if (!host) return;
    host.outerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-links">
            ${SITE.map((p) => `<a href="${p.file}">${esc(p.short)}</a>`).join("")}
          </div>
        </div>
      </footer>`;
  }

  /* ------------------------------------------------------------- Tabs */
  function initTabs(root = document) {
    $$("[data-tabs]", root).forEach((tabs) => {
      if (tabs.dataset.ready) return;
      tabs.dataset.ready = "1";
      const btns = $$(":scope > .tab-list > button", tabs);
      const panels = $$(":scope > .tab-panel", tabs);
      const select = (key, focus) => {
        btns.forEach((b) => {
          const on = b.dataset.tab === key;
          b.setAttribute("aria-selected", on);
          b.tabIndex = on ? 0 : -1;
          if (on && focus) b.focus();
        });
        panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === key));
        tabs.dispatchEvent(new CustomEvent("tabchange", { detail: key }));
      };
      btns.forEach((b, i) => {
        b.setAttribute("role", "tab");
        b.type = "button";
        b.addEventListener("click", () => select(b.dataset.tab));
        b.addEventListener("keydown", (e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            const n = btns[(i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length];
            select(n.dataset.tab, true);
          }
        });
      });
      tabs.selectTab = select;
      const initial = btns.find((b) => b.getAttribute("aria-selected") === "true") || btns[0];
      if (initial) select(initial.dataset.tab);
    });
  }

  /* ------------------------------------------------- Annotated models */
  /** <div class="model-tools" data-for="id"> gets an "Show annotations" toggle for .model#id */
  function initModelToggles(root = document) {
    $$("[data-annotate]", root).forEach((btn) => {
      if (btn.dataset.ready) return;
      btn.dataset.ready = "1";
      const target = document.getElementById(btn.dataset.annotate);
      if (!target) return;
      const paint = () => { btn.textContent = target.classList.contains("annotate") ? "🖍 Hide annotations" : "🖍 Show annotations"; };
      btn.addEventListener("click", () => { target.classList.toggle("annotate"); paint(); });
      paint();
    });
  }

  /* ------------------------------------------------------ Tooltips */
  function initTooltips() {
    const tt = document.createElement("div");
    tt.className = "tt";
    tt.setAttribute("role", "tooltip");
    document.body.appendChild(tt);
    let owner = null;
    const render = (el) => {
      const raw = el.getAttribute("data-tip");
      const i = raw.indexOf(" — ");
      tt.innerHTML = i > 0 ? `<b>${esc(raw.slice(0, i))}</b> — ${esc(raw.slice(i + 3))}` : esc(raw);
    };
    const place = (x, y) => {
      const r = tt.getBoundingClientRect();
      let left = x + 14, top = y + 16;
      if (left + r.width > innerWidth - 8) left = x - r.width - 14;
      if (top + r.height > innerHeight - 8) top = y - r.height - 12;
      tt.style.left = Math.max(8, left) + "px";
      tt.style.top = Math.max(8, top) + "px";
    };
    const show = (el, x, y) => { if (!el.getAttribute("data-tip")) return; owner = el; render(el); tt.classList.add("show"); place(x, y); };
    const hide = () => { owner = null; tt.classList.remove("show"); };
    document.addEventListener("pointerover", (e) => {
      const el = e.target.closest && e.target.closest("[data-tip]");
      if (el && el !== owner) show(el, e.clientX, e.clientY);
      else if (!el) hide();
    });
    document.addEventListener("pointermove", (e) => { if (owner) place(e.clientX, e.clientY); });
    document.addEventListener("focusin", (e) => {
      const el = e.target.closest && e.target.closest("[data-tip]");
      if (el) { const r = el.getBoundingClientRect(); show(el, r.left + r.width / 2, r.bottom); } else hide();
    });
    document.addEventListener("focusout", hide);
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* --------------------------------------------------------- Table layout */
  /**
   * Browsers give most of a table's width to its longest column, which squeezes
   * short label columns ("Line graph", "Part 2 · Q11–20") onto two lines.
   * Short columns are kept on one line; medium ones get a sensible minimum width.
   */
  /** Length of the longest line in a cell (a <br> or a list item starts a new line). */
  const cellText = (c) => {
    const lines = c.innerHTML.replace(/<br\s*\/?>|<\/li>|<\/p>|<\/div>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/gi, "x").split("\n");
    return Math.max(0, ...lines.map((l) => l.trim().replace(/\s+/g, " ").length));
  };
  function fitTables(root = document) {
    $$("table.t", root).forEach((t) => {
      if (t.dataset.fit) return;
      t.dataset.fit = "1";
      const cols = [];
      Array.from(t.tBodies).forEach((b) => Array.from(b.rows).forEach((r) => {
        let ci = 0;
        Array.from(r.cells).forEach((c) => { if (c.colSpan === 1) (cols[ci] = cols[ci] || []).push(c); ci += c.colSpan; });
      }));
      cols.forEach((cells, ci) => {
        if (!cells || !cells.length) return;
        const longest = Math.max(...cells.map(cellText));
        // Row labels (first column) may be a little longer and still stay on one line.
        if (longest <= 16) cells.forEach((c) => c.classList.add("nw", "nw-s"));
        else if (longest <= (ci === 0 ? 32 : 24)) cells.forEach((c) => c.classList.add("nw"));
        else if (longest <= 60) cells.forEach((c) => c.style.setProperty("--cw", `${(Math.min(longest, 32) * 0.45).toFixed(1)}em`));
      });
      $$("thead th", t).forEach((th) => { const n = cellText(th); if (n <= 24) th.classList.add("nw"); if (n <= 12) th.classList.add("nw-s"); });
    });
  }
  function watchTables() {
    fitTables();
    if (!window.MutationObserver) return;
    let pending = false;
    new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; fitTables(); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* --------------------------------------------------------- Boot */
  function boot() {
    initTooltips();
    renderHeader();
    initTheme();
    renderReferences();
    numberSections();
    renderSidebar();
    decorateSections();
    renderPager();
    renderFooter();
    initGlobalSearch();
    initScrollspy();
    initTabs();
    initModelToggles();
    initSpeakButtons();
    watchTables();
    if (location.hash) {
      const jump = () => {
        const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (t) t.scrollIntoView({ behavior: "instant", block: "start" });
      };
      if (document.readyState === "complete") setTimeout(jump, 0);
      else window.addEventListener("load", () => setTimeout(jump, 0), { once: true });
    }
  }

  window.IELTS = {
    SITE, $, $$, esc, norm, slug, shuffle, pick, store, toast, TTS, Timer,
    rawToBand, overallBand, fmtBand, saveResult, getResults, initTabs, initModelToggles,
    TABLES, fitTables,
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
