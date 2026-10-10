# IELTS 7.0 Academy

A self-study website for reaching **IELTS Band 7.0** in all four skills — Listening, Reading, Writing and Speaking.
Built with the same architecture and design language as [Android-Knowledge (AAOS 14 Academy)](https://github.com/Thuongst97/Android-Knowledge):
plain HTML/CSS/JS, no build step, a shared `core.js` runtime (header, sidebar, search, theme, pager) and GitHub Pages deployment.

## Modules

| # | Page | What's inside |
|---|------|---------------|
| 01 | `overview.html` | What IELTS is, test structure, inside each paper, Academic vs GT, the 9-band scale, scoring criteria for every skill, raw-score → band tables, overall band calculator, example questions, Band 7 strategy |
| 01.5 | `guide.html` | Learning guidelines: a 3-stage study path (6.0 → 6.5 → 7.0) for each skill plus vocabulary & grammar, linked to lessons and to Practice Tests 1–10; weekly template; saved milestone checklist |
| 02 | `listening.html` | Question-type tactics, distractor traps, spelling/number dictation trainer, full 40-question test with text-to-speech audio (exam mode), transcripts |
| 03 | `reading.html` | Time management, question-type tactics, TRUE/FALSE/NOT GIVEN trainer, paraphrase recognition, full 40-question split-screen test with timer and highlighter |
| 04 | `writing.html` | Band 6/7/8 descriptors, Task 1 reports & GT letters, Task 2 essay types, annotated Band 8 models, Band 6 → 7 upgrades, common errors, timed writing studio with self-assessment |
| 05 | `speaking.html` | Criteria, Part 1–3 techniques, sample answers, pronunciation for Vietnamese speakers, speaking studio (cue cards, timers, recording, live transcript), question bank |
| 06 | `vocabulary.html` | 120 topic words with collocations, examples and Vietnamese meanings, collocation/paraphrase quizzes, spaced-repetition flashcards, linking words |
| 07 | `grammar.html` | Complex sentences, tenses, conditionals, clauses, passive, articles, punctuation, error-correction quiz |
| 08 | `plan.html` | Gap diagnosis, 12-week roadmap with saved checklists, daily routine, mock-test tracker with chart, test-day checklist, resources |
| 09 | `practice.html` | **10 full practice tests.** Pick a test and one skill, or a full 4-skill test (L → R → W → S) with timers and a final band report. Each test: Listening 4 parts / 40 Q with audio, Reading 3 passages / 40 Q, Writing Task 1 (chart) + Task 2, Speaking Parts 1–3. Deep links: `practice.html#t=3&s=reading`, `#t=5&s=full`. After marking, **Answers & explanations** shows the key, the evidence sentence (transcript or passage), why your answer didn't score and a tip for the question type; submitted attempts are saved for later review |
| 10 | `cambridge.html` | **CAMBRIDGE_TEST companion** for the official Cambridge IELTS books (15–19 recommended, 1–21 supported). Online 40-box answer sheets with timers, the book's answer key typed or pasted once (alternatives `/`, optional words `( )`, either-order pairs), marking and bands, a mistake-by-mistake review with automatic diagnosis, Writing and Speaking rooms, results table and a mistake profile. No Cambridge content is stored in the repo; keys and answers stay in the learner's browser. Deep link: `cambridge.html#b=17&t=2&s=reading` |

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
  assets/js/data/*.js        module tests, vocabulary, speaking bank
  assets/js/data/tests/      practice tests: index.js (picker + builders) and test-01.js … test-10.js (loaded on demand)
  assets/js/pages/*.js       page-specific behaviour
```
