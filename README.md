# IELTS 7.0 Academy

A self-study website for reaching **IELTS Band 7.0** in all four skills — Listening, Reading, Writing and Speaking.
Built with the same architecture and design language as [Android-Knowledge (AAOS 14 Academy)](https://github.com/Thuongst97/Android-Knowledge):
plain HTML/CSS/JS, no build step, a shared `core.js` runtime (header, sidebar, search, theme, pager) and GitHub Pages deployment.

## Modules

| # | Page | What's inside |
|---|------|---------------|
| 01 | `overview.html` | What IELTS is, test structure, inside each paper, Academic vs GT, the 9-band scale, scoring criteria for every skill, raw-score → band tables, overall band calculator, example questions, Band 7 strategy |
| 02 | `listening.html` | Question-type tactics, distractor traps, spelling/number dictation trainer, full 40-question test with text-to-speech audio (exam mode), transcripts |
| 03 | `reading.html` | Time management, question-type tactics, TRUE/FALSE/NOT GIVEN trainer, paraphrase recognition, full 40-question split-screen test with timer and highlighter |
| 04 | `writing.html` | Band 6/7/8 descriptors, Task 1 reports & GT letters, Task 2 essay types, annotated Band 8 models, Band 6 → 7 upgrades, common errors, timed writing studio with self-assessment |
| 05 | `speaking.html` | Criteria, Part 1–3 techniques, sample answers, pronunciation for Vietnamese speakers, speaking studio (cue cards, timers, recording, live transcript), question bank |
| 06 | `vocabulary.html` | 120 topic words with collocations, examples and Vietnamese meanings, collocation/paraphrase quizzes, spaced-repetition flashcards, linking words |
| 07 | `grammar.html` | Complex sentences, tenses, conditionals, clauses, passive, articles, punctuation, error-correction quiz |
| 08 | `plan.html` | Gap diagnosis, 12-week roadmap with saved checklists, daily routine, mock-test tracker with chart, test-day checklist, resources |

All practice passages, recording scripts and model answers are original training material written in the IELTS style.
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
  assets/js/data/*.js        listening/reading tests, vocabulary, speaking bank
  assets/js/pages/*.js       page-specific behaviour
```
