/* Home page: module grid and band-profile dashboard. */
(function () {
  "use strict";
  const { SITE, $, esc, store, getResults, overallBand, fmtBand } = window.IELTS;

  const res = getResults();
  const scoreFor = { listening: "listening:full", reading: "reading:full" };
  $("#module-grid").innerHTML = SITE.map((p) => {
    const r = res[scoreFor[p.id]];
    return `<a class="module-card glass" href="${p.file}" style="--accent:${p.accent}">
      <div class="mc-top"><div class="mc-icon">${p.icon}</div><span class="badge gray mono">${p.num}</span></div>
      ${r ? `<span class="badge green mc-score">best ${r.best}/40</span>` : ""}
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <div class="mc-tags">${p.sections.slice(0, 3).map((s) => `<span class="chip">${esc(s[1])}</span>`).join("")}</div>
      <span class="mc-go">Open module →</span>
    </a>`;
  }).join("");

  // Band profile: practice results first, otherwise the self-diagnosis from the plan page.
  const dg = store.get("diagnose", null);
  const SK = [["l", "Listening", "#70cff8"], ["r", "Reading", "#34d399"], ["w", "Writing", "#d4af37"], ["s", "Speaking", "#a78bfa"]];
  const val = {
    l: res["listening:full"] ? res["listening:full"].band : dg ? dg.l : null,
    r: res["reading:full"] ? res["reading:full"].band : dg ? dg.r : null,
    w: dg ? dg.w : null,
    s: dg ? dg.s : null,
  };
  const pct = (b) => (b == null ? 0 : Math.max(0, Math.min(100, ((b - 4) / 5) * 100)));
  $("#bars").innerHTML = SK.map(([k, n, c]) => `<div class="skill-bar" style="--sc:${c}"><b>${n}</b>
    <div class="sb-track"><div class="sb-fill" style="width:${pct(val[k])}%"></div><div class="sb-target" style="left:${pct(7)}%"></div></div>
    <span class="sb-val">${fmtBand(val[k])}</span></div>`).join("");
  const all = SK.map(([k]) => val[k]);
  const o = all.every((x) => x != null) ? overallBand(all) : null;
  $("#overall").textContent = o ? fmtBand(o.band) : "–";
  const pctPlan = store.get("roadmap-pct", 0);
  $("#board-note").innerHTML = all.some((x) => x == null)
    ? `No data yet for some skills. Take the <a href="listening.html#practice">Listening</a> and <a href="reading.html#practice">Reading</a> tests and set your estimates in <a href="plan.html#diagnose">Diagnose your gap</a>.`
    : `Study plan: <b>${pctPlan}%</b> complete. ${o.band >= 7 ? "You're on target — keep a safety margin." : "Focus on the lowest bar first."}`;
})();
