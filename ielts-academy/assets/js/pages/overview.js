/* Overview page: conversion tables, overall band calculator, sample questions. */
(function () {
  "use strict";
  const { $, $$, esc, TABLES, rawToBand, overallBand, fmtBand, store, TTS, toast } = window.IELTS;

  /* ---------------------------------------------- Conversion tables */
  const NAMES = { listening: "Listening", "reading-ac": "Academic Reading", "reading-gt": "General Training Reading" };
  $("#conv-tables").innerHTML = Object.entries(TABLES).map(([k, t]) => {
    const rows = t.filter(([, b]) => b >= 4).map(([min, b], i, arr) => {
      const max = i === 0 ? 40 : arr[i - 1][0] - 1;
      return `<tr class="${b === 7 ? "hit" : ""}"><td class="num">${min === max ? min : `${min}–${max}`}</td><td class="num"><b>${b.toFixed(1)}</b></td></tr>`;
    }).join("");
    return `<div class="table-wrap" style="margin:0"><table class="t compact"><thead><tr><th colspan="2">${NAMES[k]}</th></tr><tr><th class="num">Correct /40</th><th class="num">Band</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join("");

  /* ---------------------------------------------- Calculator */
  const calc = $("#calc"), out = $("#calc-out"), rawBox = $("#calc-raw"), ver = $("#calc-ver");
  const saved = store.get("calc", { l: 6.5, r: 6.5, w: 6, s: 6, raw: false, ver: "reading-ac" });
  rawBox.checked = saved.raw; ver.value = saved.ver;
  const bandOpts = (v) => Array.from({ length: 19 }, (_, i) => i * 0.5).reverse().map((b) => `<option ${+v === b ? "selected" : ""}>${b.toFixed(1)}</option>`).join("");
  function renderInputs() {
    const raw = rawBox.checked;
    const field = (id, label, v, isRaw) => isRaw
      ? `<label>${label} (/40)<input class="inp" id="c-${id}" type="number" min="0" max="40" value="${Math.min(40, Math.round(v > 9 ? v : 30))}"></label>`
      : `<label>${label}<select class="inp" id="c-${id}">${bandOpts(v)}</select></label>`;
    calc.innerHTML = field("l", "Listening", saved.l, raw) + field("r", "Reading", saved.r, raw) + field("w", "Writing", saved.w, false) + field("s", "Speaking", saved.s, false) + `<button class="btn primary" type="button" id="c-go">Calculate</button>`;
    compute();
  }
  function compute() {
    const raw = rawBox.checked;
    const g = (id) => +$("#c-" + id).value;
    const l = raw ? rawToBand(g("l"), 40, "listening") : g("l");
    const r = raw ? rawToBand(g("r"), 40, ver.value) : g("r");
    const w = g("w"), s = g("s");
    const res = overallBand([l, r, w, s]);
    store.set("calc", { l: raw ? g("l") : l, r: raw ? g("r") : r, w, s, raw, ver: ver.value });
    out.innerHTML = `<div><span class="small muted">Overall band</span><div class="big ${res.band >= 7 ? "c-green" : ""}">${fmtBand(res.band)}</div></div>
      <div class="small">L ${fmtBand(l)} · R ${fmtBand(r)} · W ${fmtBand(w)} · S ${fmtBand(s)}<br>Average ${res.avg.toFixed(3)} → rounded to ${fmtBand(res.band)}<br>
      ${res.band >= 7 ? `<span class="c-green">✅ Overall 7.0 reached.</span>` : `<span class="c-amber">You need ${(27 - (l + r + w + s)).toFixed(1)} more band point(s) in total across the four skills (the average must reach 6.75).</span>`}
      ${[l, r, w, s].some((b) => b < 6.5) ? `<br><span class="c-red">⚠ A skill below 6.5 may fail “no band below 6.5” requirements.</span>` : ""}</div>`;
  }
  calc.addEventListener("change", compute);
  calc.addEventListener("input", (e) => { if (e.target.type === "number") compute(); });
  calc.addEventListener("click", (e) => { if (e.target.id === "c-go") compute(); });
  rawBox.addEventListener("change", () => { saved.l = rawBox.checked ? 30 : 6.5; saved.r = rawBox.checked ? 30 : 6.5; renderInputs(); });
  ver.addEventListener("change", compute);
  renderInputs();

  /* ---------------------------------------------- Sample questions */
  const AUDIO = "Thanks for calling. Just to confirm, your booking is for Saturday the fourteenth, and the total price is one hundred and twenty pounds. Oh, sorry, I tell a lie, there's a ten percent discount for students, so that comes to one hundred and eight pounds.";
  const TEXT = "Honeybees communicate the location of food sources to other members of the hive through a series of movements known as the 'waggle dance'. The angle of the dance indicates the direction of the food relative to the sun, while its duration signals distance. Although this behaviour was first described in detail in the 1940s, researchers are still investigating how accurately bees follow these instructions.";
  new window.IELTS.Quiz($("#sample-quiz"), {
    id: "overview:sample",
    title: "Sample questions · Listening & Reading",
    groups: [
      {
        title: "🎧 Listening · Part 1 style",
        instr: "Listen and complete the note. Write <b>A NUMBER</b> for each answer.",
        context: `<button class="btn sm primary" type="button" id="sample-play">▶ Play recording</button> <span class="small muted">Played once in the real test.</span>`,
        questions: [
          { n: 1, type: "gap", text: "Date of booking: Saturday {}", answer: ["14", "14th", "fourteenth"], why: "“Saturday the fourteenth”." },
          { n: 2, type: "gap", text: "Total price (with discount): £{}", answer: ["108"], why: "£120 is a distractor — the speaker corrects herself: “so that comes to one hundred and eight pounds”." },
        ],
      },
      {
        title: "📖 Reading · TRUE / FALSE / NOT GIVEN",
        instr: "Do the statements agree with the information in the text?",
        context: `<div class="model" style="font-size:.98rem">${esc(TEXT)}</div>`,
        questions: [
          { n: 3, type: "tfng", text: "The length of the waggle dance shows how far away the food is.", answer: "TRUE", why: "“its duration signals distance” — duration = length; distance = how far." },
          { n: 4, type: "tfng", text: "The waggle dance was discovered by a team of German scientists.", answer: "NOT GIVEN", why: "Only the 1940s is mentioned; nothing about who described it." },
          { n: 5, type: "tfng", text: "Scientists now fully understand how bees use the dance.", answer: "FALSE", why: "“researchers are still investigating” contradicts “fully understand”." },
        ],
      },
    ],
  });
  $("#sample-play").addEventListener("click", () => {
    if (!TTS.ok) { toast("Text-to-speech isn't available in this browser."); return; }
    TTS.cancel();
    TTS.speak(AUDIO, { rate: 0.95, speaker: 1 });
  });
})();
