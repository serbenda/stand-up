/* stand-up · lógica (sin dependencias) */
(function () {
  "use strict";

  /* ═════════════ Datos ═════════════ */
  const ROUTES = window.ROUTES || [];
  const LESSONS = [];           // todas las lecciones, en orden
  const lessonById = {};
  ROUTES.forEach(route => route.units.forEach(unit => unit.lessons.forEach((lesson, i) => {
    lesson.id = `${unit.id}-${i + 1}`;
    lesson.num = i + 1;
    lesson.unit = unit;
    lesson.route = route;
    lesson.items.forEach((it, k) => { it.key = `${lesson.id}-${k}`; });
    LESSONS.push(lesson);
    lessonById[lesson.id] = lesson;
  })));
  const ALL_ITEMS = LESSONS.flatMap(l => l.items);

  /* ═════════════ Utilidades ═════════════ */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const tokens = s => s.split(/\s+/).map(w => w.replace(/[.,!?:]+$/, "")).filter(Boolean);
  const normTok = w => w.toLowerCase().replace(/[’]/g, "'");

  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>',
    chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    ear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 4.5 7v5c0 4.3 3.1 7.6 7.5 8.5 4.4-.9 7.5-4.2 7.5-8.5V7z"/></svg>'
  };

  /* ═════════════ Almacenamiento ═════════════ */
  const store = {
    get(k, f) { try { const v = localStorage.getItem("su2." + k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } },
    set(k, v) { try { localStorage.setItem("su2." + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  };

  const DEFAULTS = { theme: "light", font: "lexend", size: "m", spacing: "wide", accent: "en-GB", rate: 0.95, autoplay: true, highlight: true, ruler: false };
  const settings = Object.assign({}, DEFAULTS, store.get("settings", {}));
  const prog = Object.assign({ lessons: {}, seen: {}, xp: 0, log: {} }, store.get("progress", {}));
  const saveProg = () => store.set("progress", prog);

  const streak = () => {
    let n = 0; const d = new Date();
    if (!prog.log[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (prog.log[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  const learnedCount = () => ALL_ITEMS.filter(it => prog.seen[it.key]).length;
  const lessonDone = l => !!(prog.lessons[l.id] && prog.lessons[l.id].done);
  const nextLesson = () => LESSONS.find(l => !lessonDone(l)) || LESSONS[0];

  function renderStats() {
    $("#stats").innerHTML = `<b>${prog.xp}</b> xp · <b>${streak()}</b> ${streak() === 1 ? "día" : "días"} · <b>${learnedCount()}</b>/${ALL_ITEMS.length} frases`;
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
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
  const clearHighlight = () => { if (speakingEl) $$(".w.on", speakingEl).forEach(w => w.classList.remove("on")); speakingEl = null; };

  function speak(text, el, slow) {
    if (!synth) { toast("Este navegador no tiene voces"); return; }
    synth.cancel(); clearHighlight();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = settings.accent;
    const v = pickVoice(settings.accent); if (v) u.voice = v;
    u.rate = slow ? Math.max(0.5, settings.rate * 0.65) : settings.rate;
    if (el && settings.highlight) {
      speakingEl = el;
      const words = $$(".w", el);
      u.onboundary = e => {
        if (e.name && e.name !== "word") return;
        let cur = null;
        for (const w of words) { if (+w.dataset.s <= e.charIndex) cur = w; else break; }
        words.forEach(w => w.classList.toggle("on", w === cur));
      };
    }
    u.onend = u.onerror = clearHighlight;
    synth.speak(u);
  }

  function wordsHTML(text) {
    let out = "", m, last = 0; const re = /\S+/g;
    while ((m = re.exec(text))) { out += esc(text.slice(last, m.index)) + `<span class="w" data-s="${m.index}">${esc(m[0])}</span>`; last = m.index + m[0].length; }
    return out + esc(text.slice(last));
  }

  const audioBtns = (id, big) => `<button class="audio-btn${big ? " big" : ""}" data-say="${id}" aria-label="Escuchar">${ICON.play}</button>
    <button class="audio-btn slow" data-say-slow="${id}" aria-label="Escuchar despacio">0.6×</button>`;

  /* ═════════════ Ajustes ═════════════ */
  const root = document.documentElement;
  function applySettings() {
    ["theme", "font", "size", "spacing"].forEach(k => { root.dataset[k] = settings[k]; });
    $("#ruler").classList.toggle("on", !!settings.ruler);
    $("#rate-out").textContent = "×" + Number(settings.rate).toFixed(2);
    const m = $('meta[name="theme-color"]'); if (m) m.content = getComputedStyle(root).getPropertyValue("--bg").trim();
  }
  function setSetting(k, v) { settings[k] = v; store.set("settings", settings); applySettings(); }
  function syncSettingsForm() {
    const f = $("#settings form");
    ["theme", "font", "size", "spacing", "accent"].forEach(n => { const i = $(`input[name="${n}"][value="${settings[n]}"]`, f); if (i) i.checked = true; });
    f.rate.value = settings.rate;
    ["autoplay", "highlight", "ruler"].forEach(n => { f[n].checked = !!settings[n]; });
  }
  $("#settings form").addEventListener("input", e => {
    const t = e.target; if (!t.name) return;
    setSetting(t.name, t.type === "checkbox" ? t.checked : t.type === "range" ? parseFloat(t.value) : t.value);
  });
  const openSettings = () => { syncSettingsForm(); $("#settings").showModal(); };
  $("#open-settings").addEventListener("click", openSettings);
  document.addEventListener("pointermove", e => { if (settings.ruler) $("#ruler").style.top = e.clientY + "px"; }, { passive: true });

  /* ═════════════ Vistas ═════════════ */
  const app = $("#app");

  function routeProgress(route) {
    const ls = route.units.flatMap(u => u.lessons);
    return { done: ls.filter(lessonDone).length, total: ls.length };
  }

  function renderHome() {
    const nl = nextLesson();
    const started = Object.keys(prog.lessons).length > 0;
    app.innerHTML = `
      <section class="hero">
        <span class="label">Tech English · para hispanohablantes</span>
        <h1>El inglés que se habla en equipos técnicos.</h1>
        <p class="lead">Frases cortas y reales para dailies, Slack, reuniones, entrevistas e incidencias. Lecciones de tres minutos, con audio y sin registro.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/l/${nl.id}">${started ? "Continuar" : "Empezar"}: ${esc(nl.unit.title)} · ${esc(nl.title)} ${ICON.chev}</a>
          <a class="btn btn-ghost" href="#/r/${nl.route.id}">Ver la ruta</a>
        </div>
        <div class="facts">
          <span>${ICON.clock} 3 min por lección</span>
          <span>${ICON.ear} Audio en cada frase</span>
          <span>${ICON.eye} Pensada para leer con dislexia</span>
        </div>
      </section>

      <div class="section-head">
        <h2>¿Qué quieres conseguir?</h2>
        <span class="label">${ROUTES.length} rutas</span>
      </div>
      <div class="routes">
        ${ROUTES.map(r => {
          const live = r.units.length > 0;
          const p = routeProgress(r);
          const units = live ? r.units.map(u => u.title) : r.soon;
          const inner = `
            <div class="top-row"><span class="label">ruta ${r.code}</span>${live ? "" : '<span class="pill">próximamente</span>'}</div>
            <h3>${esc(r.title)}</h3>
            <p>${esc(r.desc)}</p>
            <ul>${units.map(u => `<li>${esc(u)}</li>`).join("")}</ul>
            ${live ? `<div class="foot-row"><div class="meter" aria-hidden="true"><span style="width:${p.total ? (p.done / p.total) * 100 : 0}%"></span></div><span class="meter-txt">${p.done}/${p.total} lecciones</span></div>` : ""}`;
          return live ? `<a class="route" href="#/r/${r.id}">${inner}</a>` : `<div class="route soon" aria-disabled="true">${inner}</div>`;
        }).join("")}
      </div>`;
  }

  function renderRoute(id) {
    const r = ROUTES.find(x => x.id === id);
    if (!r || !r.units.length) return renderHome();
    app.innerHTML = `
      <nav class="crumbs" aria-label="Migas"><a href="#/">Inicio</a><span aria-hidden="true">/</span><span>ruta ${r.code}</span></nav>
      <header class="route-head">
        <h1>${esc(r.title)}</h1>
        <p class="lead">${esc(r.desc)}</p>
      </header>
      <div class="units">
        ${r.units.map(u => `
          <section class="unit" aria-labelledby="u-${u.id}">
            <div class="unit-head">
              <div><h2 id="u-${u.id}">${esc(u.title)}</h2><p>${esc(u.desc)}</p></div>
              <span class="meter-txt">${u.lessons.filter(lessonDone).length}/${u.lessons.length}</span>
            </div>
            <ol class="lessons">
              ${u.lessons.map(l => {
                const pr = prog.lessons[l.id];
                return `<li class="lesson-row">
                  <span class="num">${String(l.num).padStart(2, "0")}</span>
                  <div><span class="t">${esc(l.title)}</span>
                    <span class="s"><span class="pill">${l.level}</span>${l.items.length} frases${pr && pr.done ? `<span class="done">✓ ${pr.best}/${pr.total}</span>` : ""}</span></div>
                  <a class="btn ${pr && pr.done ? "btn-ghost" : "btn-primary"}" href="#/l/${l.id}">${pr && pr.done ? "Repetir" : "Empezar"}</a>
                </li>`;
              }).join("")}
            </ol>
            <details class="phrasebook">
              <summary>${ICON.chev} Todas las frases de la unidad</summary>
              ${u.lessons.flatMap(l => l.items).map(it => phraseRow(it)).join("")}
            </details>
          </section>`).join("")}
      </div>`;
  }

  function phraseRow(it) {
    return `<div class="phrase" data-item="${it.key}">
      <button class="audio-btn" data-say="${it.key}" aria-label="Escuchar">${ICON.play}</button>
      <div><p class="en" lang="en">${wordsHTML(it.en)}</p><p class="es">${esc(it.es)}</p></div>
    </div>`;
  }

  const itemByKey = Object.fromEntries(ALL_ITEMS.map(it => [it.key, it]));

  // Audio en la portada, la ruta y el resumen
  app.addEventListener("click", e => {
    const b = e.target.closest("[data-say], [data-say-slow]");
    if (!b || L) return;
    const key = b.dataset.say || b.dataset.saySlow;
    const it = itemByKey[key];
    if (it) speak(it.en, b.closest(".phrase") && $(".en", b.closest(".phrase")), !!b.dataset.saySlow);
  });

  /* ═════════════ Lección ═════════════ */
  let L = null; // estado de la lección en curso

  function makeExercise(type, item, extra = {}) { return Object.assign({ type, item }, extra); }

  function buildQueue(lesson) {
    const items = lesson.items, q = [];
    const kinds = ["listen", "gap", "build"];
    items.forEach((it, k) => {
      if (!prog.seen[it.key]) q.push(makeExercise("intro", it));
      q.push(makeExercise(kinds[k % 3], it));
    });
    q.push(makeExercise("match", null, { items: shuffle(items).slice(0, 4) }));
    shuffle(items.filter((_, k) => k % 3 !== 2)).slice(0, 2).forEach(it => q.push(makeExercise("build", it)));
    if (lesson.scene) q.push(makeExercise("scene", null, { scene: lesson.scene }));
    return q;
  }

  function startLesson(id) {
    const lesson = lessonById[id];
    if (!lesson) return renderHome();
    L = { lesson, queue: buildQueue(lesson), pos: 0, graded: 0, correct: 0, missed: new Set(), state: null };
    document.body.classList.add("in-lesson");
    renderExercise();
  }

  function leaveLesson(to) {
    if (synth) synth.cancel();
    L = null;
    document.body.classList.remove("in-lesson");
    location.hash = to || "#/";
  }

  // Prepara opciones y estado de cada ejercicio la primera vez que se muestra
  function prepare(ex) {
    if (ex.ready) return;
    ex.ready = true;
    const it = ex.item, lesson = L.lesson;
    if (ex.type === "listen") {
      const trap = it.en.replace(new RegExp(`\\b${it.gap.replace(/[-]/g, "\\-")}\\b`), it.wrong[0]);
      const other = pick(lesson.items.filter(x => x !== it)).en;
      ex.options = shuffle([...new Set([it.en, trap, other])]);
      ex.answer = it.en;
    }
    if (ex.type === "gap") {
      ex.options = shuffle([it.gap, ...it.wrong.slice(0, 3)]);
      ex.answer = it.gap;
      const idx = tokens(it.en).indexOf(it.gap);
      const words = it.en.split(/\s+/);
      ex.before = words.slice(0, idx).join(" ");
      ex.after = words.slice(idx + 1).join(" ");
      ex.tail = words[idx].slice(it.gap.length); // puntuación pegada al hueco
    }
    if (ex.type === "build") {
      const target = tokens(it.en);
      const lowerSet = new Set(target.map(normTok));
      const decoys = shuffle(it.wrong.filter(w => !lowerSet.has(normTok(w)))).slice(0, 2);
      ex.target = target;
      ex.tiles = shuffle([...target, ...decoys]).map((w, i) => ({ w, i }));
      ex.picked = [];
    }
    if (ex.type === "match") {
      ex.left = shuffle(ex.items.map(x => x.key));
      ex.right = shuffle(ex.items.map(x => x.key));
      ex.done = new Set(); ex.sel = null; ex.mistakes = 0;
    }
    if (ex.type === "scene") {
      ex.order = shuffle(ex.scene.options.map((_, i) => i));
    }
    ex.choice = null;
  }

  const KIND = { intro: "Frase nueva", listen: "Escucha", gap: "Completa", build: "Traduce", match: "Empareja", scene: "Situación" };

  function renderExercise() {
    const ex = L.queue[L.pos];
    prepare(ex);
    L.state = "answer";
    const pct = Math.round((L.pos / L.queue.length) * 100);
    let body = "";
    const it = ex.item;

    if (ex.type === "intro") {
      body = `<div class="intro-card">
        <div class="prompt-row">${audioBtns("main", true)}</div>
        <p class="en" lang="en" id="main-text">${wordsHTML(it.en)}</p>
        <p class="es">${esc(it.es)}</p>
        ${it.note ? `<p class="note">${esc(it.note)}</p>` : ""}
      </div>`;
    }
    if (ex.type === "listen") {
      body = `<h1 class="ex-title">¿Qué has oído?</h1>
        <div class="prompt-row">${audioBtns("main", true)}</div>
        <div class="options" role="group" aria-label="Opciones">
          ${ex.options.map((o, i) => optionHTML(i, o, true)).join("")}
        </div>`;
    }
    if (ex.type === "gap") {
      body = `<h1 class="ex-title">Completa la frase</h1>
        <p class="gap-sentence" lang="en">${esc(ex.before)} <span class="gap" id="gap">${ex.choice !== null ? esc(ex.options[ex.choice]) : "&nbsp;"}</span>${esc(ex.tail)} ${esc(ex.after)}</p>
        <p class="prompt-es" style="margin-bottom:1.4rem">${esc(it.es)}</p>
        <div class="gap-grid" role="group" aria-label="Opciones">
          ${ex.options.map((o, i) => optionHTML(i, o, true)).join("")}
        </div>`;
    }
    if (ex.type === "build") {
      body = `<h1 class="ex-title">Tradúcelo al inglés</h1>
        <p class="prompt-text" style="margin-bottom:1.2rem">${esc(it.es)}</p>
        <div class="answer-line${ex.picked.length ? "" : " empty"}" id="answer-line" aria-label="Tu respuesta" lang="en">
          ${ex.picked.map(i => `<button class="tile" data-unpick="${i}">${esc(ex.tiles[i].w)}</button>`).join("")}
        </div>
        <div class="bank" role="group" aria-label="Palabras" lang="en">
          ${ex.tiles.map((t, i) => `<button class="tile${ex.picked.includes(i) ? " used" : ""}" data-pick="${i}" ${ex.picked.includes(i) ? 'tabindex="-1" aria-hidden="true"' : ""}>${esc(t.w)}</button>`).join("")}
        </div>`;
    }
    if (ex.type === "match") {
      const byKey = Object.fromEntries(ex.items.map(x => [x.key, x]));
      body = `<h1 class="ex-title">Empareja cada frase con su traducción</h1>
        <div class="match">
          <div class="col" lang="en">${ex.left.map(k => `<button class="option${ex.done.has(k) ? " done" : ""}${ex.sel && ex.sel.side === "l" && ex.sel.key === k ? '" aria-pressed="true' : ""}" data-ml="${k}" ${ex.done.has(k) ? "disabled" : ""}>${esc(byKey[k].en)}</button>`).join("")}</div>
          <div class="col">${ex.right.map(k => `<button class="option${ex.done.has(k) ? " done" : ""}${ex.sel && ex.sel.side === "r" && ex.sel.key === k ? '" aria-pressed="true' : ""}" data-mr="${k}" ${ex.done.has(k) ? "disabled" : ""}>${esc(byKey[k].es)}</button>`).join("")}</div>
        </div>`;
    }
    if (ex.type === "scene") {
      const s = ex.scene;
      body = `<h1 class="ex-title">¿Qué respondes?</h1>
        <div class="scene-msg">
          <span class="avatar" aria-hidden="true">${esc(s.who.slice(0, 2).toUpperCase())}</span>
          <div>
            <p class="who"><b>${esc(s.who)}</b> · ${esc(s.role)}</p>
            <div class="bubble"><button class="audio-btn" data-say="main" aria-label="Escuchar">${ICON.play}</button><p lang="en" id="main-text">${wordsHTML(s.text)}</p></div>
            <button class="btn btn-quiet" data-toggle-es style="min-height:40px;padding:0 .4rem;font-size:.8rem;margin-top:.2rem">Ver traducción</button>
            <p class="reveal-es" hidden>${esc(s.es)}</p>
          </div>
        </div>
        <div class="options" role="group" aria-label="Respuestas">
          ${ex.order.map((oi, i) => optionHTML(i, s.options[oi].en, true)).join("")}
        </div>`;
    }

    app.innerHTML = `
      <div class="lesson">
        <div class="lesson-bar">
          <button class="icon-btn" data-exit aria-label="Salir de la lección">${ICON.close}</button>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progreso de la lección"><span style="width:${pct}%"></span></div>
          <span class="count">${L.pos + 1}/${L.queue.length}</span>
        </div>
        <span class="label ex-kind">${KIND[ex.type]} · ${esc(L.lesson.unit.title)}</span>
        <div id="ex">${body}</div>
      </div>
      <div class="checkbar" id="checkbar"></div>`;

    renderCheckbar();
    if (settings.autoplay && (ex.type === "intro" || ex.type === "listen")) setTimeout(() => sayMain(false), 250);
    const first = $("#ex .option:not([disabled]), #ex .tile:not(.used), #checkbar .btn-primary");
    if (first) first.focus({ preventScroll: true });
  }

  function optionHTML(i, text, en) {
    const ex = L.queue[L.pos];
    return `<button class="option" data-opt="${i}" aria-pressed="${ex.choice === i}" ${en ? 'lang="en"' : ""}><span class="key" aria-hidden="true">${i + 1}</span><span>${esc(text)}</span></button>`;
  }

  function mainText(ex) {
    if (ex.type === "scene") return ex.scene.text;
    return ex.item ? ex.item.en : "";
  }

  function sayMain(slow) {
    if (!L) return; // la lección pudo terminar antes de que sonara
    const ex = L.queue[L.pos];
    speak(mainText(ex), $("#main-text") || $("#ex .gap-sentence"), slow);
  }

  function canCheck(ex) {
    if (ex.type === "build") return ex.picked.length > 0;
    if (ex.type === "match") return false;
    return ex.choice !== null;
  }

  function renderCheckbar() {
    const ex = L.queue[L.pos], bar = $("#checkbar");
    bar.className = "checkbar";
    if (L.state === "answer") {
      if (ex.type === "intro") {
        bar.innerHTML = `<div class="checkbar-inner"><span class="hint-keys">Escúchala tantas veces como quieras</span><button class="btn btn-primary" data-continue>Continuar</button></div>`;
        return;
      }
      if (ex.type === "match") {
        bar.innerHTML = `<div class="checkbar-inner"><span class="hint-keys">Elige una frase y luego su traducción</span><span></span></div>`;
        return;
      }
      const keys = ex.type === "build" ? "<kbd>⌫</kbd> borrar · <kbd>Enter</kbd> comprobar" : "<kbd>1</kbd>–<kbd>4</kbd> elegir · <kbd>Enter</kbd> comprobar";
      bar.innerHTML = `<div class="checkbar-inner">
        <button class="btn btn-quiet" data-skip>No lo sé</button>
        <span class="hint-keys">${keys}</span>
        <button class="btn btn-primary" data-check ${canCheck(ex) ? "" : "disabled"}>Comprobar</button>
      </div>`;
      return;
    }
    // Resultado
    const r = L.result;
    bar.classList.add(r.ok ? "ok" : "bad");
    bar.innerHTML = `<div class="checkbar-inner">
      <div class="verdict" role="status">
        <b>${r.ok ? ICON.check + " Correcto" : ICON.x + " Respuesta correcta:"}</b>
        ${!r.ok && r.answer ? `<p class="answer" lang="en">${esc(r.answer)}</p>` : ""}
        ${r.why ? `<p class="why">${esc(r.why)}</p>` : ""}
      </div>
      <button class="btn btn-primary" data-continue>Continuar</button>
    </div>`;
    $("#checkbar [data-continue]").focus({ preventScroll: true });
  }

  function check(skip) {
    const ex = L.queue[L.pos], it = ex.item;
    let ok = false, answer = "", why = "";
    if (ex.type === "listen") { ok = !skip && ex.options[ex.choice] === ex.answer; answer = it.en; why = ok ? "" : it.note || ""; }
    if (ex.type === "gap") {
      ok = !skip && ex.options[ex.choice] === ex.answer; answer = it.en;
      why = it.note || "";
      const g = $("#gap"); if (g) g.textContent = it.gap;
    }
    if (ex.type === "build") {
      const got = ex.picked.map(i => normTok(ex.tiles[i].w)).join(" ");
      ok = !skip && got === ex.target.map(normTok).join(" ");
      answer = it.en; why = ok ? "" : it.note || "";
    }
    if (ex.type === "scene") {
      const opt = skip ? ex.scene.options.find(o => o.ok) : ex.scene.options[ex.order[ex.choice]];
      ok = !skip && opt.ok;
      why = opt.why;
      if (!ok) { const good = ex.scene.options.find(o => o.ok); answer = good.en; if (skip) why = good.why; }
    }
    finishExercise(ok, answer, why);
    if (ex.type !== "scene" && it) setTimeout(() => speak(it.en, null, false), 150);
    // marcar opciones
    if (ex.type === "listen" || ex.type === "gap") {
      $$("#ex .option").forEach((b, i) => {
        b.disabled = true;
        if (ex.options[i] === ex.answer) b.classList.add("right");
        else if (i === ex.choice) b.classList.add("wrong");
      });
    }
    if (ex.type === "scene") {
      $$("#ex .option").forEach((b, i) => {
        b.disabled = true;
        const o = ex.scene.options[ex.order[i]];
        if (o.ok) b.classList.add("right"); else if (i === ex.choice) b.classList.add("wrong");
      });
    }
    if (ex.type === "build") $$("#ex .tile").forEach(t => { t.disabled = true; });
  }

  function finishExercise(ok, answer, why) {
    const ex = L.queue[L.pos];
    L.state = "checked";
    L.result = { ok, answer, why };
    if (!ex.retry) { L.graded++; if (ok) L.correct++; }
    if (!ok) {
      if (ex.item) L.missed.add(ex.item.key);
      if (!ex.retry) {
        const again = Object.assign({}, ex, { ready: false, retry: true });
        delete again.choice;
        L.queue.push(again);
      }
    }
    renderCheckbar();
  }

  function next() {
    const ex = L.queue[L.pos];
    if (ex.type === "intro") { prog.seen[ex.item.key] = true; saveProg(); }
    if (ex.type !== "intro" && ex.item) { prog.seen[ex.item.key] = true; }
    L.pos++;
    if (L.pos >= L.queue.length) return finishLesson();
    renderExercise();
  }

  function finishLesson() {
    const l = L.lesson;
    const xp = 10 + L.correct * 2;
    const prev = prog.lessons[l.id];
    prog.lessons[l.id] = { done: true, best: Math.max(prev ? prev.best : 0, L.correct), total: L.graded, at: dayKey() };
    l.items.forEach(it => { prog.seen[it.key] = true; });
    prog.xp += xp;
    prog.log[dayKey()] = (prog.log[dayKey()] || 0) + 1;
    saveProg();
    const missed = [...L.missed].map(k => itemByKey[k]).filter(Boolean);
    const idx = LESSONS.indexOf(l);
    const nl = LESSONS[idx + 1];
    const correct = L.correct, graded = L.graded;
    L = null;
    document.body.classList.remove("in-lesson");
    renderStats();

    const pct = graded ? Math.round((correct / graded) * 100) : 100;
    app.innerHTML = `
      <section class="summary">
        <span class="label">✓ lesson passed</span>
        <h1>${esc(l.title)}</h1>
        <div class="kpis">
          <div class="kpi"><span class="n">${correct}/${graded}</span><span class="l">Aciertos a la primera · ${pct}%</span></div>
          <div class="kpi"><span class="n">+${xp}</span><span class="l">XP</span></div>
          <div class="kpi"><span class="n">${l.items.length}</span><span class="l">Frases trabajadas</span></div>
        </div>
        ${missed.length ? `<div class="review-list"><h2>Para repasar</h2>${missed.map(phraseRow).join("")}</div>` : `<p class="muted">Sin fallos. Ni un conflicto en el merge.</p>`}
        <div class="summary-actions">
          ${nl ? `<a class="btn btn-primary" href="#/l/${nl.id}">Siguiente: ${esc(nl.title)} ${ICON.chev}</a>` : ""}
          <a class="btn btn-ghost" href="#/l/${l.id}" data-restart>Repetir</a>
          <a class="btn btn-quiet" href="#/r/${l.route.id}">Volver a la ruta</a>
        </div>
      </section>`;
    history.replaceState(null, "", `#/done/${l.id}`);
  }

  // Clics dentro de la lección
  app.addEventListener("click", e => {
    if (!L) return;
    const ex = L.queue[L.pos], t = e.target;
    if (t.closest("[data-exit]")) {
      if (L.pos === 0 || confirm("¿Salir de la lección? Se perderá lo que llevas.")) leaveLesson(`#/r/${L.lesson.route.id}`);
      return;
    }
    if (t.closest("[data-say]")) return sayMain(false);
    if (t.closest("[data-say-slow]")) return sayMain(true);
    if (t.closest("[data-toggle-es]")) { const r = $(".reveal-es"); r.hidden = !r.hidden; return; }
    if (t.closest("[data-continue]")) return next();
    if (t.closest("[data-check]")) return check(false);
    if (t.closest("[data-skip]")) return check(true);
    if (L.state !== "answer") return;

    const opt = t.closest("[data-opt]");
    if (opt) { choose(+opt.dataset.opt); return; }
    const pk = t.closest("[data-pick]");
    if (pk) { pickTile(+pk.dataset.pick); return; }
    const up = t.closest("[data-unpick]");
    if (up) { ex.picked = ex.picked.filter(i => i !== +up.dataset.unpick); refreshBuild(); return; }
    const ml = t.closest("[data-ml]"), mr = t.closest("[data-mr]");
    if (ml || mr) matchPick(ml ? "l" : "r", (ml || mr).dataset[ml ? "ml" : "mr"]);
  });

  function choose(i) {
    const ex = L.queue[L.pos];
    if (!ex.options && ex.type !== "scene") return;
    ex.choice = i;
    $$("#ex .option").forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
    if (ex.type === "gap") $("#gap").textContent = ex.options[i];
    renderCheckbar();
  }

  function pickTile(i) {
    const ex = L.queue[L.pos];
    if (ex.picked.includes(i)) return;
    ex.picked.push(i);
    refreshBuild();
  }

  function refreshBuild() {
    const ex = L.queue[L.pos];
    const line = $("#answer-line");
    line.classList.toggle("empty", !ex.picked.length);
    line.innerHTML = ex.picked.map(i => `<button class="tile" data-unpick="${i}">${esc(ex.tiles[i].w)}</button>`).join("");
    $$("#ex .bank .tile").forEach((b, i) => {
      const used = ex.picked.includes(i);
      b.classList.toggle("used", used);
      if (used) { b.setAttribute("tabindex", "-1"); b.setAttribute("aria-hidden", "true"); } else { b.removeAttribute("tabindex"); b.removeAttribute("aria-hidden"); }
    });
    const c = $("#checkbar [data-check]"); if (c) c.disabled = !canCheck(ex);
  }

  function matchPick(side, key) {
    const ex = L.queue[L.pos];
    if (ex.done.has(key)) return;
    const btn = $(`#ex [data-m${side}="${key}"]`);
    if (side === "l") speak(itemByKey[key].en, null, false);
    if (!ex.sel || ex.sel.side === side) {
      $$(`#ex [data-m${side}]`).forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      ex.sel = { side, key };
      return;
    }
    const other = $(`#ex [data-m${ex.sel.side}="${ex.sel.key}"]`);
    if (ex.sel.key === key) {
      ex.done.add(key);
      [btn, other].forEach(b => { b.classList.add("done"); b.disabled = true; b.setAttribute("aria-pressed", "false"); });
    } else {
      ex.mistakes++;
      [btn, other].forEach(b => { b.classList.add("shake"); b.setAttribute("aria-pressed", "false"); });
      setTimeout(() => [btn, other].forEach(b => b.classList.remove("shake")), 600);
    }
    ex.sel = null;
    if (ex.done.size === ex.items.length) {
      // Emparejar no se repite: cuenta como acierto y, si hubo fallos, se dice
      finishExercise(true, "", ex.mistakes ? `Emparejadas con ${ex.mistakes} ${ex.mistakes === 1 ? "fallo" : "fallos"}.` : "");
    }
  }

  /* ═════════════ Teclado ═════════════ */
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); return; }
    if (!L || e.target.closest("input, textarea, dialog") || e.ctrlKey || e.metaKey || e.altKey) return;
    const ex = L.queue[L.pos];
    if (e.key === "Enter") {
      const t = e.target;
      // Botones que no son de respuesta (salir, audio, traducción): comportamiento normal
      if (t.closest("[data-exit], [data-say], [data-say-slow], [data-toggle-es], [data-skip], [data-ml], [data-mr], [data-unpick]")) return;
      e.preventDefault();
      if (L.state === "checked" || ex.type === "intro") { next(); return; }
      const opt = t.closest("[data-opt]");
      if (opt && ex.choice !== +opt.dataset.opt) { choose(+opt.dataset.opt); return; }
      const pk = t.closest("[data-pick]");
      if (pk) { pickTile(+pk.dataset.pick); return; }
      if (canCheck(ex)) check(false);
      return;
    }
    if (L.state !== "answer") return;
    if (/^[1-9]$/.test(e.key)) {
      const n = +e.key - 1;
      if ((ex.type === "listen" || ex.type === "gap" || ex.type === "scene") && $$("#ex .option")[n]) { e.preventDefault(); choose(n); }
      if (ex.type === "build") {
        const free = ex.tiles.map((_, i) => i).filter(i => !ex.picked.includes(i));
        if (free[n] !== undefined) { e.preventDefault(); pickTile(free[n]); }
      }
    }
    if (e.key === "Backspace" && ex.type === "build" && ex.picked.length) { e.preventDefault(); ex.picked.pop(); refreshBuild(); }
    if (e.key.toLowerCase() === "r" && ex.type !== "match") sayMain(false);
  });

  /* ═════════════ Paleta de comandos ═════════════ */
  const COMMANDS = [
    { c: "continue", d: "Seguir con la siguiente lección" },
    { c: "home", d: "Ir a la portada" },
    ...ROUTES.filter(r => r.units.length).map(r => ({ c: `route ${r.id}`, d: r.title })),
    ...LESSONS.map(l => ({ c: `lesson ${l.id}`, d: `${l.unit.title} · ${l.title}` })),
    { c: "theme light", d: "Tema claro" },
    { c: "theme dark", d: "Tema oscuro" },
    { c: "settings", d: "Ajustes de lectura" },
    { c: "voice uk", d: "Voz británica" },
    { c: "voice us", d: "Voz americana" },
    { c: "say ", d: "Leer en voz alta lo que escribas" },
    { c: "whoami", d: "Tu progreso" }
  ];
  let palSel = 0, palItems = [];

  function openPalette() {
    const dlg = $("#palette"); if (dlg.open) return;
    $("#palette-input").value = ""; palSel = 0; renderPalette();
    dlg.showModal(); $("#palette-input").focus();
  }
  function renderPalette() {
    const raw = $("#palette-input").value, q = raw.trim().toLowerCase();
    palItems = q.startsWith("say ") && q.length > 4 ? [{ c: raw.trim(), d: "Leer en voz alta" }]
      : COMMANDS.filter(x => !q || x.c.includes(q) || x.d.toLowerCase().includes(q));
    palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
    $("#palette-list").innerHTML = palItems.length
      ? palItems.slice(0, 12).map((x, i) => `<li role="option" data-i="${i}" aria-selected="${i === palSel}"><span class="c">${esc(x.c)}</span><span class="d">${esc(x.d)}</span></li>`).join("")
      : `<li><span class="c">${esc(q)}</span><span class="d">command not found</span></li>`;
  }
  function runCommand(cmd) {
    const [verb, ...rest] = cmd.trim().split(/\s+/); const arg = rest.join(" ");
    $("#palette").close();
    switch ((verb || "").toLowerCase()) {
      case "continue": location.hash = `#/l/${nextLesson().id}`; break;
      case "home": if (L) leaveLesson("#/"); else location.hash = "#/"; break;
      case "route": location.hash = `#/r/${arg}`; break;
      case "lesson": location.hash = `#/l/${arg}`; break;
      case "theme": if (["light", "dark"].includes(arg)) { setSetting("theme", arg); toast(`theme → ${arg}`); } break;
      case "settings": openSettings(); break;
      case "voice": setSetting("accent", arg === "us" ? "en-US" : "en-GB"); toast(`voice → ${arg === "us" ? "en-US" : "en-GB"}`); break;
      case "say": if (arg) speak(cmd.trim().slice(4)); break;
      case "whoami": toast(`${prog.xp} xp · ${streak()} días · ${learnedCount()}/${ALL_ITEMS.length} frases`); break;
      default: if (verb) toast(`command not found: ${verb}`);
    }
  }
  $("#palette-input").addEventListener("input", () => { palSel = 0; renderPalette(); });
  $("#palette-input").addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); palSel = Math.min(palItems.length - 1, palSel + 1); renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); palSel = Math.max(0, palSel - 1); renderPalette(); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const sel = palItems[palSel];
      if (sel && sel.c === "say ") { $("#palette-input").value = "say "; renderPalette(); return; }
      runCommand(sel ? sel.c : $("#palette-input").value);
    }
  });
  $("#palette-list").addEventListener("click", e => {
    const li = e.target.closest("[data-i]"); if (!li) return;
    const item = palItems[+li.dataset.i];
    if (item.c === "say ") { $("#palette-input").value = "say "; $("#palette-input").focus(); renderPalette(); return; }
    runCommand(item.c);
  });
  $("#palette").addEventListener("click", e => { if (e.target === $("#palette")) $("#palette").close(); });
  $("#open-palette").addEventListener("click", openPalette);

  /* ═════════════ Router ═════════════ */
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [view, id] = h.split("/");
    if (view === "done") {
      if ($(".summary", app)) return; // el resumen ya está pintado
      location.replace(lessonById[id] ? `#/r/${lessonById[id].route.id}` : "#/");
      return;
    }
    if (L && view !== "l") { L = null; document.body.classList.remove("in-lesson"); if (synth) synth.cancel(); }
    renderStats();
    if (view === "l" && lessonById[id]) startLesson(id);
    else if (view === "r") renderRoute(id);
    else renderHome();
    window.scrollTo({ top: 0 });
    if (!L) app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);

  // «Repetir» desde el resumen apunta a la misma lección: forzamos el arranque
  app.addEventListener("click", e => {
    const r = e.target.closest("[data-restart]");
    if (r && location.hash === r.getAttribute("href")) { e.preventDefault(); route(); }
  });

  applySettings();
  route();
})();
