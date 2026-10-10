/* Vocabulary page: topic tables, quizzes and Leitner flashcards. */
(function () {
  "use strict";
  const { $, $$, esc, norm, slug, store, shuffle, toast } = window.IELTS;
  const V = window.VOCAB;
  const ALL = V.flatMap((t) => t.words.map((w) => ({ ...w, topic: t.id, topicName: t.name, key: t.id + ":" + w.w })));

  /* ================================================== Topic tables */
  let topic = "all";
  const pills = $("#v-pills"), tbody = $("#v-table tbody"), search = $("#v-search"), showVi = $("#v-vi");
  pills.innerHTML = `<button class="pill sel" data-t="all" type="button">All</button>` + V.map((t) => `<button class="pill" data-t="${t.id}" type="button">${t.icon} ${esc(t.name)}</button>`).join("");
  pills.addEventListener("click", (e) => {
    const b = e.target.closest(".pill"); if (!b) return;
    topic = b.dataset.t;
    $$(".pill", pills).forEach((p) => p.classList.toggle("sel", p === b));
    render();
  });
  function render() {
    const q = norm(search.value.trim());
    const list = ALL.filter((w) => (topic === "all" || w.topic === topic) && (!q || norm(`${w.w} ${w.def} ${w.col} ${w.ex} ${w.vi}`).includes(q)));
    const vi = showVi.checked;
    tbody.innerHTML = list.map((w) => `<tr id="v-${slug(w.w)}">
      <td><span class="v-word">${esc(w.w)}</span><span class="v-pos">${esc(w.pos)}</span><button class="speak-btn" type="button" data-say="${esc(w.w)}" aria-label="Pronounce ${esc(w.w)}">🔊</button>${topic === "all" ? `<br><span class="badge gray">${esc(w.topicName)}</span>` : ""}</td>
      <td>${esc(w.def)}<br><span class="v-col">${esc(w.col)}</span>${vi ? `<br><span class="v-vi">🇻🇳 ${esc(w.vi)}</span>` : ""}</td>
      <td class="v-ex">${esc(w.ex)}</td></tr>`).join("") || `<tr><td colspan="3" class="muted">No matching words.</td></tr>`;
    $("#v-count").textContent = `${list.length} of ${ALL.length} items`;
  }
  search.addEventListener("input", render);
  showVi.addEventListener("change", render);
  render();
  if (location.hash.startsWith("#v-")) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) { el.classList.add("hit"); setTimeout(() => el.scrollIntoView({ block: "center" }), 50); }
  }

  /* ================================================== Quizzes */
  const mc = (n, text, opts, answer, why) => ({ n, type: "mcq", text, options: opts.map((o, i) => [String.fromCharCode(65 + i), o]), answer, why });
  new window.IELTS.Quiz($("#col-quiz"), {
    id: "vocabulary:collocations",
    title: "Collocation check · 10 questions",
    groups: [{
      instr: "Choose the word that forms the most natural collocation.",
      questions: [
        mc(1, "Governments must ___ an effort to reduce plastic waste.", ["do", "make", "take"], "B", "<b>make an effort</b>. <i>Make</i> = create/produce; <i>do</i> = activities and tasks (do homework, do research)."),
        mc(2, "Scientists need to ___ more research into the long-term effects.", ["make", "do", "give"], "B", "<b>do research</b> (also: carry out / conduct research)."),
        mc(3, "Parents ___ a crucial role in a child's development.", ["play", "make", "have got"], "A", "<b>play a role / part</b>."),
        mc(4, "Students should ___ more attention to grammar.", ["give", "make", "pay"], "C", "<b>pay attention to</b>."),
        mc(5, "Plastic waste ___ a serious threat to marine life.", ["poses", "makes", "does"], "A", "<b>pose a threat / risk / challenge</b>."),
        mc(6, "The campaign aims to ___ awareness of mental health issues.", ["rise", "raise", "arise"], "B", "<b>raise awareness</b>. <i>Rise</i> has no object; <i>raise</i> takes one."),
        mc(7, "Commuters face ___ traffic every morning.", ["big", "strong", "heavy"], "C", "<b>heavy traffic</b> (also: heavy rain, heavy smoker)."),
        mc(8, "There was a ___ increase in prices last year.", ["sharp", "tall", "heavy"], "A", "<b>a sharp increase / rise / fall</b> (also: significant, dramatic, steady)."),
        mc(9, "After discussing the evidence, the committee ___ a conclusion.", ["did", "reached", "made up"], "B", "<b>reach / come to / draw a conclusion</b>."),
        mc(10, "Too much screen time can have a ___ effect on sleep.", ["detrimental", "harmless", "damaging to"], "A", "<b>a detrimental effect on</b>. “damaging to” doesn't fit before <i>effect</i>."),
      ],
    }],
  });
  new window.IELTS.Quiz($("#para-quiz"), {
    id: "vocabulary:paraphrase",
    title: "Paraphrase check · 4 questions",
    groups: [{
      instr: "Choose the best paraphrase — same meaning, natural English.",
      questions: [
        mc(1, "“The number of people who work from home has increased.”", ["Remote working has become more common.", "People who work at home have increased their numbers of work.", "Homeworking numbers have been raised by people."], "A", "A changes the structure and uses a noun phrase (<i>remote working</i>). B and C are unnatural."),
        mc(2, "“Governments should spend more on hospitals.”", ["Hospitals should spend more on governments.", "Greater public investment in hospitals is needed.", "Governments must hospitalise more money."], "B", "Passive-like noun phrase + synonym (<i>public investment</i>)."),
        mc(3, "“Children who use phones a lot sleep badly.”", ["Excessive phone use among children is associated with poor sleep.", "Children with a lot of phones are sleeping in a bad way.", "Phones use children and make their sleep bad."], "A", "Precise collocations: <i>excessive use</i>, <i>poor sleep</i>; and the hedged <i>associated with</i>."),
        mc(4, "“Cities are becoming more crowded because people move from the countryside.”", ["Countryside people make cities crowd.", "Rural-to-urban migration is leading to overcrowding in cities.", "Cities are moving people from the countryside."], "B", "Noun phrase (<i>rural-to-urban migration</i>) + cause verb (<i>is leading to</i>)."),
      ],
    }],
  });

  /* ================================================== Flashcards (Leitner) */
  const DAY = 86400000;
  const GAP = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };
  let state = store.get("leitner", {});
  let queue = [], cur = null, cram = false;
  const fc = $("#fc"), front = $(".fc-front"), back = $(".fc-back"), topicSel = $("#fc-topic"), rev = $("#fc-rev");
  topicSel.innerHTML = `<option value="all">All topics</option>` + V.map((t) => `<option value="${t.id}">${t.icon} ${esc(t.name)}</option>`).join("");
  topicSel.value = store.get("fc-topic", "all");
  const pool = () => ALL.filter((w) => topicSel.value === "all" || w.topic === topicSel.value);
  const boxOf = (w) => (state[w.key] ? state[w.key].box : 1);
  const isDue = (w) => !state[w.key] || state[w.key].due <= Date.now();

  function build() {
    const p = pool();
    const due = p.filter(isDue);
    // New cards (never seen) are limited to 15 per session so reviews stay manageable.
    const seen = due.filter((w) => state[w.key]), fresh = due.filter((w) => !state[w.key]).slice(0, 15);
    queue = cram ? shuffle(p) : shuffle(seen).concat(shuffle(fresh));
    next();
  }
  function paintBoxes() {
    const p = pool();
    $("#fc-boxes").innerHTML = [1, 2, 3, 4, 5].map((b) => `<div><b>${p.filter((w) => state[w.key] && boxOf(w) === b).length}</b>Box ${b}</div>`).join("");
    const learned = p.filter((w) => state[w.key] && boxOf(w) >= 4).length;
    $("#fc-info").innerHTML = `${queue.length + (cur ? 1 : 0)} card(s) in this session · <b>${learned}</b> / ${p.length} learned (box 4+) · ${p.filter((w) => !state[w.key]).length} new`;
  }
  function show() {
    fc.classList.remove("flipped");
    if (!cur) {
      front.innerHTML = `<div class="fc-word">🎉</div><p class="center">No cards due in this topic. Come back tomorrow, or press <b>Practise all</b>.</p>`;
      back.innerHTML = "";
      paintBoxes();
      return;
    }
    const w = cur;
    const wordSide = `<div class="fc-word">${esc(w.w)}</div><div class="fc-pos">${esc(w.pos)} · ${esc(w.topicName)}</div><div class="fc-hint">Say the meaning and a collocation, then flip (Space)</div>`;
    const meaningSide = `<h4>${esc(w.w)} <button class="speak-btn" type="button" data-say="${esc(w.w)}">🔊</button></h4><p>${esc(w.def)}</p><p class="v-col">${esc(w.col)}</p><p class="v-ex">“${esc(w.ex)}”</p><p class="fc-vi">🇻🇳 ${esc(w.vi)}</p>`;
    if (rev.checked) {
      front.innerHTML = `<p class="center" style="font-size:1.15rem">${esc(w.def)}</p><p class="center fc-vi">🇻🇳 ${esc(w.vi)}</p><div class="fc-hint">Which word? (${esc(w.pos)}, ${w.w.length} letters) — then flip</div>`;
    } else front.innerHTML = wordSide;
    back.innerHTML = meaningSide;
    paintBoxes();
  }
  function next() { cur = queue.shift() || null; show(); }
  function grade(g) {
    if (!cur) return;
    if (!fc.classList.contains("flipped")) { fc.classList.add("flipped"); return; }
    const b = boxOf(cur);
    const nb = g === "again" ? 1 : g === "good" ? Math.min(5, b + 1) : Math.min(5, b + 2);
    state[cur.key] = { box: nb, due: Date.now() + GAP[nb] * DAY };
    store.set("leitner", state);
    if (g === "again") queue.splice(Math.min(3, queue.length), 0, cur); // see it again soon
    next();
  }
  fc.addEventListener("click", (e) => { if (!e.target.closest("[data-say]")) fc.classList.toggle("flipped"); });
  $("#fc-again").addEventListener("click", () => grade("again"));
  $("#fc-good").addEventListener("click", () => grade("good"));
  $("#fc-easy").addEventListener("click", () => grade("easy"));
  document.addEventListener("keydown", (e) => {
    if (/input|textarea|select/i.test(document.activeElement.tagName)) return;
    const r = fc.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return; // only when the card is on screen
    if (e.key === " ") { e.preventDefault(); fc.classList.toggle("flipped"); }
    if (e.key === "1") grade("again");
    if (e.key === "2") grade("good");
    if (e.key === "3") grade("easy");
  });
  topicSel.addEventListener("change", () => { store.set("fc-topic", topicSel.value); cram = false; build(); });
  rev.addEventListener("change", show);
  $("#fc-cram").addEventListener("click", () => { cram = true; build(); toast("Practising all cards in this topic"); });
  $("#fc-reset").addEventListener("click", () => {
    if (!confirm("Reset all flashcard progress?")) return;
    state = {}; store.set("leitner", state); cram = false; build();
  });
  build();
})();
