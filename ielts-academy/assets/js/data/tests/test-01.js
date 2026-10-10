/* Practice Test 1 — reuses the module tests (listening-test.js, reading-test.js). */
(window.IELTS_TESTS = window.IELTS_TESTS || {})[1] = {
  listening: window.LISTENING_TEST,
  reading: window.READING_TEST,
  writing: {
    task1: {
      prompt: "The graph below shows the average number of daily journeys made by bicycle in three cities between 2000 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      chart: { type: "line", title: "Average daily bicycle journeys (thousands)", x: [2000, 2005, 2010, 2015, 2020, 2025], series: [["Aldwick", [12, 14, 19, 27, 38, 46]], ["Brenton", [30, 28, 25, 24, 22, 21]], ["Corley", [5, 6, 6, 18, 20, 21]]], max: 50, step: 10 },
      plan: [
        "Overview: cycling rose in Aldwick and Corley but fell steadily in Brenton; Aldwick changed most, from second to by far the highest.",
        "Body 1: Brenton started highest (30,000) and declined gradually to 21,000.",
        "Body 2: Aldwick grew continuously, overtaking Brenton around 2013 and peaking at 46,000; Corley flat (~6,000) until 2010, tripled by 2015, then levelled off at 21,000 — equal to Brenton.",
        "See the annotated model on the Writing page (section 4.4).",
      ],
    },
    task2: {
      prompt: "Some people believe that university education should be free for all students. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      plan: [
        "Position (e.g. partly agree): free tuition widens access, but fully free education for everyone is costly and may not be the fairest use of public money.",
        "Body 1: benefits — talented students from poor families are not excluded; society gains skilled workers; less student debt.",
        "Body 2: concerns — huge cost to taxpayers, including those who never attend; risk of lower quality if universities are underfunded; better alternative: free tuition for low-income students + loans/scholarships.",
        "Conclusion: restate a clear position consistently.",
      ],
    },
  },
  speaking: {
    part1: [
      { topic: "Hometown", qs: ["Where is your hometown?", "What do you like most about it?", "Has your hometown changed much in recent years?", "Would you like to live there in the future?"] },
      { topic: "Reading", qs: ["Do you enjoy reading?", "What kind of things do you read?", "Do you prefer paper books or e-books?", "Did you read much as a child?"] },
    ],
    part2: { card: "Describe a skill you learned that took a long time.", bullets: ["what the skill was", "when and how you learned it", "what difficulties you had"], end: "and explain how you feel about this skill now.", theme: "learning skills" },
    part3: ["Which skills are most important for young people to learn today?", "Do you think schools teach practical skills well enough?", "Is it better to learn a skill from a teacher or by yourself, for example online?", "Why do some people give up learning new skills?"],
  },
};
