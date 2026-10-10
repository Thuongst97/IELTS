/* Writing page: Task 2 plan builder, cohesion quiz and sentence-upgrade drill. */
(function () {
  "use strict";
  const { $, $$, esc, store, toast, Timer } = window.IELTS;

  /* ================================================== Plan builder */
  const TYPES = {
    opinion: {
      name: "Agree / disagree", hint: "To what extent do you agree or disagree?",
      lenses: ["Why might the statement be true, and for whom?", "Where does it go too far (all / always / only)?", "What would happen if it became policy tomorrow?"],
      b1: "Main reason for your view", b2: "Second reason, or the opposing view and your answer",
      intro: "It is often argued that [paraphrase the statement]. THESIS",
      t1: "The most compelling reason for this view is that CLAIM.", t2: "Admittedly, some argue otherwise. However, CLAIM. / Furthermore, CLAIM.",
      concl: "In conclusion, I (largely) agree / disagree that…, because [reason 1] and [reason 2].",
    },
    discussion: {
      name: "Discuss both views", hint: "Discuss both views and give your own opinion.",
      lenses: ["Who holds view A, and what is their best argument?", "Who holds view B, and what is their best argument?", "Which argument is stronger, and why?"],
      b1: "View A (the one you agree with less)", b2: "View B (your view, more developed)",
      intro: "There is ongoing debate about whether [topic]. While some believe…, others argue… THESIS",
      t1: "Those who believe [view A] argue that CLAIM.", t2: "On the other hand, others maintain that CLAIM, and I share this view.",
      concl: "In conclusion, although there is some merit in [view A], I believe that [view B], since…",
    },
    outweigh: {
      name: "Advantages outweigh?", hint: "Do the advantages outweigh the disadvantages?",
      lenses: ["Two advantages: who benefits?", "Two disadvantages: who loses?", "Which side is more serious, more permanent or affects more people?"],
      b1: "The weaker side (concede it)", b2: "The stronger side + why it matters more",
      intro: "In recent years, [trend]. THESIS (e.g. I believe the benefits clearly outweigh the drawbacks.)",
      t1: "Admittedly, this development has some drawbacks. CLAIM.", t2: "Nevertheless, these problems are outweighed by the fact that CLAIM.",
      concl: "On balance, the advantages of… outweigh its disadvantages, because…",
    },
    posneg: {
      name: "Positive or negative?", hint: "Is this a positive or negative development?",
      lenses: ["Who benefits from the trend, and who suffers?", "Is the effect temporary or lasting?", "Is it positive for one group and negative for another?"],
      b1: "Main effect supporting your verdict", b2: "Second effect, or the other side and why it matters less",
      intro: "[Describe the trend.] THESIS (e.g. In my view, this is a largely positive development.)",
      t1: "The main reason this trend is [positive / negative] is that CLAIM.", t2: "It is true that CLAIM; however, this is outweighed by…",
      concl: "Overall, I believe this is a [positive / negative] development, since…",
    },
    problem: {
      name: "Problem / solution", hint: "What problems does this cause? What solutions can you suggest?",
      lenses: ["Problems for individuals?", "Problems for society or the economy?", "For each problem: who should act, and how exactly?"],
      b1: "Problems (2), each with its effect", b2: "Solutions matched to each problem (who + how)",
      intro: "[Paraphrase the situation.] This essay will outline the main problems and suggest how they could be addressed.",
      t1: "The most serious problem is that CLAIM.", t2: "Several measures could be taken to tackle these problems. Firstly, CLAIM.",
      concl: "In conclusion, [problems] could be addressed through [key measures].",
    },
    cause: {
      name: "Causes / effects", hint: "What are the causes? What are the effects?",
      lenses: ["Economic, social, technological or personal causes?", "Effects on individuals and on society?", "Short-term vs long-term effects?"],
      b1: "Causes (most fundamental first)", b2: "Effects (individual → society, or short → long term)",
      intro: "[Paraphrase the trend.] There are several reasons for this, and it has significant consequences.",
      t1: "The most fundamental cause is that CLAIM.", t2: "One major consequence of this is that CLAIM.",
      concl: "In conclusion, [causes] have led to [effects].",
    },
    twopart: {
      name: "Two-part question", hint: "Why is this happening? Is it a positive development?",
      lenses: ["Question 1: two reasons or facts.", "Question 2: your opinion + two reasons.", "One-line answer to each for the introduction."],
      b1: "Answer to question 1", b2: "Answer to question 2",
      intro: "[Paraphrase.] [Brief answer to Q1]. [Brief answer to Q2].",
      t1: "There are two main reasons why… Firstly, CLAIM.", t2: "As for whether…, I believe that CLAIM.",
      concl: "In conclusion, [answer to Q1], and [answer to Q2].",
    },
  };
  const QUESTIONS = [
    ["opinion", "Some people believe that university education should be free for all students. To what extent do you agree or disagree?"],
    ["opinion", "Children today spend too much time on electronic devices. Schools should limit their use. To what extent do you agree or disagree?"],
    ["opinion", "Artificial intelligence will eventually replace teachers in the classroom. To what extent do you agree or disagree?"],
    ["discussion", "Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better ways. Discuss both views and give your own opinion."],
    ["discussion", "Some people believe that tourism brings more benefits than problems to local communities, while others disagree. Discuss both views and give your own opinion."],
    ["outweigh", "More and more people are working from home rather than in an office. Do the advantages of this development outweigh the disadvantages?"],
    ["posneg", "In many countries, people are choosing to have children later in life. Is this a positive or negative development?"],
    ["problem", "People in many countries are living longer. What problems does this cause for society? How can these problems be solved?"],
    ["cause", "In many countries, the amount of plastic waste is increasing. What are the causes of this, and what are its effects?"],
    ["twopart", "Many people today prefer to shop online rather than in physical stores. Why is this? Is it a positive or negative development?"],
  ];
  const host = $("#planner");
  if (host) {
    const saved = store.get("planner", { q: 0, custom: "", ctype: "opinion", plans: {} });
    host.innerHTML = `
      <div class="pl-top">
        <label class="small muted">Question <select class="inp pl-q">${QUESTIONS.map(([t, q], i) => `<option value="${i}">${esc(TYPES[t].name)} · ${esc(q.slice(0, 70))}…</option>`).join("")}<option value="custom">✏️ My own question…</option></select></label>
        <span class="pl-timer"></span>
      </div>
      <div class="pl-custom" hidden>
        <textarea class="inp pl-custom-q" rows="2" placeholder="Paste a Task 2 question (e.g. from Cambridge IELTS or a practice test)"></textarea>
        <label class="small muted">Essay type <select class="inp pl-ctype">${Object.entries(TYPES).map(([k, t]) => `<option value="${k}">${esc(t.name)}</option>`).join("")}</select></label>
      </div>
      <div class="studio-prompt pl-prompt"></div>
      <div class="pl-lenses small"></div>
      <div class="pl-grid">
        <label class="pl-wide">① Position / thesis (one sentence)<textarea class="inp" data-f="thesis" rows="2"></textarea></label>
        <label class="pl-wide">② Brainstorm: rough ideas, anything goes<textarea class="inp" data-f="ideas" rows="3"></textarea></label>
        <fieldset><legend class="pl-b1"></legend>
          <label>Claim (topic sentence idea)<input class="inp" data-f="c1"></label>
          <label>Reason → mechanism (why / how)<textarea class="inp" data-f="d1" rows="2"></textarea></label>
          <label>Example<input class="inp" data-f="e1"></label>
        </fieldset>
        <fieldset><legend class="pl-b2"></legend>
          <label>Claim (topic sentence idea)<input class="inp" data-f="c2"></label>
          <label>Reason → mechanism (why / how)<textarea class="inp" data-f="d2" rows="2"></textarea></label>
          <label>Example<input class="inp" data-f="e2"></label>
        </fieldset>
      </div>
      <div class="row mt"><button class="btn primary pl-build" type="button">🧱 Build my outline</button><button class="btn ghost pl-clear" type="button">⟲ Clear this plan</button><a class="btn ghost" href="#studio">✍️ Go to the studio</a></div>
      <div class="pl-out" hidden><pre class="template pl-outline"></pre><div class="row"><button class="btn sm pl-copy" type="button">📋 Copy outline</button><span class="small muted">Check: every part of the question answered? Position the same in the introduction and conclusion? Each claim has a reason and an example?</span></div></div>`;
    const q = (s) => $(s, host);
    const timer = new Timer(q(".pl-timer"), { minutes: 5, label: "Planning", warnAt: 60 });
    const key = () => (saved.q === "custom" ? "custom" : "q" + saved.q);
    const type = () => (saved.q === "custom" ? saved.ctype : QUESTIONS[saved.q][0]);
    const question = () => (saved.q === "custom" ? saved.custom : QUESTIONS[saved.q][1]);
    const plan = () => (saved.plans[key()] = saved.plans[key()] || {});
    const persist = () => store.set("planner", saved);
    function paint() {
      const T = TYPES[type()];
      q(".pl-q").value = String(saved.q);
      q(".pl-custom").hidden = saved.q !== "custom";
      q(".pl-custom-q").value = saved.custom;
      q(".pl-ctype").value = saved.ctype;
      q(".pl-prompt").innerHTML = saved.q === "custom" ? `<b>${esc(T.name)}.</b> <span class="muted">${esc(T.hint)}</span>` : `<b>${esc(T.name)}.</b> ${esc(question())}`;
      q(".pl-lenses").innerHTML = `<b>Brainstorm prompts:</b> ${T.lenses.map(esc).join(" · ")} <span class="muted">· Lenses: who is affected · economic/social/health/education/environment · short vs long term · why → so what?</span>`;
      q(".pl-b1").textContent = "Body 1 · " + T.b1;
      q(".pl-b2").textContent = "Body 2 · " + T.b2;
      const p = plan();
      $$("[data-f]", host).forEach((el) => { el.value = p[el.dataset.f] || ""; });
      q(".pl-out").hidden = true;
    }
    host.addEventListener("input", (e) => {
      const f = e.target.dataset.f;
      if (f) { plan()[f] = e.target.value; persist(); if (!timer.running && !timer.ended && timer.left === timer.total) timer.start(); }
      if (e.target.classList.contains("pl-custom-q")) { saved.custom = e.target.value; persist(); }
    });
    q(".pl-q").addEventListener("change", (e) => { saved.q = e.target.value === "custom" ? "custom" : +e.target.value; persist(); timer.reset(); paint(); });
    q(".pl-ctype").addEventListener("change", (e) => { saved.ctype = e.target.value; persist(); paint(); });
    q(".pl-clear").addEventListener("click", () => { saved.plans[key()] = {}; persist(); paint(); timer.reset(); });
    q(".pl-build").addEventListener("click", () => {
      const T = TYPES[type()], p = plan();
      const v = (k, ph) => (p[k] && p[k].trim() ? p[k].trim().replace(/\s+/g, " ") : `[${ph}]`);
      const fill = (frame, claim) => frame.replace("CLAIM", claim).replace("THESIS", v("thesis", "your thesis"));
      if (timer.running) timer.pause();
      const out = [
        `QUESTION   ${question() || "(type your question above)"}`,
        ``,
        `INTRODUCTION (40–60 words)`,
        `  ${fill(T.intro)}`,
        ``,
        `BODY 1 · ${T.b1} (90–110 words)`,
        `  Topic sentence  ${fill(T.t1, v("c1", "claim 1"))}`,
        `  Develop         This is because ${v("d1", "reason → mechanism")}, which means that…`,
        `  Example         For instance, ${v("e1", "a specific, realistic example")}.`,
        `  Link            This shows why…`,
        ``,
        `BODY 2 · ${T.b2} (90–110 words)`,
        `  Topic sentence  ${fill(T.t2, v("c2", "claim 2"))}`,
        `  Develop         ${v("d2", "reason → mechanism")}, which in turn…`,
        `  Example         A clear example of this is ${v("e2", "a specific, realistic example")}.`,
        `  Link            For this reason, …`,
        ``,
        `CONCLUSION (30–40 words)`,
        `  ${T.concl}`,
        ``,
        `UNUSED IDEAS     ${v("ideas", "none")}`,
      ].join("\n");
      q(".pl-outline").textContent = out;
      q(".pl-out").hidden = false;
      const empty = ["thesis", "c1", "c2"].filter((k) => !(p[k] && p[k].trim()));
      if (empty.length) toast("Tip: fill in your thesis and both claims for a complete outline.");
    });
    q(".pl-copy").addEventListener("click", () => {
      const t = q(".pl-outline").textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Outline copied."), () => toast("Select the outline and copy it manually."));
    });
    paint();
  }

  /* ================================================== Cohesion quiz */
  const cq = $("#coh-quiz");
  if (cq && window.IELTS.Quiz) {
    const mcq = (n, text, opts, answer, why) => ({ n, type: "mcq", text, options: opts.map((o, i) => ["ABCD"[i], o]), answer, why });
    new window.IELTS.Quiz(cq, {
      id: "writing:cohesion",
      title: "Cohesive devices · 10 questions",
      groups: [{
        instr: "Choose the word or phrase that best completes each sentence.",
        questions: [
          mcq(1, "Many people move to cities in search of work. ___, urban areas are becoming overcrowded.", ["However", "As a result", "For instance", "Whereas"], "B", "The second sentence is a <b>consequence</b> of the first, so <em>As a result</em>. <em>Whereas</em> cannot start a new sentence."),
          mcq(2, "___ online learning is flexible, it requires a high level of self-discipline.", ["Despite", "However", "While", "Therefore"], "C", "A full clause follows (<em>online learning is flexible</em>), so you need a conjunction: <em>While / Although</em>. <em>Despite</em> needs a noun phrase; <em>However</em> starts a new sentence."),
          mcq(3, "___ the high cost, many families still choose private schools.", ["Although", "Despite", "However", "Because"], "B", "<em>the high cost</em> is a noun phrase, so <em>Despite</em> (or <em>In spite of</em>). <em>Although</em> needs a clause."),
          mcq(4, "Governments could tax sugary drinks. ___ would discourage overconsumption.", ["This measure", "It is", "Such", "The former"], "A", "<b>Reference</b>: <em>This measure</em> points back to the whole idea of taxing drinks, which is a Band 7 cohesion feature. <em>Such</em> needs a noun after it."),
          mcq(5, "Some cities invest in buses, while others choose trams. ___ are quieter but more expensive to build.", ["The former", "The latter", "These people", "Such"], "B", "<em>The latter</em> = the second item mentioned (trams). <em>The former</em> would mean buses."),
          mcq(6, "Public transport reduces emissions; ___, it eases congestion.", ["in addition", "in contrast", "nevertheless", "for example"], "A", "The second point <b>adds</b> another benefit. <em>Nevertheless</em> and <em>in contrast</em> signal opposition."),
          mcq(7, "The number of cyclists rose sharply, ___ the number of drivers fell.", ["whereas", "however", "moreover", "consequently"], "A", "<em>whereas</em> joins two contrasting clauses <b>in one sentence</b>. <em>However</em> would need a full stop or semicolon before it."),
          mcq(8, "___, some argue that homework is unnecessary. However, this view overlooks its role in building discipline.", ["Consequently", "Admittedly", "Therefore", "Similarly"], "B", "<em>Admittedly</em> introduces a <b>concession</b> that you then counter with <em>However</em>, a classic Band 7 pattern."),
          mcq(9, "Many students would like to study abroad, but few can afford to ___.", ["do it so", "do so", "make so", "doing"], "B", "<b>Substitution</b>: <em>do so</em> replaces <em>study abroad</em>, avoiding repetition."),
          mcq(10, "Cities need more green spaces, ___ parks and community gardens.", ["for example", "such as", "for instance", "namely that"], "B", "<em>such as</em> + a list of nouns. <em>For example / for instance</em> are normally followed by a full clause or set off with commas."),
        ],
      }],
    });
  }

  /* ================================================== Upgrade drill */
  const ud = $("#upgrade-drill");
  if (ud) {
    const ITEMS = [
      ["Concession (While…)", "Online courses are flexible. They need a lot of self-discipline.", "While online courses offer considerable flexibility, they demand a high level of self-discipline."],
      ["Participle clause (result)", "Several factories closed. Thousands of workers lost their jobs.", "Several factories closed down, leaving thousands of workers unemployed."],
      ["Nominalisation", "Online shopping grew quickly, so many high-street shops closed.", "The rapid growth of online shopping has led to the closure of many high-street stores."],
      ["Second conditional", "The government should tax plastic bags. People will use fewer.", "If the government were to tax plastic bags, people would use far fewer of them."],
      ["Cleft sentence", "Cost is the main reason people don't use public transport.", "What deters most people from using public transport is not the time it takes but the cost."],
      ["Non-defining relative clause", "Many graduates move abroad. This causes a shortage of skilled workers.", "Many graduates move abroad, which deprives their home countries of skilled workers."],
      ["Comparative correlative", "People use their phones more at night. They sleep less.", "The more time people spend on their phones at night, the less they tend to sleep."],
      ["Task 1 · trend + figures", "Sales were 20,000 in 2000. Sales were 60,000 in 2010.", "Sales tripled over the decade, rising from 20,000 units in 2000 to 60,000 in 2010."],
    ];
    const answers = store.get("upgrade-drill", {});
    ud.innerHTML = ITEMS.map(([s, b6, m], i) => `
      <div class="ud-item glass card">
        <div class="ud-h"><span class="badge purple">${esc(s)}</span><span class="small muted">${i + 1} / ${ITEMS.length}</span></div>
        <p class="ud-b6"><span class="lbl">Band 6</span>${esc(b6)}</p>
        <textarea class="inp ud-ta" data-i="${i}" rows="2" placeholder="Your Band 7 version…">${esc(answers[i] || "")}</textarea>
        <div class="row"><button class="btn sm" type="button" data-show="${i}">👁 Show a model answer</button></div>
        <p class="ud-model" hidden><span class="lbl">Model</span>${esc(m)}</p>
      </div>`).join("");
    ud.addEventListener("input", (e) => { if (e.target.dataset.i != null) { answers[e.target.dataset.i] = e.target.value; store.set("upgrade-drill", answers); } });
    ud.addEventListener("click", (e) => {
      const b = e.target.closest("[data-show]"); if (!b) return;
      const m = $(".ud-model", b.closest(".ud-item")); m.hidden = !m.hidden;
      b.textContent = m.hidden ? "👁 Show a model answer" : "🙈 Hide the model";
    });
  }
})();
