#!/usr/bin/env node
/* =========================================================================
   Checker for the Speaking Mockups.
   Part 1: 4 questions per topic, answers of a natural Part 1 length.
   Part 2: a full cue card, 1-minute notes and a 2-minute long turn.
   Part 3: 3 discussion questions with extended answers.
   Every glossary term and every “language to reuse” phrase must appear in
   that item's answers, and no sentence may be reused across answers.
   Usage: node tools/check-speaking-mockups.js
   ========================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const DATA = path.join(__dirname, "..", "ielts-academy", "assets", "js", "data");
const ctx = { window: {} };
vm.createContext(ctx);
["speaking-mockups-p1.js", "speaking-mockups-p23a.js", "speaking-mockups-p23b.js"].forEach((f) => vm.runInContext(fs.readFileSync(path.join(DATA, f), "utf8"), ctx));
const P1 = ctx.window.SPEAKING_P1 || [], P23 = ctx.window.SPEAKING_P23 || [];
let errors = 0, warnings = 0;
const err = (t, m) => { errors++; console.log(`  ✗ ${t}: ${m}`); };
const warn = (t, m) => { warnings++; console.log(`  ! ${t}: ${m}`); };
const words = (s) => String(s).trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const low = (s) => String(s).toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
const ids = new Set();
const sentences = new Map();

function common(m, text) {
  const t = m.id;
  if (ids.has(t)) err(t, "duplicate id"); ids.add(t);
  ["topic", "title", "notes", "language", "glossary"].forEach((k) => { if (!m[k]) err(t, `missing ${k}`); });
  if (/[‘’]/.test(text)) err(t, "curly apostrophe in an answer (use ')");
  const lt = low(text);
  (m.glossary || []).forEach(([term]) => {
    const parts = term.split(/\s*\(|\)\s*/).map((x) => x.trim()).filter(Boolean);
    if (!parts.some((p) => lt.includes(low(p)))) err(t, `glossary term “${term}” is not in the answers`);
  });
  (m.language || []).forEach((l) => {
    const bits = low(l).replace(/\?$/, "").split(/\s*(?:…|\.\.\.)\s*/).map((x) => x.trim()).filter(Boolean);
    if (!bits.every((b) => lt.includes(b))) err(t, `language “${l}” is not in the answers`);
  });
  text.split(/(?<=[.!?])\s+/).forEach((s) => {
    const k = low(s).replace(/[^a-z ]/g, "").trim();
    if (words(k) < 6) return;
    if (sentences.has(k) && sentences.get(k) !== t) err(t, `sentence also used in ${sentences.get(k)}: “${s}”`);
    sentences.set(k, t);
  });
}

console.log(`Part 1 topics: ${P1.length}`);
P1.forEach((m) => {
  const t = m.id;
  if (!m.qa || m.qa.length !== 4) err(t, "needs 4 questions");
  const wc = m.qa.map(([q, a]) => { if (!/\?$/.test(q)) err(t, `question doesn't end with ?: ${q}`); return words(a); });
  wc.forEach((n, i) => { if (n < 30 || n > 70) err(t, `Q${i + 1} answer has ${n} words (Part 1: 30–70)`); });
  common(m, m.qa.map((x) => x[1]).join(" "));
  console.log(`  ${t} · ${m.topic} · ${m.title} · ${wc.join("/")} words`);
});

console.log(`\nPart 2 & 3 sets: ${P23.length}`);
P23.forEach((m) => {
  const t = m.id;
  if (!m.card || !/^Describe /.test(m.card.prompt) || (m.card.bullets || []).length !== 3 || !/^and explain /.test(m.card.last || "")) err(t, "cue card needs a Describe… prompt, 3 bullets and an “and explain…” line");
  if (!m.kind) err(t, "missing kind");
  if (!m.plan || m.plan.length < 4) err(t, "1-minute notes need at least 4 lines");
  const wc = words(m.model.join(" "));
  if (wc < 230 || wc > 330) err(t, `Part 2 model has ${wc} words (need 230–330)`);
  else if (wc > 315) warn(t, `Part 2 model has ${wc} words (long for 2 minutes)`);
  const qa = (m.p3 && m.p3.qa) || [];
  if (!m.p3 || !m.p3.theme || qa.length !== 3) err(t, "Part 3 needs a theme and 3 questions");
  const p3wc = qa.map(([q, a]) => { if (!/\?$/.test(q)) err(t, `question doesn't end with ?: ${q}`); return words(a); });
  p3wc.forEach((n, i) => { if (n < 70 || n > 130) err(t, `Part 3 Q${i + 1} answer has ${n} words (need 70–130)`); });
  common(m, m.model.join(" ") + " " + qa.map((x) => x[1]).join(" "));
  console.log(`  ${t} · ${m.kind} · ${m.topic} · Part 2 ${wc} words · Part 3 ${p3wc.join("/")}`);
});
const by = (arr, k) => arr.reduce((o, m) => ((o[m[k]] = (o[m[k]] || 0) + 1), o), {});
console.log("\nPart 1 topics:", JSON.stringify(by(P1, "topic")));
console.log("Part 2 kinds:", JSON.stringify(by(P23, "kind")));
console.log("Part 2 topics:", JSON.stringify(by(P23, "topic")));
console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
