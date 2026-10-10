/* =========================================================================
   Practice tests: index (shown on the picker) + compact builders used by
   test-02.js … test-10.js. Each test file registers
   window.IELTS_TESTS[n] = { listening, reading, writing, speaking }.
   ========================================================================= */
window.IELTS_TESTS = window.IELTS_TESTS || {};

window.IELTS_TEST_INDEX = [
  { topics: "L: leisure centre · heritage park · food waste · green roofs — R: beavers · procrastination · forgetting" },
  { topics: "L: holiday cottage · community centre · four-day week · history of glass — R: bamboo · queuing · de-extinction" },
  { topics: "L: lost property · museum tour · coastal field trip · animal sleep — R: the Silk Road · sleep & memory · praise & mindset" },
  { topics: "L: cycling club · food festival · psychology experiment · fast fashion — R: honeybees · printing press · placebo effect" },
  { topics: "L: renting a flat · hotel induction · school energy project · bioluminescence — R: coral reefs · chocolate · language & thought" },
  { topics: "L: summer camp · city walking tour · tourism dissertation · animal navigation — R: desalination · clever crows · happiness economics" },
  { topics: "L: car hire · nature reserve day · commuting survey · urban farming — R: the Great Green Wall · habits · digital museums" },
  { topics: "L: health centre · theatre season · social media debate · ice cores — R: tea · earthquake engineering · boredom" },
  { topics: "L: party catering · careers fair · recycling project · colour psychology — R: rice terraces · bioplastics · self-driving ethics" },
  { topics: "L: evening classes · science museum · work placement · timekeeping — R: maps · microplastics · creativity & constraints" },
];

/** Full-length Exam Tests (data in exam-NN.js). "ready" lists the papers that are available. */
window.IELTS_EXAM_INDEX = [
  { topics: "L: volunteer weekend · Hollins Park map · food-waste report · biomimicry", ready: ["listening", "writing", "speaking"] },
];

/** Builders: keep the test files short and consistent. */
window.TB = (function () {
  const L = "ABCDEFGHIJ";
  const arr = (a) => (Array.isArray(a) ? a : [a]);
  return {
    gap: (n, text, answer, why) => ({ n, type: "gap", text, answer: arr(answer), why }),
    mcq: (n, text, opts, answer, why) => ({ n, type: "mcq", text, options: opts.map((o, i) => [L[i], o]), answer, why }),
    multi: (ns, text, opts, answer, why) => ({ n: ns, type: "multi", text, options: opts.map((o, i) => [L[i], o]), answer, why }),
    tf: (n, text, answer, why) => ({ n, type: "tfng", text, answer, why }),
    yn: (n, text, answer, why) => ({ n, type: "tfng", mode: "yn", text, answer, why }),
    sel: (n, text, answer, why, options) => ({ n, type: "select", text, answer, why, options }),
    box: (items, title) => ({ title, items: items.map((t, i) => (Array.isArray(t) ? t : [L[i], t])) }),
    roman: (items, title) => ({ title, items: items.map((t, i) => [["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"][i], t]) }),
    // opts (exam tests): { split: [line text or index, "1 to 7", "8 to 10"], check: true } adds the real test's mid-part and checking pauses
    part: (id, title, scene, speakers, lines, opts) => ({ id, title, scene, speakers, lines, ...(opts || {}) }),
  };
})();
