/* Reading page: TFNG trainer, split-screen full test, highlighter. */
(function () {
  "use strict";
  const { $, $$, esc, toast } = window.IELTS;
  const R = window.READING_TEST;
  const LETTERS = "ABCDEFGHIJ";

  /* ---------------------------------------------- TFNG trainer */
  $("#tfng-text").innerHTML = `<p>${esc(R.trainer.text)}</p>`;
  new window.IELTS.Quiz($("#tfng-quiz"), {
    id: "reading:tfng",
    title: "TRUE / FALSE / NOT GIVEN · 6 statements",
    groups: [{ instr: "Do the statements agree with the information in the text? Choose <b>TRUE</b>, <b>FALSE</b> or <b>NOT GIVEN</b>.", questions: R.trainer.questions }],
  });

  /* ---------------------------------------------- Split-screen test */
  const mounts = [];
  R.passages.forEach((p) => {
    const reader = $(`.reader[data-p="${p.id}"]`);
    reader.innerHTML = `
      <article class="passage" tabindex="0" aria-label="Reading Passage ${p.id}">
        <div class="sub">${esc(p.sub)}</div>
        <h3>${esc(p.title)}</h3>
        ${p.paras.map((t, i) => `<p>${p.lettered ? `<span class="pl">${LETTERS[i]}</span>` : ""}${esc(t)}</p>`).join("")}
      </article>
      <div class="reader-qs">
        <div class="reader-tools"><span>Passage ${p.id}</span><span class="spacer"></span><button class="btn sm ghost" data-clear type="button">🧽 Clear highlights</button></div>
      </div>`;
    const qs = $(".reader-qs", reader);
    p.groups.forEach((g) => {
      const m = document.createElement("div");
      qs.appendChild(m);
      mounts.push({ ...g, mount: m });
    });
  });

  new window.IELTS.Quiz($("#reading-quiz"), {
    id: "reading:full",
    title: "Academic Reading practice test · 40 questions",
    table: "reading-ac",
    timer: { minutes: 60, label: "Time left", warnAt: 600 },
    groups: mounts,
  });

  /* ---------------------------------------------- Highlighter */
  document.addEventListener("mouseup", () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const passage = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer.closest(".passage") : range.commonAncestorContainer.parentElement.closest(".passage");
    if (!passage || sel.toString().trim().length < 2) return;
    const span = document.createElement("span");
    span.className = "hlt";
    try { range.surroundContents(span); sel.removeAllRanges(); }
    catch (e) { toast("Highlight within one paragraph at a time."); }
  });
  document.addEventListener("click", (e) => {
    const h = e.target.closest(".hlt");
    if (h && !window.getSelection().toString()) { h.replaceWith(...h.childNodes); return; }
    const b = e.target.closest("[data-clear]");
    if (b) $$(".hlt", b.closest(".reader")).forEach((x) => x.replaceWith(...x.childNodes));
  });
})();
