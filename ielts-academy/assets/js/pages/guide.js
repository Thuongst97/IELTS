/* Learning guidelines: saved milestone checklist. */
(function () {
  "use strict";
  const { $, $$, esc, store } = window.IELTS;
  const MILESTONES = [
    ["🎧 Listening", "var(--blue)", ["Dictation trainer ≥ 90% correct", "Part 1 ≥ 9/10 in two tests", "27+/40 in two tests (Exam mode)", "30+/40 in three consecutive full tests"]],
    ["📖 Reading", "var(--green)", ["TFNG trainer 6/6", "One passage in under 25 min with 9+/13", "10+/13 per passage in 20 min, three times", "30+/40 in three consecutive 60-minute tests"]],
    ["✍️ Writing", "var(--gold)", ["Number-free overview in every Task 1", "Clear position in every Task 2 essay", "Both tasks finished in 60 minutes, at length", "Three essays in a row marked 7"]],
    ["🎙️ Speaking", "var(--purple)", ["Part 1 answers of 15–25 s without long pauses", "A full 2-minute talk on any cue card", "30-second Part 3 answers with examples", "A teacher's mock test scores 7"]],
    ["🧠 Vocabulary", "var(--amber)", ["Flashcards reviewed daily for 2 weeks", "60 words learned (box 4+)", "All 120 words learned (box 4+)", "Collocation quiz 10/10"]],
    ["🧩 Grammar", "var(--pink)", ["Articles & agreement section studied", "Error-correction quiz 14/15", "No “Although… but” / comma splices in 3 essays", "5+ different complex structures per essay"]],
  ];
  const ticks = store.get("guide-milestones", {});
  const host = $("#milestones-host");
  host.innerHTML = MILESTONES.map(([name, color, items], g) => `
    <div class="glass card accent" style="--accent:${color}"><h4>${esc(name)}</h4>
      <div class="checklist">${items.map((t, i) => `<label><input type="checkbox" data-id="${g}-${i}" ${ticks[`${g}-${i}`] ? "checked" : ""}><span>${esc(t)}</span></label>`).join("")}</div>
    </div>`).join("");
  const paint = () => {
    const all = $$("input", host), on = all.filter((c) => c.checked).length;
    $("#ms-total").textContent = `${on} / ${all.length} milestones reached`;
  };
  host.addEventListener("change", (e) => {
    if (!e.target.dataset.id) return;
    ticks[e.target.dataset.id] = e.target.checked;
    store.set("guide-milestones", ticks);
    paint();
  });
  paint();
})();
