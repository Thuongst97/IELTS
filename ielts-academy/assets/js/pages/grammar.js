/* Grammar page: error-correction quiz. The correct option's position varies (deterministically, so saved drafts stay valid). */
(function () {
  "use strict";
  const { $ } = window.IELTS;
  // [correct, wrong, wrong, explanation]
  const ITEMS = [
    ["Although the city is expensive, many young people move there.", "Although the city is expensive, but many young people move there.", "Although the city is expensive many young people, move there.", "Use only one linker: <i>although</i> OR <i>but</i>, not both (Vietnamese “tuy… nhưng”)."],
    ["Because prices rose, sales fell.", "Because prices rose, so sales fell.", "Because of prices rose, sales fell.", "<i>Because</i> + clause, no <i>so</i>. <i>Because of</i> needs a noun: <i>because of rising prices</i>."],
    ["The internet provides a great deal of useful information.", "The internet provides a lot of useful informations.", "Internet provides many useful information.", "<i>Information</i> is uncountable (no -s, not <i>many</i>), and we say <i>the internet</i>."],
    ["The number of cars on the roads is increasing.", "The number of cars on the roads are increasing.", "The number of car on the roads is increasing.", "<i>The number of</i> + plural noun + singular verb."],
    ["Many people believe that education should be free.", "There are many people believe that education should be free.", "Many people believes that education should be free.", "Avoid the “There are many people + verb” calque; <i>people</i> takes a plural verb."],
    ["Smartphones are convenient; however, they can be addictive.", "Smartphones are convenient, however they can be addictive.", "Smartphones are convenient however, they can be addictive.", "Between two clauses, use a semicolon before <i>however</i> and a comma after it."],
    ["Society has changed dramatically over the last twenty years.", "The society has changed dramatically over the last twenty years.", "Society have changed dramatically since the last twenty years.", "No article for <i>society</i> in general; singular verb; <i>over the last…</i> (not <i>since</i>) with a period of time."],
    ["If university were free, more students would apply.", "If university is free, more students would apply.", "If university were free, more students will apply.", "Second conditional: <i>if + past (were)</i>, <i>would + verb</i>."],
    ["Last year, the government introduced a new tax on sugary drinks.", "Last year, the government introduces a new tax on sugary drinks.", "Last year, government has introduced a new tax on sugary drinks.", "A finished past time (<i>last year</i>) needs the past simple; <i>the government</i>."],
    ["Hanoi, which is the capital of Vietnam, has a population of over eight million.", "Hanoi, that is the capital of Vietnam, has a population of over eight million.", "Hanoi which is the capital of Vietnam has a population over eight million.", "Non-defining relative clause: commas + <i>which</i> (never <i>that</i>)."],
    ["Having finished the report, she went home.", "Having finished the report, the office was empty.", "Finished the report, she went home.", "The subject of the participle clause must be the subject of the main clause (<i>she</i> finished)."],
    ["This essay will discuss both views.", "This essay will discuss about both views.", "This essay will be discussed both views.", "<i>Discuss</i> takes a direct object — no <i>about</i>."],
    ["Despite the high cost, the project was completed.", "Despite of the high cost, the project was completed.", "Despite the cost was high, the project was completed.", "<i>Despite</i> + noun (no <i>of</i>, no clause). With a clause use <i>although</i>."],
    ["He is an engineer who works for a multinational company.", "He is engineer who works for a multinational company.", "He is an engineer who work for a multinational company.", "Singular countable job noun needs <i>a/an</i>; <i>who works</i> (3rd person)."],
    ["Excessive screen time has a detrimental effect on children's sleep.", "Excessive screen time has a detrimental affect on children's sleep.", "Excessive screen time has a detrimental effect to children's sleep.", "<i>effect</i> (noun) vs <i>affect</i> (verb); the collocation is <i>an effect on</i>."],
  ];
  const questions = ITEMS.map(([ok, w1, w2, why], i) => {
    const opts = [w1, w2];
    opts.splice((i * 2 + 1) % 3, 0, ok);
    const letters = ["A", "B", "C"];
    return { n: i + 1, type: "mcq", text: "Which sentence is correct?", options: opts.map((o, j) => [letters[j], o]), answer: letters[opts.indexOf(ok)], why };
  });
  new window.IELTS.Quiz($("#grammar-quiz"), {
    id: "grammar:errors",
    title: "Error correction · 15 questions",
    groups: [{ instr: "Choose the one sentence with <b>no errors</b>.", questions }],
  });
})();
