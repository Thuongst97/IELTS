/* Listening page: dictation trainer + the full practice test (shared ListeningRunner). */
(function () {
  "use strict";
  const { $, esc, pick, TTS, toast, store } = window.IELTS;
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

  /* ================================================== Full test */
  window.IELTS.ListeningRunner($("#listening-runner"), T, { id: "listening:full", title: "Listening practice test · 40 questions" });

  initDictation();
})();
