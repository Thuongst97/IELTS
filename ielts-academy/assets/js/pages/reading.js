/* Reading page: TFNG trainer + the full practice test (shared ReadingRunner). */
(function () {
  "use strict";
  const { $, esc } = window.IELTS;
  const R = window.READING_TEST;

  /* ---------------------------------------------- TFNG trainer */
  $("#tfng-text").innerHTML = `<p>${esc(R.trainer.text)}</p>`;
  new window.IELTS.Quiz($("#tfng-quiz"), {
    id: "reading:tfng",
    title: "TRUE / FALSE / NOT GIVEN · 6 statements",
    groups: [{ instr: "Do the statements agree with the information in the text? Choose <b>TRUE</b>, <b>FALSE</b> or <b>NOT GIVEN</b>.", questions: R.trainer.questions }],
  });

  /* ---------------------------------------------- Split-screen test (shared ReadingRunner) */
  window.IELTS.ReadingRunner($("#reading-runner"), R, { id: "reading:full", title: "Academic Reading practice test · 40 questions" });
})();
