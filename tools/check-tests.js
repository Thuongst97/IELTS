#!/usr/bin/env node
/* =========================================================================
   Strict checker for the full-length Exam Tests.
   Every answer is verified against the exact text the learner sees:

   Listening
     - questions 1–40 present once each; every question has an explanation
     - exactly one [[marker]] per mark, in question order; the marker for a
       completion question must contain its answer (spelled-out names allowed)
     - every quotation in an explanation appears word for word in the script
   Reading
     - three passages, each 700–900 words; questions 1–40 present once each
     - every completion answer appears word for word in its passage
     - every explanation quotes the passage, and each quotation is verbatim
     - paragraph-letter answers exist; TRUE/FALSE/NOT GIVEN and YES/NO/NOT
       GIVEN answers are valid and each value is used
   All papers
     - word limits in the instructions are respected by every accepted answer
     - multiple-choice / matching answers are real options

   Usage: node tools/check-tests.js            (all exam tests)
          node tools/check-tests.js 1 3        (Exam Tests 1 and 3)
   ========================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "ielts-academy", "assets", "js", "data", "tests");
const ctx = { window: {} };
ctx.window.window = ctx.window;
vm.createContext(ctx);
const run = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
run("index.js");

const want = process.argv.slice(2).map(Number);
const files = fs.readdirSync(ROOT).filter((f) => /^exam-\d+\.js$/.test(f)).sort();
files.forEach(run);
const TESTS = ctx.window.IELTS_TESTS;

const plain = (s) => String(s).replace(/<[^>]+>/g, "").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
const alnum = (s) => plain(s).toLowerCase().replace(/[^a-z0-9]/g, "");
const words = (s) => plain(s).split(/\s+/).filter(Boolean);
const isNum = (w) => /^[£$€]?\d[\d.,:/]*(%|st|nd|rd|th|am|pm)?$/i.test(w);
const nums = (q) => (Array.isArray(q.n) ? q.n : [q.n]);

let errors = 0, warnings = 0;
const err = (t, m) => { errors++; console.log(`  ✗ ${t}: ${m}`); };
const warn = (t, m) => { warnings++; console.log(`  ! ${t}: ${m}`); };

/** Word-limit rule from an instruction like "NO MORE THAN TWO WORDS AND/OR A NUMBER". */
function limitOf(instr) {
  const s = plain(instr || "").toUpperCase();
  const N = { ONE: 1, TWO: 2, THREE: 3 };
  let m;
  if ((m = s.match(/NO MORE THAN (ONE|TWO|THREE) WORDS?( AND\/OR A NUMBER)?/))) return { words: N[m[1]], number: !!m[2] };
  if ((m = s.match(/(ONE|TWO|THREE) WORDS? AND\/OR A NUMBER/))) return { words: N[m[1]], number: true };
  if (/ONE WORD ONLY/.test(s)) return { words: 1, number: false };
  if (/A NUMBER/.test(s) && /WRITE/.test(s)) return { words: 0, number: true };
  return null;
}
function checkLimit(tag, ans, lim) {
  if (!lim) return;
  const w = words(ans), n = w.filter(isNum).length, t = w.length - n;
  if (t > lim.words || n > (lim.number ? 1 : 0)) err(tag, `“${ans}” breaks the word limit (${lim.words} word(s)${lim.number ? " and/or a number" : ""})`);
}
/** Each quotation “…” in an explanation must appear verbatim in the source (ellipses split fragments). */
function checkQuotes(tag, why, source, required) {
  const src = plain(source).toLowerCase();
  const qs = [...String(why || "").matchAll(/“([^”]+)”/g)].map((m) => m[1]);
  if (required && !qs.length) err(tag, "explanation has no quotation from the text");
  qs.forEach((q) => plain(q).toLowerCase().split(/\s*(?:…|\.\.\.)\s*/).filter((f) => f.split(" ").length >= 2).forEach((f) => {
    const frag = f.replace(/^[,.;:\s]+|[,.;:\s]+$/g, "");
    if (!src.includes(frag)) err(tag, `quotation not found in the text: “${frag}”`);
  }));
}
function checkNumbering(tag, qs) {
  const seen = qs.flatMap(nums).sort((a, b) => a - b);
  const exp = Array.from({ length: 40 }, (_, i) => i + 1);
  if (seen.join() !== exp.join()) err(tag, `questions are not exactly 1–40 (got ${seen.join(",")})`);
}
function checkOptions(tag, q, g) {
  const letters = q.options ? q.options.map((o) => o[0]) : q.type === "select" ? (q.options || (g.box ? g.box.items.map((i) => i[0]) : [])) : [];
  if (q.type === "mcq" && !letters.includes(q.answer)) err(tag, `answer ${q.answer} is not an option`);
  if (q.type === "multi") {
    if (q.answer.length !== nums(q).length) err(tag, "number of answers does not match question numbers");
    q.answer.forEach((a) => { if (!letters.includes(a)) err(tag, `answer ${a} is not an option`); });
    if (new Set(q.answer).size !== q.answer.length) err(tag, "duplicate answers");
  }
  if (q.type === "select" && !letters.length) err(tag, "dropdown has no options (add a box or pass the letters)");
  if (q.type === "select" && letters.length && !letters.includes(q.answer)) err(tag, `answer ${q.answer} is not in the box`);
  if (q.type === "tfng") {
    const ok = q.mode === "yn" ? ["YES", "NO", "NOT GIVEN"] : ["TRUE", "FALSE", "NOT GIVEN"];
    if (!ok.includes(q.answer)) err(tag, `invalid answer ${q.answer}`);
  }
}

