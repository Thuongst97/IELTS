/* Writing Mockups: browse 20 Task 1 and 20 Task 2 model answers by topic. */
(function () {
  "use strict";
  const { $, $$, esc, store, Timer } = window.IELTS;
  const SETS = {
    t1: { items: window.MOCKUPS_T1 || [], name: "Task 1", kind: "visual", kinds: "Visual", min: 150, minutes: 20 },
    t2: { items: window.MOCKUPS_T2 || [], name: "Task 2", kind: "type", kinds: "Essay type", min: 250, minutes: 40 },
  };
  const words = (s) => (String(s).trim().match(/\S+/g) || []).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  const st = store.get("mockups", { set: "t1", topic: "", kind: "", id: "", hide: false });

  /* ---------------------------------------------- Maps (Task 1) */
  function mapSvg(m) {
    const cls = { road: "mk-road", water: "mk-water", park: "mk-park", building: "mk-building", square: "mk-square", car: "mk-car", empty: "mk-empty" };
    const items = m.items.map(([k, x, y, w, h, label]) => {
      const vertical = h > w * 1.6 && w < 30;
      // Water labels sit at the left so that bridges drawn across a river don't cover them.
      const left = k === "water";
      const tx = left ? x + 10 : x + w / 2, ty = y + h / 2 + 3.5;
      const text = label ? `<text class="mk-maplabel" x="${tx}" y="${ty}" text-anchor="${left ? "start" : "middle"}"${vertical ? ` transform="rotate(-90 ${tx} ${ty - 3.5})"` : ""}>${esc(label)}</text>` : "";
      return `<rect class="${cls[k] || "mk-building"}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${k === "road" || k === "water" ? 0 : 4}"/>${text}`;
    }).join("");
    return `<figure class="mk-map"><svg viewBox="0 0 300 220" role="img" aria-label="Map: ${esc(m.label)}"><rect class="mk-ground" x="0" y="0" width="300" height="220"/>${items}</svg><figcaption>${esc(m.label)}</figcaption></figure>`;
  }
  function chartHtml(c) {
    const one = (ch) => (ch.type === "map" ? `<div class="chart-wrap"><h5>${esc(ch.title)} <span class="muted small">(north is at the top)</span></h5><div class="mk-maps">${ch.maps.map(mapSvg).join("")}</div></div>` : window.IELTS.Charts.render(ch));
    return (Array.isArray(c) ? c : [c]).map(one).join("");
  }

  /* ---------------------------------------------- Lists */
  const host = $("#mk-app");
  host.innerHTML = `
    <div class="mk-set" role="group" aria-label="Task">
      <button type="button" data-set="t1"><b>📊 Task 1 · Academic reports</b><small>${SETS.t1.items.length} charts, tables, processes and maps</small></button>
      <button type="button" data-set="t2"><b>📝 Task 2 · Essays</b><small>${SETS.t2.items.length} essays across every essay type</small></button>
    </div>
    <div class="mk-layout">
      <aside class="mk-side glass">
        <div class="mk-h">Topics</div>
        <div class="mk-topics"></div>
        <div class="mk-h mk-kind-h"></div>
        <div class="mk-kinds"></div>
        <div class="mk-h">Questions</div>
        <div class="mk-list"></div>
      </aside>
      <article class="mk-reader"></article>
    </div>`;
  const q = (s) => $(s, host);
  const set = () => SETS[st.set];
  const filtered = () => set().items.filter((m) => (!st.topic || m.topic === st.topic) && (!st.kind || m[set().kind] === st.kind));
  const countBy = (key, list) => list.reduce((o, m) => ((o[m[key]] = (o[m[key]] || 0) + 1), o), {});

  function paintLists() {
    $$(".mk-set button", host).forEach((b) => b.classList.toggle("sel", b.dataset.set === st.set));
    const S = set();
    const topics = countBy("topic", S.items);
    q(".mk-topics").innerHTML = [["", `All topics`, S.items.length], ...Object.entries(topics).map(([t, n]) => [t, t, n])]
      .map(([v, l, n]) => `<button type="button" class="mk-topic ${st.topic === v ? "sel" : ""}" data-topic="${esc(v)}"><span>${esc(l)}</span><b>${n}</b></button>`).join("");
    q(".mk-kind-h").textContent = S.kinds;
    const kinds = countBy(S.kind, S.items.filter((m) => !st.topic || m.topic === st.topic));
    q(".mk-kinds").innerHTML = [["", "All"], ...Object.keys(kinds).map((k) => [k, k])]
      .map(([v, l]) => `<button type="button" class="chip mk-kind ${st.kind === v ? "sel" : ""}" data-kind="${esc(v)}">${esc(l)}${v ? ` · ${kinds[v]}` : ""}</button>`).join("");
    const list = filtered();
    q(".mk-list").innerHTML = list.length ? list.map((m) => `<button type="button" class="mk-item ${m.id === st.id ? "sel" : ""}" data-id="${m.id}">
        <span class="mk-item-t">${esc(m.title || m.question.split(/[.?]/)[0])}</span>
        <span class="mk-item-m">${esc(m.topic)} · ${esc(m[S.kind])}</span></button>`).join("")
      : `<p class="small muted">No questions match these filters.</p>`;
  }

  /* ---------------------------------------------- Reader */
  let timer = null;
  function paintReader() {
    const S = set();
    const list = filtered();
    let m = S.items.find((x) => x.id === st.id);
    if (!m || !list.includes(m)) { m = list[0]; st.id = m ? m.id : ""; }
    const r = q(".mk-reader");
    if (timer) { timer.pause(); timer = null; }
    if (!m) { r.innerHTML = ""; return; }
    const i = list.indexOf(m);
    const text = m.model.join(" ");
    const draftKey = "mockup-draft:" + m.id;
    r.innerHTML = `
      <div class="mk-r-head">
        <div><div class="eyebrow">${S.name} · ${esc(m.topic)} · ${esc(m[S.kind])}</div><h3>${esc(m.title || (S.name + " · " + m.type))}</h3></div>
        <div class="mk-nav"><button class="btn sm ghost" type="button" data-step="-1" ${i <= 0 ? "disabled" : ""}>← Previous</button><span class="small muted">${i + 1} / ${list.length}</span><button class="btn sm ghost" type="button" data-step="1" ${i >= list.length - 1 ? "disabled" : ""}>Next →</button></div>
      </div>
      <div class="studio-prompt"><b>${S.name} · about ${S.minutes} minutes.</b> ${esc(m.prompt || m.question)} ${st.set === "t1" ? "Write at least 150 words." : "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words."}</div>
      ${m.chart ? chartHtml(m.chart) : ""}
      <details class="acc mk-try" ${st.hide ? "open" : ""}><summary>✍️ Try it yourself first (${S.minutes}-minute timer)</summary><div class="acc-body">
        <div class="row"><span class="mk-timer"></span><span class="small muted">Words: <b class="mk-wc">0</b> / ${S.min}</span><label class="small"><input type="checkbox" class="mk-hide" ${st.hide ? "checked" : ""}> Hide the model answer until I've finished</label></div>
        <textarea class="inp mk-draft" rows="10" spellcheck="false" placeholder="Write your answer here. It's saved in this browser.">${esc(store.get(draftKey, ""))}</textarea>
      </div></details>
      <div class="mk-model-wrap" ${st.hide ? "hidden" : ""}>
        <div class="model-head"><span class="badge amber">Band 8 model · ${words(text)} words</span>${m.position ? `<span class="small muted">Position: ${esc(m.position)}</span>` : ""}</div>
        <div class="model">${m.model.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        <div class="grid grid-2 mt">
          <div class="glass card"><h4 style="margin-top:0">🔎 Why it scores highly</h4><ul class="small">${m.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>
          <div class="glass card"><h4 style="margin-top:0">🧰 Language to reuse</h4><div class="chip-list">${m.language.map((l) => `<span class="chip">${esc(l)}</span>`).join("")}</div><p class="small muted" style="margin:10px 0 0">Reuse the structure and collocations, not whole sentences: examiners discount memorised text.</p></div>
        </div>
      </div>
      <button class="btn sm mk-show" type="button" ${st.hide ? "" : "hidden"}>👁 Show the model answer</button>`;
    const ta = $(".mk-draft", r), wc = $(".mk-wc", r);
    timer = new Timer($(".mk-timer", r), { minutes: S.minutes, label: "Time", warnAt: S.minutes === 20 ? 180 : 300 });
    const count = () => { wc.textContent = words(ta.value); };
    count();
    ta.addEventListener("input", () => {
      count(); store.set(draftKey, ta.value);
      if (!timer.running && !timer.ended && timer.left === timer.total) timer.start();
    });
    $(".mk-hide", r).addEventListener("change", (e) => { st.hide = e.target.checked; save(); paintReader(); });
    $(".mk-show", r).addEventListener("click", () => {
      $(".mk-model-wrap", r).hidden = false; $(".mk-show", r).hidden = true;
      if (timer.running) timer.pause();
    });
    $$("[data-step]", r).forEach((b) => b.addEventListener("click", () => {
      const nx = list[i + +b.dataset.step]; if (!nx) return;
      st.id = nx.id; save(); paintLists(); paintReader();
      $("#browse").scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  }
  function save() {
    store.set("mockups", st);
    if (st.id) history.replaceState(null, "", "#" + st.id);
  }
  function paint() { paintLists(); paintReader(); save(); }

  host.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b || !q(".mk-side").contains(b) && !b.closest(".mk-set")) return;
    if (b.dataset.set) { if (b.dataset.set !== st.set) { st.set = b.dataset.set; st.topic = ""; st.kind = ""; st.id = ""; } }
    else if (b.dataset.topic != null && b.classList.contains("mk-topic")) { st.topic = b.dataset.topic; st.kind = ""; st.id = ""; }
    else if (b.dataset.kind != null && b.classList.contains("mk-kind")) { st.kind = b.dataset.kind; st.id = ""; }
    else if (b.dataset.id) {
      st.id = b.dataset.id;
      if (window.matchMedia("(max-width: 900px)").matches) setTimeout(() => q(".mk-reader").scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
    paint();
  });
  function route() {
    const id = location.hash.slice(1);
    const s = /^t1-/.test(id) ? "t1" : /^t2-/.test(id) ? "t2" : null;
    if (!s || !SETS[s].items.some((m) => m.id === id)) return false;
    st.set = s; st.id = id; st.topic = ""; st.kind = "";
    return true;
  }
  window.addEventListener("hashchange", () => { if (route()) paint(); });
  route();
  paint();
})();
