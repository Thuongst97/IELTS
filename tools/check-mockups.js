#!/usr/bin/env node
/* =========================================================================
   Checker for the Writing Mockups.
   Task 1: every number in a model answer must come from its chart, either
           as a data value, a unit conversion (12 → 12,000) or a difference
           between two values (percentage points). Models must be 150+ words.
   Task 2: models must be 250+ words and have all fields.
   Usage: node tools/check-mockups.js
   ========================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const DATA = path.join(__dirname, "..", "ielts-academy", "assets", "js", "data");
const ctx = { window: {} };
vm.createContext(ctx);
["mockups-t1.js", "mockups-t2.js"].forEach((f) => { if (fs.existsSync(path.join(DATA, f))) vm.runInContext(fs.readFileSync(path.join(DATA, f), "utf8"), ctx); });
const T1 = ctx.window.MOCKUPS_T1 || [], T2 = ctx.window.MOCKUPS_T2 || [];
let errors = 0, warnings = 0;
const err = (t, m) => { errors++; console.log(`  ✗ ${t}: ${m}`); };
const warn = (t, m) => { warnings++; console.log(`  ! ${t}: ${m}`); };
const words = (s) => s.trim().split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const numsIn = (s) => (String(s).match(/\d[\d,]*(?:\.\d+)?/g) || []).map((n) => +n.replace(/,/g, ""));

function chartNumbers(c) {
  const vals = [], extra = [];
  const charts = Array.isArray(c) ? c : [c];
  charts.forEach((ch) => {
    if (ch.x) ch.x.forEach((x) => extra.push(...numsIn(x)));
    if (ch.series) ch.series.forEach(([name, v]) => { vals.push(...v); extra.push(...numsIn(name)); });
    if (ch.pies) ch.pies.forEach((p) => { extra.push(...numsIn(p.label)); p.slices.forEach(([n, v]) => { vals.push(v); extra.push(...numsIn(n)); }); });
    if (ch.rows) ch.rows.forEach((r) => r.forEach((cell, i) => (i === 0 ? extra.push(...numsIn(cell)) : vals.push(...numsIn(cell)))));
    if (ch.head) ch.head.forEach((h) => extra.push(...numsIn(h)));
    if (ch.steps) ch.steps.forEach((s) => extra.push(...numsIn(s)));
    if (ch.maps) ch.maps.forEach((m) => extra.push(...numsIn(m.label)));
    extra.push(...numsIn(ch.title || ""));
  });
  const ok = new Set([...vals, ...extra]);
  vals.forEach((v) => { ok.add(v * 1000); ok.add(Math.round(v * 1000)); });
  for (let i = 0; i < vals.length; i++) for (let j = 0; j < vals.length; j++) ok.add(Math.round(Math.abs(vals[i] - vals[j]) * 10) / 10);
  return ok;
}

console.log(`Task 1 mockups: ${T1.length}`);
const ids = new Set();
T1.forEach((m) => {
  const t = m.id;
  if (ids.has(t)) err(t, "duplicate id"); ids.add(t);
  ["topic", "visual", "title", "prompt", "chart", "model", "notes", "language"].forEach((k) => { if (!m[k]) err(t, `missing ${k}`); });
  const text = m.model.join(" ");
  const wc = words(text);
  if (wc < 150) err(t, `model has ${wc} words (need 150+)`);
  if (wc > 230) warn(t, `model has ${wc} words (long for Task 1)`);
  if (!/^Overall/.test(m.model[1] || "")) err(t, "second paragraph should be the overview (starting “Overall”)");
  const ok = chartNumbers(m.chart);
  const prompt = new Set(numsIn(m.prompt));
  numsIn(text).forEach((n) => { if (!ok.has(n) && !prompt.has(n)) err(t, `number ${n} in the model is not in the chart`); });
  console.log(`  ${t} · ${m.topic} · ${m.visual} · ${wc} words`);
});
console.log(`\nTask 2 mockups: ${T2.length}`);
T2.forEach((m) => {
  const t = m.id;
  if (ids.has(t)) err(t, "duplicate id"); ids.add(t);
  ["topic", "type", "question", "position", "model", "notes", "language"].forEach((k) => { if (!m[k]) err(t, `missing ${k}`); });
  const wc = words((m.model || []).join(" "));
  if (wc < 250) err(t, `model has ${wc} words (need 250+)`);
  if (wc > 340) warn(t, `model has ${wc} words (long for Task 2)`);
  console.log(`  ${t} · ${m.topic} · ${m.type} · ${wc} words`);
});
const topics = (arr) => arr.reduce((o, m) => ((o[m.topic] = (o[m.topic] || 0) + 1), o), {});
console.log("\nTask 1 topics:", JSON.stringify(topics(T1)));
console.log("Task 2 topics:", JSON.stringify(topics(T2)));
console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
