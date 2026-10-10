/* Writing page: charts, writing studio (timer, word count, analysis, self-check). */
(function () {
  "use strict";
  const { $, $$, esc, store, toast, Timer, pick } = window.IELTS;

  /* ================================================== Charts (practice data) */
  const LINE = {
    title: "Average daily bicycle journeys (thousands)",
    x: [2000, 2005, 2010, 2015, 2020, 2025],
    series: [["Aldwick", [12, 14, 19, 27, 38, 46]], ["Brenton", [30, 28, 25, 24, 22, 21]], ["Corley", [5, 6, 6, 18, 20, 21]]],
    max: 50, step: 10,
  };
  const BAR = {
    title: "Adults in Brenton who exercise at least twice a week (%)",
    x: ["18–29", "30–44", "45–59", "60+"],
    series: [["2005", [52, 41, 33, 20]], ["2025", [61, 45, 44, 38]]],
    max: 70, step: 10,
  };

  const lineChart = (d) => window.IELTS.Charts.line(d), barChart = (d) => window.IELTS.Charts.bar(d);
  $("#chart-line").innerHTML = lineChart(LINE);

  /* ================================================== Studio tasks */
  const TASKS = [
    { id: "t1-line", label: "Task 1 (Academic) · Line graph — bicycle journeys", min: 150, minutes: 20, chart: "line",
      prompt: "The graph below shows the average number of daily journeys made by bicycle in three cities between 2000 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words." },
    { id: "t1-bar", label: "Task 1 (Academic) · Bar chart — exercise by age", min: 150, minutes: 20, chart: "bar",
      prompt: "The bar chart below shows the percentage of adults in one city who exercised at least twice a week, by age group, in 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words." },
    { id: "t1-letter", label: "Task 1 (General) · Letter — noisy neighbours", min: 150, minutes: 20,
      prompt: "Your new neighbours have been making a lot of noise late at night. Write a letter to your neighbours. In your letter: • introduce yourself • explain the problem and how it is affecting you • suggest a solution. Begin your letter: Dear …" },
    { id: "t1-letter2", label: "Task 1 (General) · Letter — course enquiry", min: 150, minutes: 20,
      prompt: "You want to take an evening course at a local college. Write a letter to the college. In your letter: • say which course you are interested in and why • ask for information about the course • explain any special requirements you have. Begin your letter: Dear Sir or Madam," },
  ];
  const T2 = [
    ["Opinion", "Some people believe that university education should be free for all students. To what extent do you agree or disagree?"],
    ["Opinion", "Governments should spend more money on public health campaigns than on hospitals and medical treatment. To what extent do you agree or disagree?"],
    ["Opinion", "Children today spend too much time on electronic devices. Schools should limit their use. To what extent do you agree or disagree?"],
    ["Discussion", "Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better ways. Discuss both views and give your own opinion."],
    ["Discussion", "Some people believe that tourism brings more benefits than problems to local communities, while others disagree. Discuss both views and give your own opinion."],
    ["Discussion", "Some say that young people should be encouraged to take a gap year before starting university. Others think this wastes time. Discuss both views and give your opinion."],
    ["Problem / Solution", "In many countries, the amount of plastic waste is increasing. What are the causes of this, and what solutions can you suggest?"],
    ["Problem / Solution", "Many young people today lack basic financial skills, such as budgeting and saving. Why is this the case? What can be done about it?"],
    ["Advantages / Disadvantages", "More and more people are working from home rather than in an office. Do the advantages of this development outweigh the disadvantages?"],
    ["Advantages / Disadvantages", "In some countries, people are choosing to have children later in life. Do the advantages outweigh the disadvantages?"],
    ["Two-part", "Many people today prefer to shop online rather than in physical stores. Why is this? Is it a positive or negative development?"],
    ["Two-part", "In many cities, old buildings are being demolished to make way for modern ones. Why is this happening? Should old buildings be preserved?"],
    ["Opinion", "Artificial intelligence will eventually replace teachers in the classroom. To what extent do you agree or disagree?"],
    ["Two-part", "People in many countries are living longer. What problems does this cause for society? How can these problems be solved?"],
  ];
  T2.forEach(([type, prompt], i) => TASKS.push({ id: "t2-" + i, label: `Task 2 · ${type} — ${prompt.slice(0, 58)}…`, min: 250, minutes: 40, prompt: prompt + " Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words." }));

  /* ================================================== Self-check */
  const CHECK = {
    TR: ["I answered every part of the question", "My position is clear in the introduction and conclusion (Task 2) / I wrote a clear overview (Task 1)", "Each body paragraph has one main idea that is explained", "I supported ideas with specific examples or data", "I met the word count (250+ / 150+)"],
    CC: ["Each paragraph has a clear topic sentence", "Ideas progress logically; nothing jumps around", "I used reference words (this, these, such, it) to avoid repetition", "Linking words are varied and not overused"],
    LR: ["I used topic-specific vocabulary and collocations", "I avoided repeating the same key words (paraphrased)", "No informal words (kids, stuff, a lot of, really bad)", "Spelling is accurate"],
    GRA: ["I used a range of complex sentences (although, which, if, -ing clauses)", "Most of my sentences are completely error-free", "Verb tenses and subject–verb agreement are correct", "Articles and plurals are correct; no comma splices"],
  };
  const NAMES = { TR: "Task", CC: "Cohesion", LR: "Vocab", GRA: "Grammar" };

  const sel = $("#st-task"), ta = $("#st-text"), promptEl = $("#st-prompt"), chartEl = $("#st-chart");
  sel.innerHTML = `<optgroup label="Task 1">${TASKS.filter((t) => t.id.startsWith("t1")).map((t) => `<option value="${t.id}">${esc(t.label)}</option>`).join("")}</optgroup>
    <optgroup label="Task 2">${TASKS.filter((t) => t.id.startsWith("t2")).map((t) => `<option value="${t.id}">${esc(t.label)}</option>`).join("")}</optgroup>`;
  const timer = new Timer($("#st-timer"), { minutes: 40, label: "Time", warnAt: 300 });
  let task = null, saveT = null;

  function loadTask(id) {
    task = TASKS.find((t) => t.id === id) || TASKS[4];
    sel.value = task.id;
    promptEl.innerHTML = `<b>${task.id.startsWith("t1") ? "Task 1" : "Task 2"}.</b> ${esc(task.prompt).replace(/ • /g, "<br>• ")}`;
    chartEl.innerHTML = task.chart ? `<div class="chart-wrap" style="margin-bottom:12px">${task.chart === "line" ? lineChart(LINE) : barChart(BAR)}</div>` : "";
    $("#st-min").textContent = task.min;
    timer.setMinutes(task.minutes);
    ta.value = store.get("essay:" + task.id, "");
    store.set("essay:last", task.id);
    const checks = store.get("check:" + task.id, []);
    $$("#st-check input").forEach((c) => { c.checked = checks.includes(c.dataset.id); });
    $("#st-issues").hidden = true;
    stats(); estimate();
  }

  $("#st-check").innerHTML = Object.entries(CHECK).map(([k, items]) => `<h5>${k} — ${NAMES[k]}</h5>${items.map((t, i) => `<label><input type="checkbox" data-c="${k}" data-id="${k}${i}"><span>${esc(t)}</span></label>`).join("")}`).join("");
  function estimate() {
    const box = $("#st-est");
    const ids = [];
    box.innerHTML = Object.keys(CHECK).map((k) => {
      const all = $$(`#st-check input[data-c="${k}"]`), on = all.filter((c) => c.checked);
      on.forEach((c) => ids.push(c.dataset.id));
      const b = Math.round((5 + (on.length / all.length) * 3) * 2) / 2;
      return `<div><b>${b.toFixed(1)}</b>${NAMES[k]}</div>`;
    }).join("");
    if (task) store.set("check:" + task.id, ids);
  }
  $("#st-check").addEventListener("change", estimate);

  const words = (s) => (s.trim().match(/[A-Za-z0-9'’£$%.-]+/g) || []).filter((w) => /[A-Za-z0-9]/.test(w));
  function stats() {
    const txt = ta.value, w = words(txt).length;
    const paras = txt.split(/\n\s*\n|\n/).filter((p) => p.trim()).length;
    const sents = (txt.match(/[^.!?]+[.!?]+/g) || []).length || (txt.trim() ? 1 : 0);
    const wc = $("#st-wc");
    wc.textContent = w;
    wc.className = w >= task.min ? "wc-ok" : w > task.min * 0.7 ? "wc-low" : "";
    $("#st-pc").textContent = paras;
    $("#st-sl").textContent = sents ? Math.round(w / sents) : 0;
  }
  ta.addEventListener("input", () => {
    stats();
    clearTimeout(saveT);
    saveT = setTimeout(() => { store.set("essay:" + task.id, ta.value); $("#st-saved").textContent = "✓ Draft saved"; }, 600);
    if (!timer.running && ta.value.length === 1) timer.start();
  });
  sel.addEventListener("change", () => loadTask(sel.value));
  $("#st-random").addEventListener("click", () => loadTask(pick(TASKS.filter((t) => t.id.startsWith("t2"))).id));
  $("#st-clear").addEventListener("click", () => { if (!ta.value || confirm("Delete this draft?")) { ta.value = ""; store.del("essay:" + task.id); stats(); } });
  $("#st-copy").addEventListener("click", () => {
    const done = () => toast("Copied to clipboard");
    if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(done, () => toast("Copy failed — select the text manually."));
    else { ta.select(); try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ } }
  });

  /* ================================================== Analysis */
  const RULES = [
    [/\balthough\b[^.]*?,\s*but\b/gi, "“Although …, but …” — use only one linker (Although … , … / … , but …)."],
    [/\bbecause\b[^.]*?,\s*so\b/gi, "“Because …, so …” — use only one linker."],
    [/\b(informations|advices|researches|equipments|knowledges|evidences|furnitures|homeworks)\b/gi, "Uncountable noun with -s:"],
    [/\bin my opinion,?\s+i think\b/gi, "“In my opinion, I think” is redundant."],
    [/\bthere (is|are) (many|a lot of|some) (people|students|children) (think|believe|say|want)\b/gi, "“There are many people think…” → “Many people think…”."],
    [/\b(discuss|emphasi[sz]e|mention) (about|on)\b/gi, "Unneeded preposition after this verb:"],
    [/\bdespite of\b/gi, "“despite of” → “despite” or “in spite of”."],
    [/\b(don't|doesn't|can't|won't|isn't|aren't|it's|I'm|didn't|wouldn't|shouldn't)\b/gi, "Contraction — write the full form in academic writing:"],
    [/\b(kids|stuff|a lot of|lots of|gonna|wanna|things|really|very very|nowadays)\b/gi, "Informal or overused expression — find a more precise alternative:"],
    [/\b(firstly|secondly|thirdly|moreover|furthermore|in addition)\b/gi, null],
  ];
  const STOP = new Set("the a an and or but of to in on for with is are was were be been being it this that these those as at by from which who their there they them its his her our we you i not no can will would should could may might more most also than so such into about many some people other have has had do does did if when while because".split(" "));

  $("#st-analyse").addEventListener("click", () => {
    const txt = ta.value, box = $("#st-issues");
    const w = words(txt);
    const out = [];
    if (w.length < task.min) out.push(`<li class="c-amber">Under length: ${w.length}/${task.min} words. This lowers Task ${task.min === 250 ? "Response" : "Achievement"}.</li>`);
    const paras = txt.split(/\n\s*\n|\n/).filter((p) => p.trim()).length;
    if (task.min === 250 && paras < 4) out.push(`<li class="c-amber">Only ${paras} paragraph(s). Band 7 essays normally have 4–5 clear paragraphs.</li>`);
    if (task.min === 150 && task.chart && !/\b(overall|in general|it is clear|generally)\b/i.test(txt)) out.push(`<li class="c-red">No overview signal found (e.g. “Overall, …”). A clear overview is essential for Band 7 in Task 1.</li>`);
    let linkers = 0;
    RULES.forEach(([re, msg]) => {
      const m = txt.match(re);
      if (!m) return;
      if (msg === null) { linkers = m.length; return; }
      const uniq = [...new Set(m.map((x) => x.toLowerCase()))].slice(0, 6);
      out.push(`<li>${esc(msg)} <i>${uniq.map(esc).join(", ")}</i></li>`);
    });
    if (linkers > 5) out.push(`<li>Sentence-initial linkers used ${linkers} times (firstly, moreover, furthermore…). Mechanical linking can hold Coherence at Band 6 — use reference words (this, such) instead.</li>`);
    const sents = txt.match(/[^.!?]+[.!?]+/g) || [];
    const long = sents.filter((s) => words(s).length > 45).length;
    if (long) out.push(`<li>${long} very long sentence(s) (45+ words). Long sentences multiply grammar errors — split them.</li>`);
    const freq = {};
    w.forEach((x) => { const k = x.toLowerCase().replace(/[^a-z']/g, ""); if (k.length > 3 && !STOP.has(k)) freq[k] = (freq[k] || 0) + 1; });
    const reps = Object.entries(freq).filter(([, n]) => n >= 5).sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (reps.length) out.push(`<li>Most repeated words: ${reps.map(([k, n]) => `<b>${esc(k)}</b> ×${n}`).join(", ")}. Paraphrase some of them (see the Vocabulary page).</li>`);
    box.innerHTML = `<h4 style="margin-top:0">Automatic checks</h4>${out.length ? `<ul>${out.join("")}</ul>` : `<p class="c-green">No common problems detected. Now check the self-assessment list carefully.</p>`}<p class="small muted" style="margin:0">These checks catch frequent surface problems only. They cannot judge the quality of your ideas or grammar fully.</p>`;
    box.hidden = false;
  });

  loadTask(store.get("essay:last", "t2-0"));
})();
