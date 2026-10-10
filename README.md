# IELTS 7.0 Academy

A self-study website for reaching **IELTS Band 7.0** in all four skills — Listening, Reading, Writing and Speaking.
Built with the same architecture and design language as [Android-Knowledge (AAOS 14 Academy)](https://github.com/Thuongst97/Android-Knowledge):
plain HTML/CSS/JS, no build step, a shared `core.js` runtime (header, sidebar, search, theme, pager) and GitHub Pages deployment.

## Modules

| # | Page | What's inside |
|---|------|---------------|
| 1 | `overview.html` | What IELTS is, test structure, inside each paper, Academic vs GT, the 9-band scale, scoring criteria for every skill, raw-score → band tables, overall band calculator, example questions, Band 7 strategy |
| 2 | `guide.html` | Learning guidelines: a 3-stage study path (6.0 → 6.5 → 7.0) for each skill plus vocabulary & grammar, linked to lessons and to Practice Tests 1–10; weekly template; saved milestone checklist |
| 3 | `listening.html` | Question-type tactics, distractor traps, spelling/number dictation trainer, full 40-question test with text-to-speech audio (exam mode), transcripts |
| 4 | `reading.html` | Time management, question-type tactics, TRUE/FALSE/NOT GIVEN trainer, paraphrase recognition, full 40-question split-screen test with timer and highlighter |
| 5 | `writing.html` | **Academic Writing.** Band 6/7/8 descriptors; Task 1 step-by-step method for every visual (line, bar, pie, table, two visuals, process, map); Task 2 routine (decode → position → brainstorm lenses → idea ladder → outline) with a plan for each of 7 essay types and an interactive plan builder; Band 7+ frameworks (15 advanced structures, cohesive devices incl. reference & substitution, vocabulary templates, topic collocations) with a cohesion quiz and a sentence-upgrade drill; annotated Band 8 models, upgrades, common errors, timed studio |
| 6 | `mockups.html` | **Writing Mockups**: 20 Academic Task 1 questions (10 topics, line/bar/pie/table/process/map/two visuals) and 20 Task 2 questions (10 topics, every essay type), each with a Band 8 model answer, examiner-style notes and reusable language; browse by topic and type, optional timed attempt before reading the model. Deep links: `mockups.html#t1-05`, `#t2-12` |
| 7 | `speaking.html` | Criteria; step-by-step frameworks for every Part 1 question type, the Part 2 one-minute plan (note grid, 2-minute route, plans for 7 cue-card types, interactive planner) and every Part 3 question type (with a question-type drill); Band 7+ spoken structures, discourse markers and vocabulary upgrades; sample answers, pronunciation for Vietnamese speakers, speaking studio, question bank |
| 8 | `speaking-mockups.html` | **Speaking Mockups**: 15 Part 1 topics (4 questions each) and 15 Part 2 cue cards (3 each of person, place, object, event, experience) with 1-minute notes and a linked 3-question Part 3 discussion, all with Band 6.5–7 model answers about life in Vietnam, examiner-style notes, reusable language and Vietnamese words explained. Browser voice reads questions and answers; record-yourself practice; Part 2 plan/talk timer; hide answers until you've tried. Deep links: `speaking-mockups.html#p1-03`, `#p2-10` |
| 9 | `vocabulary.html` | 120 topic words with collocations, examples and Vietnamese meanings, collocation/paraphrase quizzes, spaced-repetition flashcards, linking words |
| 10 | `grammar.html` | Complex sentences, tenses, conditionals, clauses, passive, articles, punctuation, error-correction quiz |
| 11 | `plan.html` | Gap diagnosis, 12-week roadmap with saved checklists, daily routine, mock-test tracker with chart, test-day checklist, resources |
| 12 | `practice.html` | **Two series: Academy Tests 1–10 and full-length Exam Tests 1–5** (Exam Tests: original four-part Listening of 2,300–2,750 words with the real recordings' pauses; Writing; Speaking; Reading in progress). **Academy tests:** Pick a test and one skill, or a full 4-skill test (L → R → W → S) with timers and a final band report. Each test: Listening 4 parts / 40 Q with audio, Reading 3 passages / 40 Q, Writing Task 1 (chart) + Task 2, Speaking Parts 1–3. Deep links: `practice.html#t=3&s=reading`, `#t=5&s=full`. After marking, **Answers & explanations** shows the key, the evidence sentence (transcript or passage), why your answer didn't score and a tip for the question type; submitted attempts are saved for later review |
| 13 | `cambridge.html` | **CAMBRIDGE_TEST companion** for the official Cambridge IELTS books (15–19 recommended, 1–21 supported). Online 40-box answer sheets with timers, the book's answer key typed or pasted once (alternatives `/`, optional words `( )`, either-order pairs), marking and bands, a mistake-by-mistake review with automatic diagnosis, Writing and Speaking rooms and a results table. No Cambridge content is stored in the repo; keys and answers stay in the learner's browser. Deep link: `cambridge.html#b=17&t=2&s=reading` |

All practice passages, recording scripts and model answers are original training material written in the IELTS style. Cambridge IELTS tests are copyrighted by Cambridge University Press & Assessment and are not reproduced here; the Cambridge page is only an answer sheet and review tool for learners who own the books.
Progress (quiz results, drafts, flashcards, checklists) is stored only in the browser's `localStorage`.

## Run locally

```bash
cd ielts-academy
python3 -m http.server 8000
# open http://localhost:8000
```

Audio uses the browser's Web Speech API (best in Chrome, Edge and Safari). The live speaking transcript needs Chrome or Edge.

## Deploy

`.github/workflows/pages.yml` publishes `ielts-academy/` to GitHub Pages on every push to `main`
(enable *Settings → Pages → Source: GitHub Actions* once). Asset URLs are cache-busted with the commit ID.

## Structure

```
ielts-academy/
  *.html                     one page per module
  assets/css/main.css        design system (dark + light themes)
  assets/js/core.js          site map, layout, search, storage, timer, TTS, band helpers
  assets/js/quiz.js          shared quiz engine (gap, MCQ, TFNG/YNNG, matching, choose-two)
  assets/js/runners.js       shared Listening/Reading runners and Task 1 charts (line, bar, pie, table, process)
  assets/js/review.js        answer review: evidence finder, mistake diagnosis, question-type tips
  assets/js/rooms.js         shared Writing and Speaking test rooms (practice tests + Cambridge companion)
  assets/js/data/tests/exam-NN.js   full-length Exam Tests (checked by tools/check-tests.js)
  assets/js/data/mockups-t1.js / mockups-t2.js   Writing Mockups (checked by tools/check-mockups.js)
  assets/js/data/speaking-mockups-*.js            Speaking Mockups (checked by tools/check-speaking-mockups.js)
  tools/                     node tools/check-tests.js · node tools/check-mockups.js · node tools/check-speaking-mockups.js (answer and data verification)
  assets/js/data/*.js        module tests, vocabulary, speaking bank
  assets/js/data/tests/      practice tests: index.js (picker + builders) and test-01.js … test-10.js (loaded on demand)
  assets/js/pages/*.js       page-specific behaviour
```