function checkListening(key, L) {
  const tag = (q) => `Exam ${key} L${Array.isArray(q.n) ? q.n.join("&") : q.n}`;
  if (!L || L.parts.length !== 4) return err(`Exam ${key} L`, "listening needs 4 parts");
  const qs = L.groups.flatMap((g) => g.questions.map((q) => ({ q, g })));
  checkNumbering(`Exam ${key} L`, qs.map((x) => x.q));
  const markers = [];
  const transcript = {};
  L.parts.forEach((p) => {
    transcript[p.id] = p.lines.map((l) => l[1].replace(/\[\[|\]\]/g, "")).join(" ");
    p.lines.forEach((l) => { const re = /\[\[(.+?)\]\]/g; let m; while ((m = re.exec(l[1]))) markers.push({ text: m[1], part: p.id }); });
  });
  if (markers.length !== 40) err(`Exam ${key} L`, `${markers.length} answer markers in the scripts (need 40)`);
  const wc = L.parts.map((p) => words(transcript[p.id]).length);
  console.log(`  Listening script words by part: ${wc.join(" / ")} (total ${wc.reduce((a, b) => a + b, 0)})`);
  qs.forEach(({ q, g }) => {
    const t = tag(q);
    if (!q.why) err(t, "no explanation");
    checkOptions(t, q, g);
    const partId = Math.ceil(nums(q)[0] / 10);
    nums(q).forEach((n) => { const m = markers[n - 1]; if (m && m.part !== Math.ceil(n / 10)) err(t, `marker ${n} is in part ${m.part}`); });
    if (q.type === "gap") {
      const m = markers[q.n - 1];
      const lim = limitOf(g.instr);
      q.answer.forEach((a) => checkLimit(t, a, lim));
      if (m && !q.answer.some((a) => alnum(m.text).includes(alnum(a)))) err(t, `marker “${m.text}” does not contain the answer “${q.answer[0]}”`);
    }
    checkQuotes(t, q.why, transcript[partId], false);
  });
}

function checkReading(key, R) {
  if (!R || R.passages.length !== 3) return err(`Exam ${key} R`, "reading needs 3 passages");
  const all = [];
  R.passages.forEach((p, pi) => {
    const text = p.paras.join(" ");
    const wc = words(text).length;
    console.log(`  Passage ${pi + 1} “${p.title}”: ${wc} words${p.credit ? "" : "  (no source credit)"}`);
    if (wc < 700 || wc > 900) err(`Exam ${key} P${pi + 1}`, `passage has ${wc} words (need 700–900)`);
    const low = " " + plain(text).toLowerCase().replace(/[^a-z0-9'%.\- ]/g, " ").replace(/\s+/g, " ") + " ";
    p.groups.forEach((g) => g.questions.forEach((q) => {
      all.push(q);
      const t = `Exam ${key} R${Array.isArray(q.n) ? q.n.join("&") : q.n}`;
      if (!q.why) err(t, "no explanation");
      checkOptions(t, q, g);
      checkQuotes(t, q.why, text, true);
      if (q.type === "gap") {
        const lim = limitOf(g.instr);
        q.answer.forEach((a) => checkLimit(t, a, lim));
        const a0 = plain(q.answer[0]).toLowerCase().replace(/[^a-z0-9'%.\- ]/g, " ").replace(/\s+/g, " ").trim();
        if (!low.includes(" " + a0 + " ")) err(t, `answer “${q.answer[0]}” does not appear word for word in passage ${pi + 1}`);
      }
      if (q.type === "select" && p.lettered && !g.box && /^[A-Z]$/.test(q.answer) && "ABCDEFGHIJ".indexOf(q.answer) >= p.paras.length) err(t, `paragraph ${q.answer} does not exist`);
    }));
    // headings: each heading used at most once
    p.groups.filter((g) => g.box && /^[ivx]+$/.test(g.box.items[0][0])).forEach((g) => {
      const used = g.questions.map((q) => q.answer);
      if (new Set(used).size !== used.length) err(`Exam ${key} P${pi + 1}`, "a heading is used twice");
      if (g.box.items.length <= used.length) err(`Exam ${key} P${pi + 1}`, "headings list needs more headings than paragraphs");
    });
  });
  checkNumbering(`Exam ${key} R`, all);
  ["tf", "yn"].forEach((mode) => {
    const set = all.filter((q) => q.type === "tfng" && (q.mode || "tf") === mode);
    if (!set.length) return;
    const vals = new Set(set.map((q) => q.answer));
    if (vals.size < 3) warn(`Exam ${key} R`, `${mode.toUpperCase()} questions use only ${[...vals].join("/")}`);
  });
}

const keys = Object.keys(TESTS).filter((k) => /^x\d+$/.test(k)).filter((k) => !want.length || want.includes(+k.slice(1))).sort();
if (!keys.length) { console.log("No exam tests found."); process.exit(1); }
keys.forEach((k) => {
  const T = TESTS[k];
  console.log(`\nExam Test ${k.slice(1)}`);
  if (T.listening) checkListening(k.slice(1), T.listening); else warn(`Exam ${k.slice(1)}`, "no listening yet");
  if (T.reading) checkReading(k.slice(1), T.reading); else warn(`Exam ${k.slice(1)}`, "no reading yet");
  if (!T.writing || !T.writing.task1 || !T.writing.task2) warn(`Exam ${k.slice(1)}`, "writing incomplete");
  if (!T.speaking || !T.speaking.part2) warn(`Exam ${k.slice(1)}`, "speaking incomplete");
});
console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
