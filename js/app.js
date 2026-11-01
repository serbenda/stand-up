/* stand-up · lógica de la web (sin dependencias) */
(function () {
  "use strict";

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

  /* ───── Datos ───── */
  const hash = s => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  };
  const PHRASES = (window.PHRASES || []).map(p => ({ ...p, id: hash(p.en) }));
  const byId = Object.fromEntries(PHRASES.map(p => [p.id, p]));

  /* ───── Almacenamiento seguro ───── */
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
  const DEFAULTS = {
    font: "lexend", size: "m", spacing: "wide", theme: prefersDark ? "dark" : "cream",
    accent: "en-GB", rate: 0.95, ruler: false, highlight: true
  };
  const settings = Object.assign({}, DEFAULTS, store.get("settings", {}));
  const known = new Set(store.get("known", []));
  const state = Object.assign({ level: null, cat: null, q: "", hideKnown: false, view: "learn", dir: "en" }, store.get("filters", {}));

  const saveKnown = () => store.set("known", [...known]);
  const saveFilters = () => store.set("filters", { level: state.level, cat: state.cat, hideKnown: state.hideKnown, dir: state.dir });

  /* ───── Utilidades ───── */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Parte una frase en palabras con su posición, para resaltar mientras suena.
  function wordsHTML(text) {
    let out = "";
    const re = /\S+/g;
    let m, last = 0;
    while ((m = re.exec(text))) {
      out += esc(text.slice(last, m.index));
      out += `<span class="w" data-s="${m.index}">${esc(m[0])}</span>`;
      last = m.index + m[0].length;
    }
    return out + esc(text.slice(last));
  }

  /* ───── Voz ───── */
  const synth = window.speechSynthesis;
  let voices = [];
  function loadVoices() { voices = synth ? synth.getVoices() : []; }
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
    if (!synth) { alert("Tu navegador no tiene voces para leer en voz alta. Prueba con Chrome, Edge o Safari."); return; }
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
  }

  /* ───── Ajustes de lectura ───── */
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
  }

  $("#settings form").addEventListener("input", e => {
    const t = e.target;
    if (!t.name) return;
    if (t.type === "checkbox") settings[t.name] = t.checked;
    else if (t.type === "range") settings[t.name] = parseFloat(t.value);
    else settings[t.name] = t.value;
    store.set("settings", settings);
    applySettings();
  });

  $("#open-settings").addEventListener("click", () => { syncSettingsForm(); $("#settings").showModal(); });

  document.addEventListener("pointermove", e => {
    if (settings.ruler) ruler.style.top = e.clientY + "px";
  }, { passive: true });

  /* ───── Filtros ───── */
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

  $("#level-chips").addEventListener("click", e => {
    const b = e.target.closest("[data-level-btn]"); if (!b) return;
    state.level = b.dataset.levelBtn || null; saveFilters(); renderChips(); renderCards();
  });
  $("#cat-chips").addEventListener("click", e => {
    const b = e.target.closest("[data-cat-btn]"); if (!b) return;
    state.cat = b.dataset.catBtn || null; saveFilters(); renderChips(); renderCards();
  });
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

  /* ───── Tarjetas ───── */
  function cardHTML(p) {
    const isKnown = known.has(p.id);
    const cat = catById[p.c];
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

  function renderCards() {
    const list = filtered();
    const total = PHRASES.filter(matchesScope).length;
    const knownInScope = PHRASES.filter(p => matchesScope(p) && known.has(p.id)).length;
    $("#count").textContent = `${list.length} frase${list.length === 1 ? "" : "s"} · ya sabes ${knownInScope} de ${total}`;
    $("#cards").innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<p class="empty">No hay frases con estos filtros. ${state.hideKnown ? "¡Puede que ya te las sepas todas! 🎉" : "Prueba a quitar alguno."}</p>`;
  }

  $("#cards").addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const card = b.closest(".card");
    const p = byId[card.dataset.id];
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
        if (known.has(p.id)) known.delete(p.id); else known.add(p.id);
        saveKnown();
        const k = known.has(p.id);
        b.setAttribute("aria-pressed", String(k));
        b.textContent = k ? "✓ La sé" : "La sé";
        card.classList.toggle("is-known", k);
        if (state.hideKnown && k) renderCards(); else updateCount();
        break;
      }
    }
  });

  function updateCount() {
    const list = filtered();
    const total = PHRASES.filter(matchesScope).length;
    const knownInScope = PHRASES.filter(p => matchesScope(p) && known.has(p.id)).length;
    $("#count").textContent = `${list.length} frase${list.length === 1 ? "" : "s"} · ya sabes ${knownInScope} de ${total}`;
  }

  /* ───── Frase del día ───── */
  function renderDaily() {
    const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    const p = PHRASES[day % PHRASES.length];
    const el = $("#daily");
    el.dataset.id = p.id;
    el.innerHTML = `
      <p class="kicker">Frase del día · ${p.l} · ${catById[p.c].name}</p>
      <p class="en" lang="en">${wordsHTML(p.en)}</p>
      <p class="es" hidden>${esc(p.es)}</p>
      <div class="row">
        <button class="btn" data-act="say"><span aria-hidden="true">🔊</span> Escuchar</button>
        <button class="btn" data-act="slow"><span aria-hidden="true">🐢</span> Despacio</button>
        <button class="btn" data-act="reveal"><span aria-hidden="true">👀</span> Ver significado</button>
      </div>`;
  }
  $("#daily").addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const el = $("#daily"); const p = byId[el.dataset.id];
    if (b.dataset.act === "say") speak(p.en, $(".en", el), false);
    if (b.dataset.act === "slow") speak(p.en, $(".en", el), true);
    if (b.dataset.act === "reveal") { const es = $(".es", el); es.hidden = !es.hidden; }
  });

  /* ───── Practicar ───── */
  const practice = { deck: [], pos: 0, flipped: false, done: 0 };

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function buildDeck() {
    const scope = PHRASES.filter(matchesScope);
    const pending = shuffle(scope.filter(p => !known.has(p.id)));
    const deck = pending.length ? pending : shuffle(scope.slice());
    practice.deck = deck.slice(0, 20).map(p => p.id);
    practice.pos = 0; practice.flipped = false; practice.done = 0;
    const lvl = state.level ? `${state.level}` : "todos los niveles";
    const cat = state.cat ? catById[state.cat].name : "todos los temas";
    $("#practice-scope").textContent = `${lvl} · ${cat} · ${practice.deck.length} tarjetas${pending.length ? "" : " (repaso: ya las sabes todas)"}`;
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
      flash.innerHTML = `<p class="done">¡Ronda terminada! 🎉</p><p>Has marcado ${practice.done} como sabidas.</p>`;
      actions.innerHTML = `<button class="btn btn-primary" data-fa="restart">Otra ronda</button>`;
      return;
    }

    const p = byId[practice.deck[practice.pos]];
    const cat = catById[p.c];
    flash.dataset.level = p.l;
    const front = state.dir === "en"
      ? `<p class="big" lang="en">${wordsHTML(p.en)}</p>`
      : `<p class="big">${esc(p.es)}</p>`;
    const back = state.dir === "en"
      ? `<p class="es">${esc(p.es)}</p>`
      : `<p class="es" lang="en">${wordsHTML(p.en)}</p>`;

    flash.innerHTML = `
      <div class="meta">
        <span class="badge">${p.l}</span>
        <span class="tag"><span aria-hidden="true">${cat.icon}</span> ${cat.name}</span>
        <span class="progress-dots">${practice.pos + 1} / ${practice.deck.length}</span>
      </div>
      ${front}
      ${state.dir === "en" ? `<div class="row"><button class="btn btn-soft" data-fa="say">🔊 Escuchar</button><button class="btn btn-ghost" data-fa="slow">🐢 Despacio</button></div>` : ""}
      ${practice.flipped ? `<div class="answer">${back}
        <p class="ex" lang="en">${wordsHTML(p.ex)}</p>
        ${state.dir === "es" ? `<div class="row"><button class="btn btn-soft" data-fa="say">🔊 Escuchar</button><button class="btn btn-ghost" data-fa="slow">🐢 Despacio</button></div>` : ""}
        ${p.tip ? `<p class="tip">${esc(p.tip)}</p>` : ""}
      </div>` : ""}`;

    actions.innerHTML = practice.flipped
      ? `<button class="btn btn-ghost" data-fa="again">↺ Otra vez</button>
         <button class="btn btn-primary" data-fa="know">✓ ¡La sé!</button>`
      : `<button class="btn btn-primary" data-fa="flip">Dar la vuelta</button>`;
  }

  function practiceAction(act) {
    const id = practice.deck[practice.pos];
    const p = byId[id];
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
        known.add(id); saveKnown(); practice.done++;
        practice.pos++; practice.flipped = false; break;
      case "say": case "slow":
        if (state.dir === "es" && !practice.flipped) return; // no destripar la respuesta
        speak(p.en, $('#flash [lang="en"].big, #flash .es[lang="en"]'), act === "slow"); return;
      case "restart": buildDeck(); break;
    }
    renderFlash();
    if (act === "flip" || act === "again" || act === "know") {
      const target = practice.flipped ? $('#flash-actions [data-fa="know"]') : $('#flash-actions [data-fa="flip"]');
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

  document.addEventListener("keydown", e => {
    if (state.view !== "practice" || e.target.closest("input, textarea, dialog")) return;
    if (e.key === " " && !practice.flipped) { e.preventDefault(); practiceAction("flip"); }
    else if (e.key === "1") practiceAction("again");
    else if (e.key === "2") practiceAction("know");
    else if (e.key.toLowerCase() === "l") practiceAction("say");
  });

  /* ───── Progreso ───── */
  function barHTML(label, k, t, level) {
    const pct = t ? Math.round((k / t) * 100) : 0;
    return `<div class="bar-row" ${level ? `data-level="${level}"` : ""}>
      <div class="bar-top"><span>${label}</span><span class="muted">${k} / ${t}</span></div>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${t}" aria-valuenow="${k}" aria-label="${esc(label)}"><span style="width:${pct}%"></span></div>
    </div>`;
  }
  function renderProgress() {
    $("#prog-levels").innerHTML = LEVELS.map(l => {
      const all = PHRASES.filter(p => p.l === l.id);
      return barHTML(`${l.id} · ${l.name}`, all.filter(p => known.has(p.id)).length, all.length, l.id);
    }).join("");
    $("#prog-cats").innerHTML = CATS.map(c => {
      const all = PHRASES.filter(p => p.c === c.id);
      return barHTML(`${c.icon} ${c.name}`, all.filter(p => known.has(p.id)).length, all.length);
    }).join("");
  }
  $("#reset-progress").addEventListener("click", () => {
    if (!confirm("¿Seguro que quieres borrar tu progreso?")) return;
    known.clear(); saveKnown(); renderProgress(); renderCards();
  });

  /* ───── Vistas ───── */
  function showView(view) {
    state.view = view;
    if (synth) synth.cancel();
    $$(".tab").forEach(t => t.toggleAttribute("aria-current", t.dataset.view === view));
    $$(".tab").forEach(t => { if (t.dataset.view === view) t.setAttribute("aria-current", "page"); });
    $$(".view").forEach(v => { v.hidden = v.id !== "view-" + view; });
    if (view === "learn") renderCards();
    if (view === "practice") { buildDeck(); renderFlash(); }
    if (view === "progress") renderProgress();
    if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
    window.scrollTo({ top: 0 });
  }
  $$(".tab").forEach(t => t.addEventListener("click", () => showView(t.dataset.view)));

  /* ───── Inicio ───── */
  applySettings();
  $("#hide-known").checked = !!state.hideKnown;
  renderChips();
  renderDaily();
  const initial = (location.hash || "").slice(1);
  showView(["learn", "practice", "progress"].includes(initial) ? initial : "learn");
})();
