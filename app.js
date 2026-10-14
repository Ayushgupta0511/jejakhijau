/* JejakHijau — app.js
   State, storage, CO2 math, rendering, canvas + SVG, and events.
   Depends on data.js (window.JH_DATA). No frameworks, no build step. */

(function () {
  "use strict";

  const D = window.JH_DATA;
  const { TRANSPORT, FOOD, ENERGY, AVG_TARGET_KG, BADGES, CHALLENGE_LENGTH, DEMO_LOGS, SWAPS, I18N } = D;

  const STORAGE_KEY = "jejakhijau.v1";
  const RING_CIRC = 2 * Math.PI * 52;
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- State ---------------- */

  const state = {
    logs: {},          // { "yyyy-mm-dd": DayRecord }
    theme: "dark",
    lang: "en",
    challenge: { startedAt: null, completedAt: null },
    editingDate: null, // date string when editing an existing day
    current: { transport: null, food: null, aircondHours: 3, laptopHours: 4 }
  };

  /* ---------------- Utilities ---------------- */

  const $ = (id) => document.getElementById(id);

  function pad(n) { return String(n).padStart(2, "0"); }

  function isoDate(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function todayISO() { return isoDate(new Date()); }

  function addDays(date, n) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + n);
    return d;
  }

  function t(key) {
    const lang = I18N[state.lang] || I18N.en;
    return lang[key] || I18N.en[key] || key;
  }

  function fmt(n) { return Number(n).toFixed(2); }

  function prettyDate(isoStr) {
    const parts = isoStr.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const opts = { weekday: "short", day: "numeric", month: "short" };
    try { return d.toLocaleDateString(state.lang === "bm" ? "ms-MY" : "en-GB", opts); }
    catch (e) { return isoStr; }
  }

  /* ---------------- CO2 math ---------------- */

  function computeTotalKg(c) {
    const tr = (c && TRANSPORT[c.transport]) ? TRANSPORT[c.transport].kg : 0;
    const fd = (c && FOOD[c.food]) ? FOOD[c.food].kg : 0;
    const ac = (c ? c.aircondHours : 0) * ENERGY.aircondKgPerHour;
    const lp = (c ? c.laptopHours : 0) * ENERGY.laptopKgPerHour;
    return tr + fd + ac + lp;
  }

  function last7() {
    const out = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) out.push(isoDate(addDays(now, -i)));
    return out;
  }

  function weekTotal() {
    let sum = 0;
    for (const d of last7()) if (state.logs[d]) sum += state.logs[d].totalKg;
    return sum;
  }

  function daysLogged() { return Object.keys(state.logs).length; }

  function currentStreak() {
    let streak = 0;
    const now = new Date();
    // A streak counts consecutive logged days ending today or yesterday.
    let cursor = state.logs[isoDate(now)] ? now : addDays(now, -1);
    for (let i = 0; i < 400; i++) {
      if (state.logs[isoDate(cursor)]) { streak++; cursor = addDays(cursor, -1); }
      else break;
    }
    return streak;
  }

  function bestDayKg() {
    let best = Infinity;
    for (const k in state.logs) {
      const v = state.logs[k].totalKg;
      if (v < best) best = v;
    }
    return best === Infinity ? 0 : best;
  }

  function stats() {
    return {
      daysLogged: daysLogged(),
      weekTotalKg: weekTotal(),
      streak: currentStreak(),
      bestDayKg: bestDayKg()
    };
  }

  /* ---------------- Storage ---------------- */

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && typeof data === "object") {
        if (data.logs && typeof data.logs === "object") state.logs = data.logs;
        if (data.theme === "light" || data.theme === "dark") state.theme = data.theme;
        if (data.lang === "en" || data.lang === "bm") state.lang = data.lang;
        if (data.challenge && typeof data.challenge === "object") state.challenge = data.challenge;
      }
    } catch (e) {
      // Storage unavailable or corrupt — continue with defaults.
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        logs: state.logs,
        theme: state.theme,
        lang: state.lang,
        challenge: state.challenge
      }));
    } catch (e) {
      // Ignore write failures (private mode / quota).
    }
  }

  /* ---------------- Rendering: tap cards ---------------- */

  function buildTapGroup(container, items, field, groupLabel) {
    container.innerHTML = "";
    Object.keys(items).forEach((key) => {
      const it = items[key];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tap-card";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", state.current[field] === key ? "true" : "false");
      btn.setAttribute("aria-label", it.en + " — " + fmt(it.kg) + " kg CO2e");
      btn.dataset.key = key;
      btn.innerHTML =
        '<span class="tap-icon" aria-hidden="true">' + it.icon + "</span>" +
        '<span class="tap-name">' + (it[state.lang] || it.en) + "</span>" +
        '<span class="tap-kg">' + fmt(it.kg) + " kg</span>";
      btn.addEventListener("click", () => {
        state.current[field] = key;
        buildTapGroup(container, items, field, groupLabel);
        updateEstimate();
      });
      container.appendChild(btn);
    });
  }

  function renderLogger() {
    buildTapGroup($("transportGrid"), TRANSPORT, "transport", "transport");
    buildTapGroup($("foodGrid"), FOOD, "food", "food");
    $("aircondSlider").value = state.current.aircondHours;
    $("laptopSlider").value = state.current.laptopHours;
    $("aircondOut").innerHTML = state.current.aircondHours + ' <span data-i18n="hours">' + t("hours") + "</span>";
    $("laptopOut").innerHTML = state.current.laptopHours + ' <span data-i18n="hours">' + t("hours") + "</span>";
    updateEstimate();
  }

  function updateEstimate() {
    const kg = computeTotalKg(state.current);
    $("liveEstimate").innerHTML = fmt(kg) + ' <span data-i18n="kg">' + t("kg") + "</span>";
  }

  /* ---------------- Rendering: dashboard ---------------- */

  function renderDashboard() {
    const today = todayISO();
    const todayRec = state.logs[today];
    $("statToday").textContent = todayRec ? fmt(todayRec.totalKg) + " kg" : "—";
    $("statWeek").textContent = fmt(weekTotal()) + " kg";
    $("statStreak").textContent = String(currentStreak());
    $("avgValue").textContent = fmt(AVG_TARGET_KG);

    const box = $("vsBox");
    const chip = $("vsChip");
    const text = $("vsText");
    const count = daysLogged();

    if (count === 0) { box.hidden = true; return; }

    box.hidden = false;
    const perDay = weekTotal() / Math.max(1, Math.min(7, count));
    const diff = perDay - AVG_TARGET_KG;

    if (diff < -0.3) {
      chip.className = "chip good";
      chip.textContent = fmt(Math.abs(diff)) + " kg ↓";
      text.textContent = t("vsLower");
    } else if (diff > 0.3) {
      chip.className = "chip bad";
      chip.textContent = "+" + fmt(diff) + " kg ↑";
      text.textContent = t("vsHigher");
    } else {
      chip.className = "chip neutral";
      chip.textContent = "≈ average";
      text.textContent = t("avgLabel");
    }
  }

  /* ---------------- Rendering: saved days ---------------- */

  function renderSaved() {
    const list = $("savedList");
    const keys = Object.keys(state.logs).sort().reverse();
    list.innerHTML = "";
    $("emptyState").hidden = keys.length !== 0;

    keys.forEach((date) => {
      const rec = state.logs[date];
      const tr = TRANSPORT[rec.transport] || { icon: "?", en: "—", kg: 0 };
      const fd = FOOD[rec.food] || { icon: "?", en: "—", kg: 0 };

      const card = document.createElement("div");
      card.className = "day-card";

      const main = document.createElement("div");
      main.className = "day-main";
      main.innerHTML =
        '<div class="day-date">' + (date === todayISO() ? t("today") + " · " : "") + prettyDate(date) + "</div>" +
        '<div class="day-chips">' +
          '<span class="chip neutral">' + tr.icon + " " + (tr[state.lang] || tr.en) + "</span>" +
          '<span class="chip neutral">' + fd.icon + " " + (fd[state.lang] || fd.en) + "</span>" +
          '<span class="chip neutral">❄️ ' + rec.aircondHours + t("hours") + "</span>" +
          '<span class="chip neutral">💻 ' + rec.laptopHours + t("hours") + "</span>" +
        "</div>";

      const total = document.createElement("div");
      total.className = "day-total";
      total.textContent = fmt(rec.totalKg) + " kg";

      const actions = document.createElement("div");
      actions.className = "day-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "icon-btn";
      editBtn.textContent = t("edit");
      editBtn.addEventListener("click", () => startEdit(date));

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "icon-btn danger";
      delBtn.textContent = t("delete");
      delBtn.addEventListener("click", () => deleteDay(date));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      card.appendChild(main);
      card.appendChild(total);
      card.appendChild(actions);
      list.appendChild(card);
    });
  }

  /* ---------------- Actions ---------------- */

  function saveDay() {
    if (!state.current.transport || !state.current.food) {
      toast(state.lang === "bm" ? "Pilih pengangkutan dan makanan dahulu." : "Pick a transport and a food first.");
      return;
    }
    const date = state.editingDate || todayISO();
    state.logs[date] = {
      date: date,
      transport: state.current.transport,
      food: state.current.food,
      aircondHours: state.current.aircondHours,
      laptopHours: state.current.laptopHours,
      totalKg: computeTotalKg(state.current)
    };
    const wasEditing = !!state.editingDate;
    state.editingDate = null;
    $("editingBanner").hidden = true;
    $("saveBtn").textContent = t("saveBtn");
    save();
    renderAll();
    toast(wasEditing ? t("dayUpdated") : t("daySaved"));
  }

  function startEdit(date) {
    const rec = state.logs[date];
    if (!rec) return;
    state.editingDate = date;
    state.current = {
      transport: rec.transport,
      food: rec.food,
      aircondHours: rec.aircondHours,
      laptopHours: rec.laptopHours
    };
    renderLogger();
    $("editingBanner").hidden = false;
    $("saveBtn").textContent = t("updateBtn");
    document.getElementById("logger").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  function cancelEdit() {
    state.editingDate = null;
    $("editingBanner").hidden = true;
    $("saveBtn").textContent = t("saveBtn");
    state.current = { transport: null, food: null, aircondHours: 3, laptopHours: 4 };
    renderLogger();
  }

  function deleteDay(date) {
    if (!state.logs[date]) return;
    delete state.logs[date];
    if (state.editingDate === date) cancelEdit();
    save();
    renderAll();
    toast(t("dayDeleted"));
  }

  function loadDemo() {
    const now = new Date();
    DEMO_LOGS.forEach((entry) => {
      const date = isoDate(addDays(now, -entry.day));
      state.logs[date] = {
        date: date,
        transport: entry.transport,
        food: entry.food,
        aircondHours: entry.aircondHours,
        laptopHours: entry.laptopHours,
        totalKg: computeTotalKg(entry)
      };
    });
    save();
    renderAll();
    toast(t("demoLoaded"));
  }

  function resetAll() {
    if (!window.confirm(t("resetConfirm"))) return;
    state.logs = {};
    state.challenge = { startedAt: null, completedAt: null };
    cancelEdit();
    save();
    renderAll();
    toast(t("dataCleared"));
  }

  /* ---------------- Suggestions ---------------- */

  function renderSuggest() {
    const list = $("suggestList");
    list.innerHTML = "";
    const c = state.current;
    const active = SWAPS.filter((s) => { try { return s.when(c); } catch (e) { return false; } });

    $("suggestEmpty").hidden = active.length !== 0;

    active.slice(0, 3).forEach((s) => {
      const li = document.createElement("li");
      li.className = "suggest-item";
      const saved = (typeof s.saveKg === "function") ? s.saveKg(c) : s.saveKg;
      li.innerHTML =
        '<span class="suggest-icon" aria-hidden="true">💡</span>' +
        '<span class="suggest-text">' + (s[state.lang] || s.en) + " " + t("save") + "</span>" +
        '<span class="suggest-save">' + fmt(Math.max(0, saved)) + " kg</span>";
      list.appendChild(li);
    });
  }

  /* ---------------- Forest (SVG) ---------------- */

  function renderForest() {
    const svg = $("forestSvg");
    const count = daysLogged();
    const wt = weekTotal();
    const caption = $("forestCaption");

    svg.innerHTML = "";

    // Sky gradient
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML =
      '<linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#bff7e4"/>' +
        '<stop offset="100%" stop-color="#e8fff6"/>' +
      "</linearGradient>" +
      '<linearGradient id="skyHaze" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#9aa6a0"/>' +
        '<stop offset="100%" stop-color="#cdd6d0"/>' +
      "</linearGradient>";
    svg.appendChild(defs);

    const NS = "http://www.w3.org/2000/svg";
    function el(name, attrs) {
      const node = document.createElementNS(NS, name);
      for (const k in attrs) node.setAttribute(k, attrs[k]);
      return node;
    }

    if (count === 0) {
      svg.appendChild(el("rect", { x: 0, y: 0, width: 600, height: 260, fill: "#12241f" }));
      const txt = el("text", { x: 300, y: 135, "text-anchor": "middle", fill: "#7fb3a3", "font-size": "16", "font-family": "sans-serif" });
      txt.textContent = t("forestEmpty");
      svg.appendChild(txt);
      caption.textContent = t("forestEmpty");
      caption.className = "forest-caption muted";
      return;
    }

    const perDay = wt / Math.max(1, Math.min(7, count));
    const low = perDay <= AVG_TARGET_KG;          // healthier when at/below average estimate
    const ratio = Math.max(0, Math.min(1.6, perDay / AVG_TARGET_KG)); // 0 = great, >1 = high

    // Background
    svg.appendChild(el("rect", { x: 0, y: 0, width: 600, height: 260, fill: low ? "url(#skyDay)" : "url(#skyHaze)" }));

    // Sun / haze disc
    svg.appendChild(el("circle", { cx: low ? 500 : 300, cy: 60, r: low ? 34 : 46, fill: low ? "#ffe9a8" : "#e3e6e0", opacity: low ? 0.95 : 0.6 }));

    // Ground
    svg.appendChild(el("rect", { x: 0, y: 210, width: 600, height: 50, fill: low ? "#2f6d4f" : "#5c635c" }));

    // Trees: fewer, greener, taller when low-carbon; sparse, grey, droopy when high.
    const treeCount = low ? 9 : Math.max(3, Math.round(9 / ratio));
    const green = low ? "#2fa36b" : "#7d8a7f";
    const trunk = low ? "#6b4a2b" : "#5b5a52";
    const spacing = 600 / (treeCount + 1);

    for (let i = 0; i < treeCount; i++) {
      const x = spacing * (i + 1);
      const h = low ? (70 + (i % 3) * 14) : (40 + (i % 2) * 8);
      const baseY = 210;
      const g = el("g", {});
      // Trunk
      g.appendChild(el("rect", { x: x - 3, y: baseY - h * 0.45, width: 6, height: h * 0.45, fill: trunk, rx: 2 }));
      // Foliage (two stacked triangles)
      const top = baseY - h;
      g.appendChild(el("path", {
        d: "M " + x + " " + top + " L " + (x - h * 0.35) + " " + (baseY - h * 0.35) + " L " + (x + h * 0.35) + " " + (baseY - h * 0.35) + " Z",
        fill: green
      }));
      g.appendChild(el("path", {
        d: "M " + x + " " + (baseY - h * 0.7) + " L " + (x - h * 0.42) + " " + (baseY - h * 0.05) + " L " + (x + h * 0.42) + " " + (baseY - h * 0.05) + " Z",
        fill: green, opacity: 0.92
      }));
      if (!reduceMotion) {
        g.style.transformOrigin = x + "px " + baseY + "px";
        g.style.animation = "sway " + (3 + (i % 4)) + "s ease-in-out " + (i * 0.2) + "s infinite alternate";
      }
      svg.appendChild(g);
    }

    // Birds flying when low-carbon
    if (low && !reduceMotion) {
      for (let b = 0; b < 3; b++) {
        const bird = el("path", {
          d: "M 0 0 q 6 -6 12 0 q 6 -6 12 0",
          stroke: "#0f766e", "stroke-width": 2, fill: "none", opacity: 0.75
        });
        bird.setAttribute("transform", "translate(" + (90 + b * 150) + "," + (60 + b * 26) + ")");
        const anim = el("animateTransform", {
          attributeName: "transform", type: "translate",
          values: (80 + b * 150) + "," + (60 + b * 26) + ";" + (420 + b * 60) + "," + (40 + b * 20) + ";" + (80 + b * 150) + "," + (60 + b * 26),
          dur: (9 + b * 2) + "s", repeatCount: "indefinite"
        });
        const wrap = el("g", {});
        wrap.appendChild(bird);
        wrap.appendChild(anim);
        svg.appendChild(wrap);
      }
    }

    if (low) {
      caption.textContent = t("forestLow");
      caption.className = "forest-caption";
    } else {
      caption.textContent = t("forestHigh");
      caption.className = "forest-caption muted";
    }
  }

  /* ---------------- Weekly chart (canvas) ---------------- */

  function renderChart() {
    const canvas = $("weekChart");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const days = last7();
    const logged = days.filter((d) => state.logs[d]).length;
    $("chartEmpty").hidden = logged !== 0;

    const cssW = canvas.clientWidth || 600;
    const cssH = 240;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#34d399";
    const accent2 = styles.getPropertyValue("--accent-2").trim() || "#2dd4bf";
    const muted = styles.getPropertyValue("--muted").trim() || "#9fc4b8";
    const track = styles.getPropertyValue("--track").trim() || "rgba(255,255,255,.14)";

    const padL = 34, padR = 12, padT = 18, padB = 36;
    const plotW = cssW - padL - padR;
    const plotH = cssH - padT - padB;

    let maxKg = AVG_TARGET_KG;
    days.forEach((d) => { if (state.logs[d]) maxKg = Math.max(maxKg, state.logs[d].totalKg); });
    maxKg = Math.ceil(maxKg) + 1;

    // Grid + average line
    ctx.strokeStyle = track;
    ctx.lineWidth = 1;
    ctx.font = "11px " + (styles.getPropertyValue("--font").trim() || "sans-serif");
    ctx.fillStyle = muted;

    const yFor = (kg) => padT + plotH - (kg / maxKg) * plotH;

    for (let g = 0; g <= 2; g++) {
      const kg = (maxKg / 2) * g;
      const y = yFor(kg);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(cssW - padR, y);
      ctx.stroke();
      ctx.fillText(kg.toFixed(0), 6, y + 4);
    }

    // Average target line
    const yAvg = yFor(AVG_TARGET_KG);
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = muted;
    ctx.beginPath();
    ctx.moveTo(padL, yAvg);
    ctx.lineTo(cssW - padR, yAvg);
    ctx.stroke();
    ctx.restore();

    // Bars
    const n = days.length;
    const slot = plotW / n;
    const barW = Math.min(34, slot * 0.55);

    days.forEach((d, i) => {
      const rec = state.logs[d];
      const x = padL + slot * i + (slot - barW) / 2;
      if (rec) {
        const kg = rec.totalKg;
        const h = (kg / maxKg) * plotH;
        const y = padT + plotH - h;
        const grad = ctx.createLinearGradient(0, y, 0, padT + plotH);
        const good = kg <= AVG_TARGET_KG;
        if (good) { grad.addColorStop(0, accent); grad.addColorStop(1, accent2); }
        else { grad.addColorStop(0, "#fbbf24"); grad.addColorStop(1, "#f59e0b"); }
        ctx.fillStyle = grad;
        roundRect(ctx, x, y, barW, h, 6);
        ctx.fill();

        ctx.fillStyle = muted;
        ctx.textAlign = "center";
        ctx.fillText(kg.toFixed(1), x + barW / 2, y - 5);
      } else {
        ctx.strokeStyle = track;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(x, padT + plotH - 6, barW, 6);
        ctx.setLineDash([]);
      }

      // Day label
      const parts = d.split("-");
      const dd = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const label = dd.toLocaleDateString(state.lang === "bm" ? "ms-MY" : "en-GB", { weekday: "short" });
      ctx.fillStyle = muted;
      ctx.textAlign = "center";
      ctx.fillText(label, x + barW / 2, cssH - 12);
    });
    ctx.textAlign = "left";
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  /* ---------------- Badges ---------------- */

  function renderBadges() {
    const row = $("badgeRow");
    const s = stats();
    row.innerHTML = "";
    BADGES.forEach((b) => {
      let unlocked = false;
      try { unlocked = !!b.test(s); } catch (e) { unlocked = false; }
      const div = document.createElement("div");
      div.className = "badge" + (unlocked ? " unlocked" : "");
      div.setAttribute("aria-label", (b[state.lang] || b.en) + (unlocked ? " (unlocked)" : " (locked)"));
      div.innerHTML =
        '<span class="badge-icon" aria-hidden="true">' + b.icon + "</span>" +
        '<span class="badge-name">' + (b[state.lang] || b.en) + "</span>";
      row.appendChild(div);
    });
  }

  /* ---------------- Challenge ---------------- */

  function challengeProgress() {
    if (!state.challenge.startedAt) return 0;
    // Count logged days since the challenge started, capped at CHALLENGE_LENGTH.
    const start = state.challenge.startedAt;
    let count = 0;
    for (let i = 0; i < CHALLENGE_LENGTH; i++) {
      const d = isoDate(addDays(new Date(start), i));
      if (state.logs[d]) count++;
    }
    return count;
  }

  function renderChallenge() {
    const ring = $("ringProgress");
    const label = $("ringLabel");
    const status = $("challengeStatus");
    const btn = $("challengeBtn");

    const started = !!state.challenge.startedAt;
    const done = !!state.challenge.completedAt;
    const progress = started ? challengeProgress() : 0;

    ring.style.strokeDasharray = RING_CIRC;
    ring.style.strokeDashoffset = RING_CIRC * (1 - progress / CHALLENGE_LENGTH);
    label.textContent = progress + "/" + CHALLENGE_LENGTH;

    if (!started) {
      status.textContent = t("challengeStart");
      btn.textContent = t("challengeStart");
    } else if (done) {
      status.textContent = t("challengeDone");
      btn.textContent = t("challengeReset");
    } else if (progress >= CHALLENGE_LENGTH) {
      state.challenge.completedAt = todayISO();
      save();
      status.textContent = t("challengeDone");
      btn.textContent = t("challengeReset");
      fireConfetti();
    } else {
      status.textContent = t("challengeActive") + " — " + progress + " " + t("challengeProgress");
      btn.textContent = t("challengeReset");
    }
  }

  function toggleChallenge() {
    if (!state.challenge.startedAt || state.challenge.completedAt) {
      state.challenge = { startedAt: todayISO(), completedAt: null };
    } else {
      state.challenge = { startedAt: null, completedAt: null };
    }
    save();
    renderChallenge();
  }

  /* ---------------- Confetti ---------------- */

  let confettiRunning = false;

  function fireConfetti() {
    if (reduceMotion || confettiRunning) return;
    const canvas = $("confettiCanvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ["#34d399", "#2dd4bf", "#fbbf24", "#60a5fa", "#f472b6"];
    const pieces = [];
    for (let i = 0; i < 140; i++) {
      pieces.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.4,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        vy: 2 + Math.random() * 3,
        vx: -1.5 + Math.random() * 3,
        rot: Math.random() * Math.PI,
        vr: -0.15 + Math.random() * 0.3,
        color: colors[(Math.random() * colors.length) | 0]
      });
    }

    confettiRunning = true;
    let frames = 0;

    function frame() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frames++;
      if (frames < 220) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        confettiRunning = false;
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Share my forest (PNG) ---------------- */

  function shareForest() {
    const W = 1000, H = 560;
    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    const ctx = off.getContext("2d");
    if (!ctx) return;

    const count = daysLogged();
    const wt = weekTotal();
    const perDay = wt / Math.max(1, Math.min(7, count || 1));
    const low = count > 0 && perDay <= AVG_TARGET_KG;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    if (low) { bg.addColorStop(0, "#0a1a17"); bg.addColorStop(1, "#0f3d2e"); }
    else { bg.addColorStop(0, "#1a1a1a"); bg.addColorStop(1, "#3a3f3b"); }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = low ? "#2f6d4f" : "#5c635c";
    ctx.fillRect(0, H - 110, W, 110);

    // Trees
    const treeCount = count === 0 ? 1 : (low ? 8 : Math.max(3, Math.round(8 / Math.max(0.6, perDay / AVG_TARGET_KG))));
    const spacing = W / (treeCount + 1);
    for (let i = 0; i < treeCount; i++) {
      const x = spacing * (i + 1);
      const h = low ? 120 + (i % 3) * 20 : 60 + (i % 2) * 12;
      const baseY = H - 110;
      ctx.fillStyle = low ? "#6b4a2b" : "#5b5a52";
      ctx.fillRect(x - 5, baseY - h * 0.45, 10, h * 0.45);
      ctx.fillStyle = low ? "#2fa36b" : "#7d8a7f";
      ctx.beginPath();
      ctx.moveTo(x, baseY - h);
      ctx.lineTo(x - h * 0.35, baseY - h * 0.35);
      ctx.lineTo(x + h * 0.35, baseY - h * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, baseY - h * 0.7);
      ctx.lineTo(x - h * 0.42, baseY - h * 0.05);
      ctx.lineTo(x + h * 0.42, baseY - h * 0.05);
      ctx.closePath();
      ctx.fill();
    }

    // Text
    ctx.fillStyle = "#eafff7";
    ctx.font = "700 46px " + "sans-serif";
    ctx.fillText("JejakHijau", 48, 84);
    ctx.font = "400 24px sans-serif";
    ctx.fillStyle = low ? "#a7f3d0" : "#e5e7eb";
    ctx.fillText(t("shareCaption"), 48, 122);

    ctx.font = "800 40px sans-serif";
    ctx.fillStyle = "#34d399";
    ctx.fillText(fmt(wt) + " kg CO₂e", 48, 178);

    ctx.font = "400 20px sans-serif";
    ctx.fillStyle = "#9fc4b8";
    ctx.fillText(state.lang === "bm" ? "7 hari lepas" : "last 7 days", 48, 210);

    ctx.font = "600 22px sans-serif";
    ctx.fillStyle = low ? "#a7f3d0" : "#e5e7eb";
    ctx.fillText(low ? t("forestLow") : (count === 0 ? t("forestEmpty") : t("forestHigh")), 48, H - 30);

    // Download
    const url = off.toDataURL("image/png");
    const link = $("shareLink");
    link.href = url;
    link.hidden = false;
    link.click();
    toast(state.lang === "bm" ? "Kad hutan dimuat turun." : "Forest card downloaded.");
  }

  /* ---------------- Toast ---------------- */

  let toastTimer = null;
  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---------------- Theme + language ---------------- */

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    const isDark = state.theme === "dark";
    $("themeToggle").setAttribute("aria-pressed", isDark ? "true" : "false");
    $("themeLabel").textContent = t(isDark ? "themeDark" : "themeLight");
    const icon = $("themeToggle").querySelector(".theme-icon");
    if (icon) icon.textContent = isDark ? "🌙" : "☀️";
  }

  function applyLanguage() {
    document.documentElement.setAttribute("lang", state.lang === "bm" ? "ms" : "en");
    $("langToggle").textContent = t("lang");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (I18N[state.lang][key]) el.textContent = I18N[state.lang][key];
    });
    $("saveBtn").textContent = state.editingDate ? t("updateBtn") : t("saveBtn");
  }

  /* ---------------- Master render ---------------- */

  function renderAll() {
    renderLogger();
    renderDashboard();
    renderSaved();
    renderSuggest();
    renderForest();
    renderChart();
    renderBadges();
    renderChallenge();
  }

  /* ---------------- Events ---------------- */

  function bindEvents() {
    $("themeToggle").addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme();
      save();
      renderChart();
    });

    $("langToggle").addEventListener("click", () => {
      state.lang = state.lang === "en" ? "bm" : "en";
      applyLanguage();
      renderAll();
      save();
    });

    $("startBtn").addEventListener("click", () => {
      document.getElementById("logger").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });

    $("aircondSlider").addEventListener("input", (e) => {
      state.current.aircondHours = Number(e.target.value);
      e.target.setAttribute("aria-valuenow", e.target.value);
      $("aircondOut").innerHTML = state.current.aircondHours + ' <span data-i18n="hours">' + t("hours") + "</span>";
      updateEstimate();
      renderSuggest();
    });

    $("laptopSlider").addEventListener("input", (e) => {
      state.current.laptopHours = Number(e.target.value);
      e.target.setAttribute("aria-valuenow", e.target.value);
      $("laptopOut").innerHTML = state.current.laptopHours + ' <span data-i18n="hours">' + t("hours") + "</span>";
      updateEstimate();
    });

    $("saveBtn").addEventListener("click", saveDay);
    $("cancelEditBtn").addEventListener("click", cancelEdit);
    $("demoBtn").addEventListener("click", loadDemo);
    $("resetBtn").addEventListener("click", resetAll);
    $("shareBtn").addEventListener("click", shareForest);
    $("challengeBtn").addEventListener("click", toggleChallenge);

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderChart, 150);
    });
  }

  /* ---------------- Init ---------------- */

  function init() {
    load();
    applyTheme();
    applyLanguage();
    bindEvents();
    renderAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose pure helpers for manual testing in the console.
  window.JH_APP = { computeTotalKg, isoDate, state, stats };
})();