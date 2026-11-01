/* stand-up · lógica de la web (sin dependencias) */
(function () {
  "use strict";

  /* ═════════════ Datos ═════════════ */
  const LEVELS = [
    { id: "A1", name: "Inicial" },
    { id: "A2", name: "Básico" },
    { id: "B1", name: "Intermedio" },
    { id: "B2", name: "Intermedio alto" },
    { id: "C1", name: "Avanzado" }
  ];

  const CATS = [
    { id: "daily",     name: "Día a día",      icon: "☕" },
    { id: "meetings",  name: "Reuniones",      icon: "🗓️" },
    { id: "interview", name: "Entrevistas",    icon: "🤝" },
    { id: "email",     name: "Correos y chat", icon: "✉️" },
    { id: "tech",      name: "Técnico",        icon: "🛠️" },
    { id: "idioms",    name: "Expresiones",    icon: "💬" }
  ];
  const catById = Object.fromEntries(CATS.map(c => [c.id, c]));

  const RANKS = [
    { xp: 0,    name: "Intern",    icon: "🐣" },
    { xp: 100,  name: "Junior",    icon: "🌱" },
    { xp: 300,  name: "Mid",       icon: "⚙️" },
    { xp: 700,  name: "Senior",    icon: "🧠" },
    { xp: 1500, name: "Staff",     icon: "🛰️" },
    { xp: 3000, name: "Principal", icon: "🧙" },
    { xp: 6000, name: "CTO",       icon: "👑" }
  ];

  const ACHIEVEMENTS = [
    { id: "hello",    icon: "👋", name: "Hello, World!",        desc: "Consigue tu primera XP." },
    { id: "standup",  icon: "🧍", name: "No blockers",          desc: "Completa el daily stand-up." },
    { id: "oncall",   icon: "🚨", name: "On-call hero",         desc: "Sobrevive a la incidencia P1." },
    { id: "social",   icon: "🌐", name: "Full-stack social",    desc: "Completa todas las conversaciones." },
    { id: "regex",    icon: "🧩", name: "Regex master",         desc: "Acierta 10 huecos." },
    { id: "merge",    icon: "🔀", name: "Merge sin conflictos", desc: "Sabe 25 frases." },
    { id: "c1",       icon: "🚀", name: "Deploy a C1",          desc: "Marca como sabida una frase C1." },
    { id: "goal",     icon: "🏁", name: "Sprint completado",    desc: "Cumple tu meta diaria." },
    { id: "uptime3",  icon: "🔥", name: "99.9% uptime",         desc: "Practica 3 días seguidos." },
    { id: "uptime7",  icon: "💎", name: "Five nines",           desc: "Practica 7 días seguidos." },
    { id: "podcast",  icon: "🎧", name: "Podcast mode",         desc: "Escucha 50 frases." },
    { id: "owl",      icon: "🦉", name: "Night owl",            desc: "Practica después de las 23:00." },
    { id: "power",    icon: "⌨️", name: "Power user",           desc: "Usa la paleta de comandos." },
    { id: "sudo",     icon: "🥪", name: "sudo",                 desc: "Pide algo con sudo." },
    { id: "konami",   icon: "🕹️", name: "↑↑↓↓←→←→BA",           desc: "Encuentra el código secreto." }
  ];

  const GOALS = [
    { xp: 30,  name: "Tranqui" },
    { xp: 60,  name: "Normal" },
    { xp: 120, name: "Modo sprint" }
  ];

  const hash = s => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  };
  const PHRASES = (window.PHRASES || []).map(p => ({ ...p, id: hash(p.en) }));
  const byId = Object.fromEntries(PHRASES.map(p => [p.id, p]));
  const DIALOGS = window.DIALOGS || [];

  /* ═════════════ Almacenamiento seguro ═════════════ */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem("standup." + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("standup." + key, JSON.stringify(value)); } catch (e) { /* sin almacenamiento */ }
    }
  };

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DEFAULTS = {
    font: "lexend", size: "m", spacing: "wide", theme: prefersDark ? "dark" : "cream",
    accent: "en-GB", rate: 0.95, ruler: false, highlight: true, fx: true
  };
  const settings = Object.assign({}, DEFAULTS, store.get("settings", {}));
  const known = new Set(store.get("known", []));
  const state = Object.assign({ level: null, cat: null, q: "", hideKnown: false, view: "learn", dir: "en" }, store.get("filters", {}));
  const game = Object.assign({ xp: 0, log: {}, ach: {}, cloze: 0, listens: 0, dialogs: [], goal: 60 }, store.get("game", {}));

  const saveKnown = () => store.set("known", [...known]);
  const saveFilters = () => store.set("filters", { level: state.level, cat: state.cat, hideKnown: state.hideKnown, dir: state.dir });
  const saveGame = () => store.set("game", game);

  /* ═════════════ Utilidades ═════════════ */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  function wordsHTML(text) {
    let out = "", m, last = 0;
    const re = /\S+/g;
    while ((m = re.exec(text))) {
      out += esc(text.slice(last, m.index)) + `<span class="w" data-s="${m.index}">${esc(m[0])}</span>`;
      last = m.index + m[0].length;
    }
    return out + esc(text.slice(last));
  }

  /* ═════════════ Avisos y confeti ═════════════ */
  const OK_MSGS = ["build passed", "tests green", "LGTM", "merged", "deploy OK", "200 OK", "pipeline ✓"];

  function toast(html, kind = "") {
    const box = $("#toasts");
    const t = document.createElement("div");
    t.className = "toast " + kind;
    t.innerHTML = html;
    box.appendChild(t);
    while (box.children.length > 4) box.firstChild.remove();
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 350); }, kind === "award" ? 4200 : 2600);
  }

  // Una sola ráfaga corta a la vez, por los bordes: celebra sin tapar el texto
  let confettiBusy = false;
  function confetti(n = 24) {
    if (!settings.fx || reducedMotion || confettiBusy) return;
    confettiBusy = true;
    setTimeout(() => { confettiBusy = false; }, 2500);
    n = Math.min(n, 28);
    const box = $("#confetti");
    const bits = ["✨", "🎉", "⭐", "💚", "{ }", "</>"];
    for (let i = 0; i < n; i++) {
      const el = document.createElement("i");
      el.textContent = pick(bits);
      const side = Math.random() < 0.5 ? Math.random() * 18 : 82 + Math.random() * 18;
      el.style.left = side + "vw";
      el.style.animationDuration = 1.6 + Math.random() * 1.2 + "s";
      el.style.animationDelay = Math.random() * 0.3 + "s";
      box.appendChild(el);
      setTimeout(() => el.remove(), 4200);
    }
  }

  /* ═════════════ Gamificación ═════════════ */
  const rankFor = xp => RANKS.reduce((r, k) => (xp >= k.xp ? k : r), RANKS[0]);
  const nextRank = xp => RANKS.find(k => k.xp > xp) || null;
  const todayXP = () => game.log[dayKey()] || 0;

  function streak() {
    let n = 0;
    const d = new Date();
    if (!game.log[dayKey(d)]) d.setDate(d.getDate() - 1); // hoy aún cuenta si practicaste ayer
    while (game.log[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function unlock(id) {
    if (game.ach[id]) return;
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (!a) return;
    game.ach[id] = dayKey();
    saveGame();
    toast(`<span>${a.icon}</span><span><span class="mono">logro</span> ${esc(a.name)}</span>`, "award");
    confetti(40);
    if (state.view === "profile") renderProfile();
  }

  function addXP(n, msg) {
    if (n <= 0) return;
    const before = rankFor(game.xp);
    const goalBefore = todayXP() >= game.goal;
    game.xp += n;
    game.log[dayKey()] = todayXP() + n;
    saveGame();
    if (settings.fx) toast(`<span class="mono">✔ ${esc(msg || pick(OK_MSGS))}</span><span>+${n} XP</span>`);
    const after = rankFor(game.xp);
    if (after !== before) {
      toast(`<span>${after.icon}</span><span><span class="mono">promoted</span> ¡Ahora eres ${after.name}!</span>`, "award");
      confetti(80);
    }
    if (!goalBefore && todayXP() >= game.goal) unlock("goal");
    checkAchievements();
    renderHUD(true);
    renderGoal();
  }

  function checkAchievements() {
    if (game.xp > 0) unlock("hello");
    if (known.size >= 25) unlock("merge");
    if (PHRASES.some(p => p.l === "C1" && known.has(p.id))) unlock("c1");
    if (game.cloze >= 10) unlock("regex");
    if (game.listens >= 50) unlock("podcast");
    const s = streak();
    if (s >= 3) unlock("uptime3");
    if (s >= 7) unlock("uptime7");
    if (game.dialogs.includes("daily")) unlock("standup");
    if (game.dialogs.includes("incident")) unlock("oncall");
    if (DIALOGS.length && DIALOGS.every(d => game.dialogs.includes(d.id))) unlock("social");
    const h = new Date().getHours();
    if (game.xp > 0 && (h >= 23 || h < 5)) unlock("owl");
  }

  function renderHUD(bump) {
    const r = rankFor(game.xp);
    $("#hud-rank").textContent = `${r.icon} ${r.name}`;
    $("#hud-xp").textContent = `⚡${game.xp}`;
    $("#hud-streak").textContent = `🔥${streak()}`;
    $("#hud").setAttribute("aria-label", `${r.name}, ${game.xp} XP, ${streak()} días seguidos. Ver perfil`);
    if (bump && settings.fx) { const h = $("#hud"); h.classList.remove("bump"); void h.offsetWidth; h.classList.add("bump"); }
  }

  function renderGoal() {
    const el = $("#goal");
    const xp = todayXP(), goal = game.goal;
    const segs = 10, on = Math.min(segs, Math.floor((xp / goal) * segs));
    el.classList.toggle("done", xp >= goal);
    el.innerHTML = `
      <span class="label">Meta del día</span>
      <div class="pipe" role="progressbar" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.min(xp, goal)}" aria-label="Meta del día">
        ${Array.from({ length: segs }, (_, i) => `<span class="${i < on ? "on" : ""}"></span>`).join("")}
      </div>
      <span class="meta">${Math.min(xp, goal)}/${goal} XP${xp >= goal ? " · sprint ✔" : ""}</span>`;
  }

  /* ═════════════ Voz ═════════════ */
  const synth = window.speechSynthesis;
  let voices = [];
  const loadVoices = () => { voices = synth ? synth.getVoices() : []; };
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

  function pickVoice(lang) {
    const exact = voices.filter(v => v.lang && v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase());
    const pool = exact.length ? exact : voices.filter(v => v.lang && v.lang.toLowerCase().startsWith("en"));
    const good = /natural|neural|google|premium|enhanced|samantha|daniel|serena|libby|sonia|aria|jenny/i;
    return pool.find(v => good.test(v.name)) || pool[0] || null;
  }

  let speakingEl = null;
  function clearHighlight() {
    if (speakingEl) $$(".w.on", speakingEl).forEach(w => w.classList.remove("on"));
    speakingEl = null;
  }

  function speak(text, el, slow) {
    if (!synth) { toast("Tu navegador no tiene voces. Prueba con Chrome, Edge o Safari."); return; }
    synth.cancel();
    clearHighlight();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = settings.accent;
    const v = pickVoice(settings.accent);
    if (v) u.voice = v;
    u.rate = slow ? Math.max(0.5, settings.rate * 0.65) : settings.rate;
    if (el && settings.highlight) {
      speakingEl = el;
      const words = $$(".w", el);
      u.onboundary = e => {
        if (e.name && e.name !== "word") return;
        let current = null;
        for (const w of words) { if (+w.dataset.s <= e.charIndex) current = w; else break; }
        words.forEach(w => w.classList.toggle("on", w === current));
      };
    }
    u.onend = u.onerror = clearHighlight;
    synth.speak(u);
    game.listens++; saveGame();
    if (game.listens === 50) checkAchievements();
  }

  /* ═════════════ Ajustes de lectura ═════════════ */
  const root = document.documentElement;
  const ruler = $("#ruler");

  function applySettings() {
    root.dataset.font = settings.font;
    root.dataset.size = settings.size;
    root.dataset.spacing = settings.spacing;
    root.dataset.theme = settings.theme;
    ruler.classList.toggle("on", !!settings.ruler);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue("--bg").trim();
    $("#rate-out").textContent = "×" + Number(settings.rate).toFixed(2);
  }

  function syncSettingsForm() {
    const f = $("#settings form");
    ["font", "size", "spacing", "theme", "accent"].forEach(name => {
      const input = $(`input[name="${name}"][value="${settings[name]}"]`, f);
      if (input) input.checked = true;
    });
    f.rate.value = settings.rate;
    f.ruler.checked = !!settings.ruler;
    f.highlight.checked = !!settings.highlight;
    f.fx.checked = !!settings.fx;
  }

  function setSetting(name, value) {
    settings[name] = value;
    store.set("settings", settings);
    applySettings();
  }

  $("#settings form").addEventListener("input", e => {
    const t = e.target;
    if (!t.name) return;
    if (t.type === "checkbox") setSetting(t.name, t.checked);
    else if (t.type === "range") setSetting(t.name, parseFloat(t.value));
    else setSetting(t.name, t.value);
  });
  $("#open-settings").addEventListener("click", () => { syncSettingsForm(); $("#settings").showModal(); });
  document.addEventListener("pointermove", e => { if (settings.ruler) ruler.style.top = e.clientY + "px"; }, { passive: true });

  /* ═════════════ Filtros y tarjetas ═════════════ */
  function renderChips() {
    $("#level-chips").innerHTML =
      `<button class="chip" data-level-btn="" aria-pressed="${state.level === null}">Todos</button>` +
      LEVELS.map(l => `<button class="chip" data-level="${l.id}" data-level-btn="${l.id}" aria-pressed="${state.level === l.id}">
        <span class="lvl-dot" aria-hidden="true"></span>${l.id} · ${l.name}</button>`).join("");
    $("#cat-chips").innerHTML =
      `<button class="chip" data-cat-btn="" aria-pressed="${state.cat === null}">Todos</button>` +
      CATS.map(c => `<button class="chip" data-cat-btn="${c.id}" aria-pressed="${state.cat === c.id}">
        <span aria-hidden="true">${c.icon}</span>${c.name}</button>`).join("");
  }

  function setLevel(l) { state.level = l; saveFilters(); renderChips(); renderCards(); }
  function setCat(c) { state.cat = c; saveFilters(); renderChips(); renderCards(); }

  $("#level-chips").addEventListener("click", e => { const b = e.target.closest("[data-level-btn]"); if (b) setLevel(b.dataset.levelBtn || null); });
  $("#cat-chips").addEventListener("click", e => { const b = e.target.closest("[data-cat-btn]"); if (b) setCat(b.dataset.catBtn || null); });
  $("#search").addEventListener("input", e => { state.q = e.target.value; renderCards(); });
  $("#hide-known").addEventListener("change", e => { state.hideKnown = e.target.checked; saveFilters(); renderCards(); });

  const matchesScope = p => (!state.level || p.l === state.level) && (!state.cat || p.c === state.cat);

  function filtered() {
    const q = norm(state.q.trim());
    return PHRASES.filter(p =>
      matchesScope(p) &&
      (!state.hideKnown || !known.has(p.id)) &&
      (!q || norm(`${p.en} ${p.es} ${p.ex} ${p.tip || ""} ${catById[p.c].name}`).includes(q))
    );
  }

  function cardHTML(p) {
    const isKnown = known.has(p.id), cat = catById[p.c];
    return `<article class="card${isKnown ? " is-known" : ""}" data-level="${p.l}" data-id="${p.id}">
      <div class="card-head">
        <span class="badge">${p.l}</span>
        <span class="tag"><span aria-hidden="true">${cat.icon}</span> ${cat.name}</span>
        <button class="known-toggle" data-act="known" aria-pressed="${isKnown}">${isKnown ? "✓ La sé" : "La sé"}</button>
      </div>
      <p class="en" lang="en">${wordsHTML(p.en)}</p>
      <div class="actions">
        <button class="btn btn-soft" data-act="say"><span aria-hidden="true">🔊</span> Escuchar</button>
        <button class="btn btn-ghost" data-act="slow"><span aria-hidden="true">🐢</span> Despacio</button>
        <button class="btn btn-ghost" data-act="reveal" aria-expanded="false"><span aria-hidden="true">👀</span> Ver significado</button>
      </div>
      <div class="reveal" hidden>
        <p class="es">${esc(p.es)}</p>
        <p class="ex-label">Ejemplo</p>
        <div class="ex-row">
          <button class="btn btn-ghost" data-act="say-ex" aria-label="Escuchar el ejemplo">🔊</button>
          <p class="ex" lang="en">${wordsHTML(p.ex)}</p>
        </div>
        ${p.tip ? `<p class="tip">${esc(p.tip)}</p>` : ""}
      </div>
    </article>`;
  }

  function updateCount(list = filtered()) {
    const total = PHRASES.filter(matchesScope).length;
    const knownInScope = PHRASES.filter(p => matchesScope(p) && known.has(p.id)).length;
    $("#count").textContent = `${list.length} frase${list.length === 1 ? "" : "s"} · ya sabes ${knownInScope} de ${total}`;
  }

  function renderCards() {
    const list = filtered();
    updateCount(list);
    $("#cards").innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<p class="empty"><span class="mono">404 Not Found</span><br>No hay frases con estos filtros. ${state.hideKnown ? "¡Puede que ya te las sepas todas! 🎉" : "Prueba a quitar alguno."}</p>`;
  }

  function markKnown(id, value) {
    const was = known.has(id);
    if (value && !was) { known.add(id); saveKnown(); addXP(10); }
    else if (!value && was) { known.delete(id); saveKnown(); }
    checkAchievements();
  }

  $("#cards").addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const card = b.closest(".card"), p = byId[card.dataset.id];
    switch (b.dataset.act) {
      case "say":    speak(p.en, $(".en", card), false); break;
      case "slow":   speak(p.en, $(".en", card), true); break;
      case "say-ex": speak(p.ex, $(".ex", card), false); break;
      case "reveal": {
        const r = $(".reveal", card);
        r.hidden = !r.hidden;
        b.setAttribute("aria-expanded", String(!r.hidden));
        b.innerHTML = r.hidden ? '<span aria-hidden="true">👀</span> Ver significado' : '<span aria-hidden="true">🙈</span> Ocultar';
        break;
      }
      case "known": {
        markKnown(p.id, !known.has(p.id));
        const k = known.has(p.id);
        b.setAttribute("aria-pressed", String(k));
        b.textContent = k ? "✓ La sé" : "La sé";
        card.classList.toggle("is-known", k);
        if (state.hideKnown && k) renderCards(); else updateCount();
        break;
      }
    }
  });

  /* ═════════════ Frase del día ═════════════ */
  function renderDaily() {
    const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    const p = PHRASES[day % PHRASES.length];
    const el = $("#daily");
    el.dataset.id = p.id;
    el.innerHTML = `
      <div class="term-bar" aria-hidden="true"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="term-title">~/stand-up — daily.sh</span></div>
      <div class="term-body">
        <p class="term-line"><span class="g">$</span> stand-up --today</p>
        <p class="term-line"><span class="a">[${p.l}]</span> ${esc(catById[p.c].name)} · frase del día</p>
        <p class="en" lang="en">${wordsHTML(p.en)}</p>
        <p class="es" hidden>→ ${esc(p.es)}</p>
        <div class="row">
          <button class="btn" data-act="say"><span aria-hidden="true">🔊</span> Escuchar</button>
          <button class="btn" data-act="slow"><span aria-hidden="true">🐢</span> Despacio</button>
          <button class="btn" data-act="reveal"><span aria-hidden="true">👀</span> Significado</button>
        </div>
      </div>`;
  }
  $("#daily").addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const el = $("#daily"), p = byId[el.dataset.id];
    if (b.dataset.act === "say") speak(p.en, $(".en", el), false);
    if (b.dataset.act === "slow") speak(p.en, $(".en", el), true);
    if (b.dataset.act === "reveal") { const es = $(".es", el); es.hidden = !es.hidden; }
  });

  /* ═════════════ Practicar (tarjetas) ═════════════ */
  const practice = { deck: [], pos: 0, flipped: false, done: 0 };

  function buildDeck() {
    const scope = PHRASES.filter(matchesScope);
    const pending = shuffle(scope.filter(p => !known.has(p.id)));
    const deck = pending.length ? pending : shuffle(scope.slice());
    practice.deck = deck.slice(0, 20).map(p => p.id);
    practice.pos = 0; practice.flipped = false; practice.done = 0;
    const lvl = state.level || "todos los niveles";
    const cat = state.cat ? catById[state.cat].name : "todos los temas";
    $("#practice-scope").textContent = `${lvl} · ${cat} · ${practice.deck.length} tarjetas${pending.length ? "" : " (repaso)"}`;
  }

  function renderFlash() {
    const flash = $("#flash"), actions = $("#flash-actions");
    $$(".seg-btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.dir === state.dir)));

    if (!practice.deck.length) {
      flash.removeAttribute("data-level");
      flash.innerHTML = `<p class="done">No hay frases con estos filtros.</p><p class="muted">Cambia el nivel o el tema en «Aprender».</p>`;
      actions.innerHTML = `<button class="btn btn-primary" data-go="learn">Ir a Aprender</button>`;
      return;
    }
    if (practice.pos >= practice.deck.length) {
      flash.removeAttribute("data-level");
      flash.innerHTML = `<p class="done">✔ Review aprobada 🎉</p><p>Has marcado ${practice.done} como sabidas.</p>`;
      actions.innerHTML = `<button class="btn btn-primary" data-fa="restart">Otra ronda</button>`;
      return;
    }

    const p = byId[practice.deck[practice.pos]], cat = catById[p.c];
    flash.dataset.level = p.l;
    const front = state.dir === "en" ? `<p class="big" lang="en">${wordsHTML(p.en)}</p>` : `<p class="big">${esc(p.es)}</p>`;
    const back = state.dir === "en" ? `<p class="es">${esc(p.es)}</p>` : `<p class="es" lang="en">${wordsHTML(p.en)}</p>`;
    const sayBtns = `<div class="row"><button class="btn btn-soft" data-fa="say">🔊 Escuchar</button><button class="btn btn-ghost" data-fa="slow">🐢 Despacio</button></div>`;

    flash.innerHTML = `
      <div class="meta">
        <span class="badge">${p.l}</span>
        <span class="tag"><span aria-hidden="true">${cat.icon}</span> ${cat.name}</span>
        <span class="progress-dots">${practice.pos + 1}/${practice.deck.length}</span>
      </div>
      ${front}
      ${state.dir === "en" ? sayBtns : ""}
      ${practice.flipped ? `<div class="answer">${back}
        <p class="ex" lang="en">${wordsHTML(p.ex)}</p>
        ${state.dir === "es" ? sayBtns : ""}
        ${p.tip ? `<p class="tip">${esc(p.tip)}</p>` : ""}
      </div>` : ""}`;

    actions.innerHTML = practice.flipped
      ? `<button class="btn btn-ghost" data-fa="again">↺ Otra vez</button><button class="btn btn-primary" data-fa="know">✓ ¡La sé!</button>`
      : `<button class="btn btn-primary" data-fa="flip">Dar la vuelta</button>`;
  }

  function practiceAction(act) {
    const id = practice.deck[practice.pos], p = byId[id];
    if (!p && act !== "restart") return;
    switch (act) {
      case "flip": practice.flipped = true; break;
      case "again":
        if (!practice.flipped) return;
        practice.deck.splice(practice.pos, 1);
        practice.deck.splice(Math.min(practice.deck.length, practice.pos + 3), 0, id);
        practice.flipped = false; break;
      case "know":
        if (!practice.flipped) return;
        if (known.has(id)) addXP(5, "refactor"); else markKnown(id, true);
        practice.done++; practice.pos++; practice.flipped = false;
        if (practice.pos >= practice.deck.length) confetti(50);
        break;
      case "say": case "slow":
        if (state.dir === "es" && !practice.flipped) return;
        speak(p.en, $('#flash .big[lang="en"], #flash .es[lang="en"]'), act === "slow"); return;
      case "restart": buildDeck(); break;
    }
    renderFlash();
    if (act === "flip" || act === "again" || act === "know") {
      const target = $(practice.flipped ? '#flash-actions [data-fa="know"]' : '#flash-actions [data-fa="flip"]');
      if (target) target.focus({ preventScroll: true });
    }
  }

  $("#view-practice").addEventListener("click", e => {
    const fa = e.target.closest("[data-fa]");
    if (fa) return practiceAction(fa.dataset.fa);
    const dir = e.target.closest("[data-dir]");
    if (dir) { state.dir = dir.dataset.dir; saveFilters(); practice.flipped = false; renderFlash(); }
    const go = e.target.closest("[data-go]");
    if (go) showView(go.dataset.go);
  });

  /* ═════════════ Jugar ═════════════ */
  const play = { mode: "menu", dialog: null, turn: 0, solved: false, missed: false, cloze: null };

  function renderPlay() {
    const area = $("#play-area");
    if (play.mode === "menu") {
      const done = DIALOGS.filter(d => game.dialogs.includes(d.id)).length;
      area.innerHTML = `
        <div class="games">
          <button class="game-card" data-play="chat">
            <span class="big-icon" aria-hidden="true">💬</span>
            <span class="cmd">$ slack --simulate</span>
            <h2>Simulador de Slack</h2>
            <p>Daily, incidencia P1, entrevista, café y 1:1. Elige qué responder y aprende por qué. ${done}/${DIALOGS.length} completadas.</p>
          </button>
          <button class="game-card" data-play="cloze">
            <span class="big-icon" aria-hidden="true">🧩</span>
            <span class="cmd">$ git commit --fill</span>
            <h2>Rellena el hueco</h2>
            <p>Falta una palabra en cada frase. Elige la buena entre cuatro. Usa el nivel y el tema de «Aprender».</p>
          </button>
        </div>`;
      return;
    }
    if (play.mode === "chat-list") {
      area.innerHTML = `
        <button class="btn btn-ghost back" data-play="menu">← Volver</button>
        <div class="scenarios">
          ${DIALOGS.map(d => `<button class="scenario" data-level="${d.level}" data-dialog="${d.id}">
            <span class="ico" aria-hidden="true">${d.icon}</span>
            <span><span class="t">${esc(d.title)}</span><span class="s"><span class="badge">${d.level}</span> ${esc(d.channel)}</span></span>
            <span class="done-mark">${game.dialogs.includes(d.id) ? "✔ hecho" : ""}</span>
          </button>`).join("")}
        </div>`;
      return;
    }
    if (play.mode === "chat") return renderChat();
    if (play.mode === "cloze") return renderCloze();
  }

  $("#play-area").addEventListener("click", e => {
    const t = e.target;
    const go = t.closest("[data-play]");
    if (go) {
      const m = go.dataset.play;
      if (m === "chat") play.mode = "chat-list";
      else if (m === "cloze") { play.mode = "cloze"; startCloze(); }
      else play.mode = m;
      renderPlay(); window.scrollTo({ top: 0 }); return;
    }
    const sc = t.closest("[data-dialog]");
    if (sc) { startDialog(sc.dataset.dialog); return; }
    const ch = t.closest("[data-choice]");
    if (ch) { chooseOption(+ch.dataset.choice, ch); return; }
    const ca = t.closest("[data-chat]");
    if (ca) {
      const a = ca.dataset.chat;
      const p = play.dialog;
      if (a === "say") speak(p.turns[+ca.dataset.turn].text, ca.closest(".msg").querySelector(".text"), false);
      if (a === "slow") speak(p.turns[+ca.dataset.turn].text, ca.closest(".msg").querySelector(".text"), true);
      if (a === "es") { const tr = ca.closest(".msg").querySelector(".trans"); tr.hidden = !tr.hidden; }
      if (a === "say-me") speak(ca.dataset.text, ca.closest(".msg").querySelector(".text"), false);
      if (a === "next" && play.solved) {
        play.history.push({ i: play.turn, answer: play.solved.en });
        play.turn++;
        Object.assign(play, { solved: false, missed: false, lastWrong: null, tried: [], order: null });
        renderChat(true);
      }
      return;
    }
    const cz = t.closest("[data-cloze]");
    if (cz) { clozeAction(cz.dataset.cloze, cz); }
  });

  /* ── Simulador de chat ── */
  function startDialog(id) {
    play.dialog = DIALOGS.find(d => d.id === id);
    Object.assign(play, { turn: 0, solved: false, missed: false, history: [], lastWrong: null, tried: [], order: null });
    play.mode = "chat";
    renderPlay();
    window.scrollTo({ top: 0 });
  }

  function msgHTML(d, i, turn) {
    return `<div class="msg" data-level="${d.level}">
      <span class="avatar" aria-hidden="true">${d.who.avatar}</span>
      <div>
        <p class="who"><b>${esc(d.who.name)}</b> <span class="role">· ${esc(d.who.role)}</span></p>
        <p class="text" lang="en">${wordsHTML(turn.text)}</p>
        <p class="trans" hidden>${esc(turn.es)}</p>
        <div class="tools">
          <button class="btn btn-soft" data-chat="say" data-turn="${i}">🔊 Escuchar</button>
          <button class="btn btn-ghost" data-chat="slow" data-turn="${i}">🐢</button>
          <button class="btn btn-ghost" data-chat="es">ES</button>
        </div>
      </div>
    </div>`;
  }

  function myMsgHTML(text) {
    return `<div class="msg me">
      <span class="avatar" aria-hidden="true">TÚ</span>
      <div>
        <p class="who"><b>Tú</b></p>
        <p class="text" lang="en">${wordsHTML(text)}</p>
        <div class="tools"><button class="btn btn-ghost" data-chat="say-me" data-text="${esc(text)}">🔊 Escuchar</button></div>
      </div>
    </div>`;
  }

  function renderChat(focusNext) {
    const d = play.dialog;
    const area = $("#play-area");
    const finished = play.turn >= d.turns.length;
    let log = `<p class="chat-intro">${esc(d.intro)}</p>`;
    play.history.forEach(h => { log += msgHTML(d, h.i, d.turns[h.i]) + myMsgHTML(h.answer); });

    let choices = "";
    if (!finished) {
      const turn = d.turns[play.turn];
      log += msgHTML(d, play.turn, turn);
      if (play.solved) {
        log += myMsgHTML(play.solved.en);
        log += `<p class="feedback ok"><b>✔ ¡Bien!</b>${esc(play.solved.why)}</p>`;
        choices = `<div class="choices"><button class="btn btn-primary" data-chat="next">Continuar →</button></div>`;
      } else {
        if (play.lastWrong) log += `<p class="feedback bad"><b>✖ Casi…</b>${esc(play.lastWrong.why)}</p>`;
        if (!play.order) play.order = shuffle(turn.options.map((_, k) => k));
        choices = `<div class="choices" role="group" aria-label="Elige tu respuesta">
          ${play.order.map(k => `<button class="choice" lang="en" data-choice="${k}" ${play.tried && play.tried.includes(k) ? "disabled" : ""}>${esc(turn.options[k].en)}</button>`).join("")}
        </div>`;
      }
    }

    area.innerHTML = `
      <button class="btn btn-ghost back" data-play="chat-list">← Conversaciones</button>
      <div class="chat" data-level="${d.level}">
        <div class="chat-head">
          <span aria-hidden="true">${d.icon}</span>
          <span class="ch">${esc(d.channel)}</span>
          <span class="badge">${d.level}</span>
          <span class="steps score">${Math.min(play.turn + (play.solved ? 1 : 0), d.turns.length)}/${d.turns.length}</span>
        </div>
        <div class="chat-log" aria-live="polite">${log}</div>
        ${choices}
        ${finished ? `<div class="chat-end"><p class="big">${esc(d.outro)}</p>
          <div class="row"><button class="btn btn-primary" data-play="chat-list">Otra conversación</button><button class="btn btn-ghost" data-dialog="${d.id}">Repetir</button></div></div>` : ""}
      </div>`;

    if (focusNext) {
      const f = $("#play-area .choice:not([disabled])") || $('#play-area [data-chat="next"]') || $('#play-area .chat-end .btn');
      if (f) f.focus({ preventScroll: true });
      const last = $$("#play-area .msg").pop();
      if (last) last.scrollIntoView({ block: "center", behavior: reducedMotion ? "auto" : "smooth" });
    }
  }

  function chooseOption(k) {
    const d = play.dialog, turn = d.turns[play.turn], opt = turn.options[k];
    if (opt.ok) {
      play.solved = opt;
      addXP(play.missed ? 10 : 20, play.missed ? "fixed on retry" : "LGTM");
      if (play.turn === d.turns.length - 1) {
        const first = !game.dialogs.includes(d.id);
        if (first) game.dialogs.push(d.id);
        saveGame();
        addXP(first ? 50 : 20, first ? "conversación completada" : "replay");
        confetti(70);
      }
      renderChat(true);
    } else {
      play.missed = true;
      play.lastWrong = opt;
      play.tried = (play.tried || []).concat(k);
      renderChat(true);
    }
  }


  /* ── Rellena el hueco ── */
  const STOP = new Set("the a an to i you is are it on in of and for my me we that this be do can with your at so it's i'm i'll let's we're i've don't there what how its was have has will not but or as our".split(" "));
  const clean = w => w.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");

  function blankable(p) {
    const words = p.en.split(/\s+/).map(clean).filter(w => w.length >= 3 && !STOP.has(w.toLowerCase()));
    return words;
  }

  const WORD_POOL = (() => {
    const s = new Map();
    PHRASES.forEach(p => blankable(p).forEach(w => { const k = w.toLowerCase(); if (!s.has(k)) s.set(k, { w, l: p.l }); }));
    return [...s.values()];
  })();

  function makeQuestion(p) {
    const cands = blankable(p);
    if (!cands.length) return null;
    const sorted = cands.slice().sort((a, b) => b.length - a.length);
    const answer = pick(sorted.slice(0, Math.min(3, sorted.length)));
    const lower = answer.toLowerCase();
    const inPhrase = new Set(p.en.toLowerCase().split(/\s+/).map(clean));
    let pool = WORD_POOL.filter(x => x.w.toLowerCase() !== lower && !inPhrase.has(x.w.toLowerCase()) && Math.abs(x.w.length - answer.length) <= 2);
    const sameLevel = pool.filter(x => x.l === p.l);
    if (sameLevel.length >= 3) pool = sameLevel;
    const distract = shuffle(pool.slice()).slice(0, 3).map(x => x.w);
    // Mismas mayúsculas que la respuesta, para no dar pistas
    const fix = w => (answer[0] === answer[0].toUpperCase() ? w[0].toUpperCase() + w.slice(1) : w.toLowerCase());
    const options = shuffle([answer, ...distract.map(fix)]);
    const idx = p.en.indexOf(answer);
    return { id: p.id, answer, options, before: p.en.slice(0, idx), after: p.en.slice(idx + answer.length), picked: null };
  }

  function startCloze() {
    const scope = shuffle(PHRASES.filter(matchesScope).slice());
    const qs = [];
    for (const p of scope) { const q = makeQuestion(p); if (q) qs.push(q); if (qs.length >= 10) break; }
    play.cloze = { qs, pos: 0, right: 0, wrongs: [] };
  }

  function renderCloze() {
    const area = $("#play-area");
    const c = play.cloze;
    const scopeTxt = `${state.level || "todos los niveles"} · ${state.cat ? catById[state.cat].name : "todos los temas"}`;
    let body;
    if (!c.qs.length) {
      body = `<div class="cloze-card"><p class="cloze-q">No hay frases con estos filtros.</p><p class="cloze-hint">Cambia el nivel o el tema en «Aprender».</p></div>`;
    } else if (c.pos >= c.qs.length) {
      body = `<div class="cloze-card"><p class="cloze-q">✔ Commit hecho: ${c.right}/${c.qs.length}</p>
        <p class="cloze-hint">${c.right === c.qs.length ? "Pleno. Ni un conflicto. 🏆" : c.right >= 7 ? "Muy bien. Unos pocos fixes y listo." : "Cada fallo es un aprendizaje. ¡Otra ronda!"}</p>
        <div class="btn-row"><button class="btn btn-primary" data-cloze="restart">Otra ronda</button><button class="btn btn-ghost" data-play="menu">Volver</button></div></div>`;
    } else {
      const q = c.qs[c.pos], p = byId[q.id], answered = q.picked !== null;
      const ok = answered && q.picked === q.answer;
      body = `<div class="cloze-card" data-level="${p.l}">
        <div class="meta-row">
          <span class="badge">${p.l}</span><span class="tag">${catById[p.c].icon} ${catById[p.c].name}</span>
          <span class="score">${c.pos + 1}/${c.qs.length} · ✔ ${c.right}</span>
        </div>
        <p class="cloze-q" lang="en">${esc(q.before)}<span class="gap${answered ? " filled" : ""}" aria-label="${answered ? esc(q.answer) : "hueco"}">${answered ? esc(q.answer) : "____"}</span>${esc(q.after)}</p>
        <p class="cloze-hint">💡 ${esc(p.es)}</p>
        <div class="cloze-opts" role="group" aria-label="Opciones">
          ${q.options.map(o => {
            let cls = "choice";
            if (answered && o === q.answer) cls += " right";
            else if (answered && o === q.picked) cls += " wrong";
            return `<button class="${cls}" lang="en" data-cloze="pick" data-word="${esc(o)}" ${answered ? "disabled" : ""}>${esc(o)}</button>`;
          }).join("")}
        </div>
        ${answered ? `<p class="feedback ${ok ? "ok" : "bad"}"><b>${ok ? "✔ ¡Correcto!" : "✖ Era «" + esc(q.answer) + "»"}</b>${esc(p.ex)}</p>
          <div class="btn-row">
            <button class="btn btn-soft" data-cloze="say">🔊 Escuchar la frase</button>
            <button class="btn btn-primary" data-cloze="next">Siguiente →</button>
          </div>` : ""}
      </div>`;
    }
    area.innerHTML = `
      <button class="btn btn-ghost back" data-play="menu">← Juegos</button>
      <div class="cloze">
        <p class="kicker mono">$ git commit --fill · ${esc(scopeTxt)}</p>
        ${body}
      </div>`;
  }

  function clozeAction(act, el) {
    const c = play.cloze, q = c.qs[c.pos];
    if (act === "pick" && q && q.picked === null) {
      q.picked = el.dataset.word;
      if (q.picked === q.answer) { c.right++; game.cloze++; saveGame(); addXP(15, pick(["tests green", "compiles!", "no conflicts"])); }
      renderCloze();
      const n = $('#play-area [data-cloze="next"]'); if (n) n.focus({ preventScroll: true });
      if (c.pos === c.qs.length - 1 && c.right === c.qs.length) confetti(70);
    }
    if (act === "say" && q) speak(byId[q.id].en, $("#play-area .cloze-q"), false);
    if (act === "next") { c.pos++; renderCloze(); const f = $("#play-area .choice:not([disabled])") || $('#play-area [data-cloze="restart"]'); if (f) f.focus({ preventScroll: true }); }
    if (act === "restart") { startCloze(); renderCloze(); }
  }

  /* ═════════════ Perfil ═════════════ */
  function barHTML(label, k, t, level) {
    const pct = t ? Math.round((k / t) * 100) : 0;
    return `<div class="bar-row" ${level ? `data-level="${level}"` : ""}>
      <div class="bar-top"><span>${label}</span><span class="muted">${k}/${t}</span></div>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${t}" aria-valuenow="${k}" aria-label="${esc(label)}"><span style="width:${pct}%"></span></div>
    </div>`;
  }

  function renderProfile() {
    const r = rankFor(game.xp), nx = nextRank(game.xp);
    const pct = nx ? Math.round(((game.xp - r.xp) / (nx.xp - r.xp)) * 100) : 100;
    const unlocked = ACHIEVEMENTS.filter(a => game.ach[a.id]).length;
    $("#profile-area").innerHTML = `
      <div class="rank-card">
        <span class="rank-icon" aria-hidden="true">${r.icon}</span>
        <div>
          <p class="sub">role: ${r.name.toLowerCase()} · xp: ${game.xp}</p>
          <p class="title">${r.name}</p>
          <p class="sub">${nx ? `${nx.xp - game.xp} XP para ascender a ${nx.name} ${nx.icon}` : "Has llegado a lo más alto. 👑"}</p>
          <div class="rank-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progreso al siguiente rango"><span style="width:${pct}%"></span></div>
        </div>
      </div>

      <div class="stats">
        <div class="stat"><span class="n">⚡ ${game.xp}</span><span class="l">XP total</span></div>
        <div class="stat"><span class="n">🔥 ${streak()}</span><span class="l">Días seguidos (uptime)</span></div>
        <div class="stat"><span class="n">📚 ${known.size}</span><span class="l">Frases que sabes</span></div>
        <div class="stat"><span class="n">🧩 ${game.cloze}</span><span class="l">Huecos acertados</span></div>
        <div class="stat"><span class="n">💬 ${game.dialogs.length}/${DIALOGS.length}</span><span class="l">Conversaciones</span></div>
        <div class="stat"><span class="n">🎧 ${game.listens}</span><span class="l">Frases escuchadas</span></div>
      </div>

      <div class="panel" style="margin-bottom:1rem">
        <h2>Meta diaria</h2>
        <p class="muted" style="font-size:.9rem">Sin castigos: si un día no llegas, no pasa nada.</p>
        <div class="seg" role="group" aria-label="Meta diaria">
          ${GOALS.map(g => `<button class="seg-btn" data-goal="${g.xp}" aria-pressed="${game.goal === g.xp}">${g.name} · ${g.xp} XP</button>`).join("")}
        </div>
      </div>

      <div class="panel" style="margin-bottom:1rem">
        <h2>Logros · ${unlocked}/${ACHIEVEMENTS.length}</h2>
        <div class="achs">
          ${ACHIEVEMENTS.map(a => `<div class="ach${game.ach[a.id] ? " on" : ""}">
            <span class="ico" aria-hidden="true">${a.icon}</span>
            <div><b>${esc(a.name)}</b><span>${game.ach[a.id] ? "✔ " : "🔒 "}${esc(a.desc)}</span></div>
          </div>`).join("")}
        </div>
      </div>

      <div class="progress-grid">
        <div class="panel"><h2>Por nivel</h2>
          ${LEVELS.map(l => { const all = PHRASES.filter(p => p.l === l.id); return barHTML(`${l.id} · ${l.name}`, all.filter(p => known.has(p.id)).length, all.length, l.id); }).join("")}
        </div>
        <div class="panel"><h2>Por tema</h2>
          ${CATS.map(c => { const all = PHRASES.filter(p => p.c === c.id); return barHTML(`${c.icon} ${c.name}`, all.filter(p => known.has(p.id)).length, all.length); }).join("")}
        </div>
      </div>

      <div class="profile-actions">
        <button class="btn btn-ghost danger" data-reset>Borrar mi progreso</button>
        <span class="muted mono" style="font-size:.75rem">rm -rf ~/.stand-up</span>
      </div>`;
  }

  $("#profile-area").addEventListener("click", e => {
    const g = e.target.closest("[data-goal]");
    if (g) { game.goal = +g.dataset.goal; saveGame(); renderProfile(); renderGoal(); return; }
    if (e.target.closest("[data-reset]")) {
      if (!confirm("¿Seguro que quieres borrar tu progreso, XP y logros?")) return;
      known.clear(); saveKnown();
      Object.assign(game, { xp: 0, log: {}, ach: {}, cloze: 0, listens: 0, dialogs: [] }); saveGame();
      renderProfile(); renderHUD(); renderGoal(); renderCards();
      toast('<span class="mono">✔ git reset --hard</span><span>Progreso borrado</span>');
    }
  });

  /* ═════════════ Paleta de comandos ═════════════ */
  const COMMANDS = [
    { c: "help",                 d: "Ver todos los comandos" },
    { c: "go learn",             d: "Ir a Aprender" },
    { c: "go practice",          d: "Ir a Practicar" },
    { c: "go play",              d: "Ir a Jugar" },
    { c: "go profile",           d: "Ir a tu perfil" },
    { c: "play slack",           d: "Simulador de Slack" },
    { c: "play fill",            d: "Rellena el hueco" },
    ...["a1", "a2", "b1", "b2", "c1", "all"].map(l => ({ c: `level ${l}`, d: l === "all" ? "Todos los niveles" : `Filtrar nivel ${l.toUpperCase()}` })),
    ...CATS.map(c => ({ c: `topic ${c.id}`, d: `Tema: ${c.name}` })),
    { c: "topic all",            d: "Todos los temas" },
    { c: "theme cream",          d: "Colores crema" },
    { c: "theme blue",           d: "Colores azul suave" },
    { c: "theme dark",           d: "Modo oscuro" },
    { c: "theme terminal",       d: "Modo terminal 😎" },
    { c: "say ",                 d: "Leer en voz alta lo que escribas" },
    { c: "whoami",               d: "Tu rango y XP" },
    { c: "uptime",               d: "Tus días seguidos" },
    { c: "sudo make me a sandwich", d: "🥪" },
    { c: "rm -rf /",             d: "Ni se te ocurra" }
  ];
  let palSel = 0, palItems = [];

  function openPalette() {
    const dlg = $("#palette");
    if (dlg.open) return;
    $("#palette-input").value = "";
    renderPalette();
    dlg.showModal();
    $("#palette-input").focus();
  }

  function renderPalette() {
    const q = $("#palette-input").value.trim().toLowerCase();
    palItems = COMMANDS.filter(x => !q || x.c.startsWith(q) || x.c.includes(q) || norm(x.d).includes(norm(q)));
    if (q.startsWith("say ") && q.length > 4) palItems = [{ c: $("#palette-input").value.trim(), d: "Leer en voz alta" }];
    palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
    $("#palette-list").innerHTML = palItems.length
      ? palItems.map((x, i) => `<li role="option" data-i="${i}" aria-selected="${i === palSel}"><span class="c">${esc(x.c)}</span><span class="d">${esc(x.d)}</span></li>`).join("")
      : `<li aria-selected="true"><span class="c">${esc(q)}</span><span class="d">command not found · pulsa Enter igualmente</span></li>`;
  }

  function runCommand(raw) {
    const cmd = raw.trim(), lc = cmd.toLowerCase();
    const [verb, ...rest] = lc.split(/\s+/);
    const arg = rest.join(" ");
    $("#palette").close();
    unlock("power");
    switch (verb) {
      case "help": openPalette(); return;
      case "go": if (["learn", "practice", "play", "profile"].includes(arg)) showView(arg); return;
      case "play":
        showView("play");
        if (arg === "slack") play.mode = "chat-list";
        if (arg === "fill") { play.mode = "cloze"; startCloze(); }
        renderPlay(); return;
      case "level": { const l = arg.toUpperCase(); setLevel(LEVELS.some(x => x.id === l) ? l : null); showView("learn"); toast(`<span class="mono">✔ level</span><span>${l === "ALL" ? "Todos los niveles" : l}</span>`); return; }
      case "topic": setCat(catById[arg] ? arg : null); showView("learn"); return;
      case "theme": if (["cream", "blue", "dark", "terminal"].includes(arg)) { setSetting("theme", arg); toast(`<span class="mono">✔ theme</span><span>${arg}</span>`); } return;
      case "say": if (arg) speak(cmd.slice(4)); return;
      case "whoami": { const r = rankFor(game.xp); toast(`<span>${r.icon}</span><span><span class="mono">${r.name.toLowerCase()}</span> · ${game.xp} XP</span>`); return; }
      case "uptime": toast(`<span class="mono">up ${streak()} days</span><span>🔥</span>`); return;
      case "sudo": unlock("sudo"); toast(`<span class="mono">🥪 okay.</span><span>${arg.includes("sandwich") ? "Aquí tienes tu sándwich." : "Permiso concedido. Con gran poder…"}</span>`); return;
      case "rm": toast('<span class="mono">🛡️ Permission denied</span><span>Buen intento 😏</span>'); return;
      case "exit": case "quit": case ":q": case ":wq": toast('<span class="mono">:wq</span><span>Has salido de Vim. Enhorabuena 🎉</span>'); return;
      case "ls": toast('<span class="mono">learn/ practice/ play/ profile/</span>'); return;
      case "": return;
      default: toast(`<span class="mono">zsh: command not found: ${esc(verb)}</span>`);
    }
  }

  $("#palette-input").addEventListener("input", () => { palSel = 0; renderPalette(); });
  $("#palette-input").addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); palSel = Math.min(palItems.length - 1, palSel + 1); renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); palSel = Math.max(0, palSel - 1); renderPalette(); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const typed = $("#palette-input").value.trim();
      const sel = palItems[palSel];
      if (sel && sel.c.trim() === "say") { $("#palette-input").value = "say "; renderPalette(); return; }
      runCommand(typed && (!sel || !sel.c.startsWith(typed.toLowerCase())) ? typed : (sel ? sel.c : typed));
    }
  });
  $("#palette-list").addEventListener("click", e => {
    const li = e.target.closest("[data-i]"); if (!li) return;
    const item = palItems[+li.dataset.i];
    if (item.c.trim() === "say") { $("#palette-input").value = "say "; $("#palette-input").focus(); renderPalette(); return; }
    runCommand(item.c);
  });
  $("#palette").addEventListener("click", e => { if (e.target === $("#palette")) $("#palette").close(); });
  $("#open-palette").addEventListener("click", openPalette);
  $$("[data-cmd]").forEach(b => b.addEventListener("click", openPalette));

  /* ═════════════ Teclado global y Konami ═════════════ */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kpos = 0;

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); return; }

    kpos = e.key === KONAMI[kpos] || e.key.toLowerCase() === KONAMI[kpos] ? kpos + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kpos === KONAMI.length) {
      kpos = 0;
      unlock("konami");
      confetti(120);
      toast('<span class="mono">🕹️ +30 lives</span><span>Esto no es Contra, pero vale 😄</span>', "award");
    }

    if (e.target.closest("input, textarea, dialog")) return;
    if (state.view === "practice") {
      if (e.key === " " && !practice.flipped) { e.preventDefault(); practiceAction("flip"); }
      else if (e.key === "1") practiceAction("again");
      else if (e.key === "2") practiceAction("know");
      else if (e.key.toLowerCase() === "l") practiceAction("say");
    }
  });

  /* ═════════════ Vistas ═════════════ */
  const VIEWS = ["learn", "practice", "play", "profile"];

  function showView(view) {
    if (!VIEWS.includes(view)) view = "learn";
    state.view = view;
    if (synth) synth.cancel();
    $$(".tab").forEach(t => { if (t.dataset.view === view) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current"); });
    $$(".view").forEach(v => { v.hidden = v.id !== "view-" + view; });
    if (view === "learn") { renderCards(); renderGoal(); }
    if (view === "practice") { buildDeck(); renderFlash(); }
    if (view === "play") renderPlay();
    if (view === "profile") renderProfile();
    if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
    window.scrollTo({ top: 0 });
  }
  $$(".tab").forEach(t => t.addEventListener("click", () => { if (t.dataset.view === "play") play.mode = "menu"; showView(t.dataset.view); }));
  $("#hud").addEventListener("click", () => showView("profile"));

  /* ═════════════ Inicio ═════════════ */
  applySettings();
  $("#hide-known").checked = !!state.hideKnown;
  renderChips();
  renderDaily();
  renderHUD();
  renderGoal();
  checkAchievements();
  showView((location.hash || "").slice(1));
  if (!store.get("hello", false)) {
    store.set("hello", true);
    setTimeout(() => toast('<span class="mono">tip</span><span>Pulsa <kbd>Ctrl</kbd>+<kbd>K</kbd> para la paleta de comandos</span>'), 1200);
  }
})();
