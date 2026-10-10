/* Speaking page: Part 2 planner (note grid + 1-minute / 2-minute timers) and Part 3 question-type drill. */
(function () {
  "use strict";
  const { $, $$, esc, store, TTS } = window.IELTS;
  const BANK = (window.SPEAKING_BANK || {}).part2 || [];

  /* ================================================== Part 2 planner */
  const KINDS = [
    ["event", /\b(a time|an occasion|when you)\b/i, "Event / experience", ["When, where, who was there, why", "Before → what happened → result", "One problem or surprise", "How you felt then and how you see it now"]],
    ["media", /\b(book|film|movie|website|programme|program|app|song|tv|advertisement)\b/i, "Book / film / media", ["Title, type, where you came across it", "The content in 2–3 sentences, no more", "One scene or idea that stayed with you", "Why you liked it / who you'd recommend it to"]],
    ["ideal", /\b(would like|would love|ideal|dream|in the future|plan to|hope to)\b/i, "Ideal / future", ["What / where it is and how you heard about it", "What you would do (a plan)", "Who you would go with", "Why it appeals to you: use would / conditionals"]],
    ["person", /\b(person|someone|friend|teacher|relative|child|neighbour|family member|who)\b/i, "Person", ["How you know them, and for how long", "Personality, shown through one story", "What they did / how they influenced you", "What you learned from them"]],
    ["place", /\b(place|city|town|building|park|restaurant|café|cafe|shop|country|house|room)\b/i, "Place", ["Where it is, when you went, with whom", "The senses: what you saw, heard, tasted", "What you did there (a mini-story)", "Why it is special / would you go back?"]],
    ["activity", /\b(skill|activity|hobby|sport|habit|learn|learned|learnt|game)\b/i, "Activity / skill", ["When and why you started", "How you learned: steps and difficulties", "A moment of progress or failure", "Benefits now and plans for the future"]],
    ["object", /\b(object|thing|gift|present|item|photo|photograph|something you|equipment|piece)\b/i, "Object", ["What it looks like, briefly", "How you got it: your story", "How often and how you use it", "Practical value vs sentimental value"]],
    ["event", /\b(time|event|occasion|experience|trip|journey|day|celebration|festival|party|when you)\b/i, "Event / experience", ["When, where, who was there, why", "Before → what happened → result", "One problem or surprise", "How you felt then and how you see it now"]],
  ];
  const kindOf = (card) => KINDS.find((k) => k[1].test(card)) || KINDS[KINDS.length - 1];
  const host = $("#p2-planner");
  if (host && BANK.length) {
    const st = store.get("p2-planner", { i: 0, notes: {} });
    const BOXES = [["setting", "Setting", "when · where · who"], ["story", "Story", "start → problem → outcome"], ["details", "Details", "names · numbers · senses"], ["feelings", "Feelings", "then vs now"], ["explain", "Explain", "two reasons for the last bullet"]];
    host.innerHTML = `
      <div class="p2-top"><div class="cue-card p2-card"></div>
        <div class="p2-side">
          <div class="ring p2-ring"><div><span><b>1:00</b><small>prep</small></span></div></div>
          <div class="p2-btns"><button class="btn primary p2-start" type="button">▶ Start 1-minute prep</button><button class="btn ghost p2-new" type="button">🎲 New card</button><button class="btn ghost p2-stop" type="button" disabled>■ Stop</button></div>
          <div class="small muted p2-status">Read the card, name its type, choose your story, then fill the grid.</div>
        </div>
      </div>
      <div class="p2-kind small"></div>
      <div class="p2-grid">${BOXES.map(([k, l, h]) => `<label><b>${l}</b><small>${h}</small><textarea class="inp" data-k="${k}" rows="3"></textarea></label>`).join("")}</div>
      <div class="p2-route small"><b>Route:</b> 0:00 intro → 0:10 background → 0:40 story + details → 1:20 “explain” (2 reasons) → 1:50 reflection. Running out? Add a comparison, a consequence, someone's reaction or a future plan.</div>`;
    const q = (s) => $(s, host);
    let tick = null;
    const notes = () => (st.notes[st.i] = st.notes[st.i] || {});
    function paint() {
      const c = BANK[st.i % BANK.length], K = kindOf(c.card);
      q(".p2-card").innerHTML = `<h4>${esc(c.card)}</h4><p class="small" style="margin:0">You should say:</p><ul>${c.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul><p class="cc-foot">${esc(c.end)}</p>`;
      q(".p2-kind").innerHTML = `<span class="badge purple">Card type: ${esc(K[2])}</span> <b>Brainstorm:</b> ${K[3].map(esc).join(" · ")}`;
      const n = notes();
      $$("[data-k]", host).forEach((t) => { t.value = n[t.dataset.k] || ""; });
      ring(60, 60, "prep");
    }
    function ring(left, total, label) {
      const r = q(".p2-ring");
      r.style.setProperty("--p", ((total - left) / total) * 100);
      r.style.setProperty("--rc", label === "talk" ? "var(--purple)" : "var(--blue)");
      $("b", r).textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
      $("small", r).textContent = label;
    }
    const say = (t) => { if (TTS.ok) { TTS.cancel(); TTS.speak(t, { rate: 0.95, speaker: 2 }); } };
    function run(total, label, done) {
      clearInterval(tick);
      let left = total;
      ring(left, total, label);
      tick = setInterval(() => { left--; ring(left, total, label); if (left <= 0) { clearInterval(tick); done(); } }, 1000);
    }
    function stop(msg) {
      clearInterval(tick); TTS.cancel();
      q(".p2-start").disabled = false; q(".p2-new").disabled = false; q(".p2-stop").disabled = true;
      if (msg) q(".p2-status").textContent = msg;
    }
    q(".p2-start").addEventListener("click", () => {
      q(".p2-start").disabled = true; q(".p2-new").disabled = true; q(".p2-stop").disabled = false;
      q(".p2-status").textContent = "Preparing: keywords only, 2–4 per box.";
      run(60, "prep", () => {
        say("Alright? Remember, you have one to two minutes for this. Can you start speaking now, please?");
        q(".p2-status").textContent = "Speak now. Keep going until the timer ends.";
        run(120, "talk", () => { say("Thank you."); stop("Done. How far did your notes take you? Which box ran out first?"); });
      });
    });
    q(".p2-stop").addEventListener("click", () => { stop("Stopped."); ring(60, 60, "prep"); });
    q(".p2-new").addEventListener("click", () => { st.i = (st.i + 1 + Math.floor(Math.random() * (BANK.length - 1))) % BANK.length; store.set("p2-planner", st); paint(); });
    host.addEventListener("input", (e) => { const k = e.target.dataset.k; if (k) { notes()[k] = e.target.value; store.set("p2-planner", st); } });
    window.addEventListener("beforeunload", () => clearInterval(tick));
    paint();
  }

  /* ================================================== Part 3 question-type drill */
  const pq = $("#p3-quiz");
  if (pq && window.IELTS.Quiz) {
    const sel = (n, text, answer, why) => ({ n, type: "select", text: text + " {}", answer, why });
    new window.IELTS.Quiz(pq, {
      id: "speaking:p3types",
      title: "Part 3 question types · 10 questions",
      groups: [{
        instr: "Which framework fits each question? Choose <b>A–H</b>.",
        box: { title: "Question types", items: [["A", "Opinion"], ["B", "Compare"], ["C", "Cause"], ["D", "Effect / impact"], ["E", "Pros & cons"], ["F", "Solution / should"], ["G", "Future"], ["H", "Hypothetical"]] },
        questions: [
          sel(1, "Why do so many young people prefer to live in big cities?", "C", "<em>Why…?</em> asks for <b>causes</b>: main reason → explain → second reason → example."),
          sel(2, "How has family life changed compared with your grandparents' generation?", "B", "<em>compared with</em> → a <b>comparison</b>: past (<em>used to / would</em>) vs now (<em>whereas these days</em>) + why."),
          sel(3, "What would happen if all cars were banned from city centres?", "H", "<em>What would happen if…</em> → <b>hypothetical</b>: second conditional and a chain of consequences."),
          sel(4, "Is it important for children to learn how to manage money?", "A", "<em>Is it important…?</em> → <b>opinion</b>: position → reason → example → balance."),
          sel(5, "How do you think people will travel in fifty years' time?", "G", "<b>Future</b>: prediction → current evidence (<em>we're already seeing…</em>) → consequence → doubt."),
          sel(6, "What can be done to encourage people to recycle more?", "F", "<em>What can be done…</em> → <b>solution</b>: who should act → what → how it would work → limits."),
          sel(7, "What are the advantages and disadvantages of working for a large company?", "E", "<b>Pros & cons</b>: advantage → develop → <em>the flip side is…</em> → verdict."),
          sel(8, "How does social media affect the way young people see themselves?", "D", "<em>How does… affect…</em> → <b>effect / impact</b>: positive effect, negative effect, overall evaluation."),
          sel(9, "Do older and younger people spend their free time differently?", "B", "Two groups → <b>comparison</b>: <em>Older people tend to…, whereas younger people…</em>"),
          sel(10, "Who should be responsible for caring for elderly people: families or the government?", "F", "<em>Who should be responsible</em> → <b>solution / should</b>: <em>I think the responsibility lies mainly with…</em>"),
        ],
      }],
    });
  }
})();
