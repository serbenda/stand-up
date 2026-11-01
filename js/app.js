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

  const DEFAULTS = { theme: "dark", font: "lexend", size: "m", spacing: "wide", accent: "en-GB", voiceMode: "recorded", voiceName: "", rate: 0.95, autoplay: true, highlight: true, ruler: false };
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
  const voiceWaiters = [];
  const loadVoices = () => {
    voices = synth ? synth.getVoices() : [];
    if (voices.length) { voiceWaiters.splice(0).forEach(fn => fn()); refreshVoiceSelect(); }
  };
  if (synth) { synth.addEventListener ? synth.addEventListener("voiceschanged", loadVoices) : (synth.onvoiceschanged = loadVoices); }

  // Las voces llegan tarde en Chrome: esperamos un poco antes de hablar
  const voicesReady = () => new Promise(res => {
    if (voices.length) return res();
    voiceWaiters.push(res);
    setTimeout(res, 1500);
  });

  // Voces de efectos de macOS y similares: nunca para enseñar inglés
  const NOVELTY = /^(albert|bahh|bells|boing|bubbles|cellos|good news|bad news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|ralph|kathy|grandma|grandpa|rocko|shelley|sandy|flo|eddy|reed|burbujas|campanas|buenas noticias|malas noticias|buf[oó]n|[oó]rgano|superestrella|susurro|violonchelos)\b/i;

  // Orden de preferencia: voces naturales en la nube, luego las mejores del sistema
  const PREFERRED = {
    "en-GB": [/sonia.*natural|libby.*natural|ryan.*natural|natural.*united kingdom/i, /google uk english female/i, /google uk english male/i, /daniel.*(premium|enhanced|mejorada)/i, /serena|kate|arthur|martha|stephanie/i, /^daniel/i],
    "en-US": [/aria.*natural|jenny.*natural|guy.*natural|ava.*natural|andrew.*natural|natural.*united states/i, /google us english/i, /(ava|zoe|evan|nathan|allison|samantha).*(premium|enhanced|mejorada)/i, /^ava\b|^allison|^tom\b|^nathan|^zoe|^evan/i, /^samantha/i, /^alex\b/i]
  };

  const englishVoices = () => voices.filter(v => /^en[-_]/i.test(v.lang || "") && !NOVELTY.test(v.name));

  function rankVoice(v, lang) {
    const prefs = PREFERRED[lang] || [];
    const i = prefs.findIndex(re => re.test(v.name));
    let score = i === -1 ? 50 : i;
    if (v.lang.replace("_", "-").toLowerCase() !== lang.toLowerCase()) score += 20;
    if (/natural|neural|premium|enhanced|mejorada/i.test(v.name)) score -= 5;
    return score;
  }

  function pickVoice(lang) {
    const en = englishVoices();
    if (settings.voiceName) { const chosen = en.find(v => v.name === settings.voiceName); if (chosen) return chosen; }
    return en.slice().sort((a, b) => rankVoice(a, lang) - rankVoice(b, lang))[0] || null;
  }

  if (synth) loadVoices(); // después de definir todo lo que usa

  let speakingEl = null;
  const clearHighlight = () => { if (speakingEl) $$(".w.on", speakingEl).forEach(w => w.classList.remove("on")); speakingEl = null; };
  let warnedNoVoice = false;

  /* ── Grabaciones (voz neuronal pregenerada) ──
     Cada texto tiene un mp3 por acento en audio/us y audio/gb, con nombre = hash del texto.
     Si no hay grabación para un texto (por ejemplo, tu daily), se usa la voz del navegador. */
  const audioHash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
  const AUDIO_KEYS = new Set(window.AUDIO_KEYS || []);
  const player = new Audio();
  player.preload = "auto";
  let playTicket = 0, rafId = 0;

  const accentDir = () => (settings.accent === "en-US" ? "us" : "gb");
  const audioUrl = text => {
    const key = audioHash(text.trim());
    return AUDIO_KEYS.has(key) ? `audio/${accentDir()}/${key}.mp3` : null;
  };
  const preloaded = new Set();
  function preloadAudio(text) {
    const url = settings.voiceMode !== "browser" && text && audioUrl(text);
    if (!url || preloaded.has(url)) return;
    preloaded.add(url);
    const a = new Audio(); a.preload = "auto"; a.src = url;
  }

  function stopAudio() {
    playTicket++;
    cancelAnimationFrame(rafId);
    try { player.pause(); } catch (e) { /* nada */ }
    if (synth) synth.cancel();
    clearHighlight();
  }

  // Sin eventos de palabra en un mp3: resaltamos según la posición en el audio, en proporción a los caracteres
  function followWords(el, text) {
    const words = $$(".w", el);
    if (!words.length) return;
    const total = text.length;
    const tick = () => {
      if (player.paused || !player.duration) return;
      const pos = Math.min(total, (player.currentTime / player.duration) * total * 1.04);
      let cur = null;
      for (const w of words) { if (+w.dataset.s <= pos) cur = w; else break; }
      words.forEach(w => w.classList.toggle("on", w === cur));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  async function speak(text, el, slow) {
    stopAudio();
    const ticket = playTicket;
    const url = settings.voiceMode !== "browser" && audioUrl(text);
    if (url) {
      try {
        if (!player.src.endsWith(url)) player.src = url;
        player.currentTime = 0;
        player.preservesPitch = true;
        player.playbackRate = (settings.rate / 0.95) * (slow ? 0.78 : 1);
        if (el && settings.highlight) { speakingEl = el; player.onplaying = () => { if (ticket === playTicket) followWords(el, text); }; }
        player.onended = () => { cancelAnimationFrame(rafId); clearHighlight(); };
        await player.play();
        return;
      } catch (err) {
        if (ticket !== playTicket || (err && err.name === "AbortError")) return;
        // si falla la grabación, seguimos con la voz del navegador
      }
    }
    if (!synth) { toast("Este navegador no tiene voces"); return; }
    await voicesReady();
    if (ticket !== playTicket) return;
    const v = pickVoice(settings.accent);
    if (!v && !warnedNoVoice) { warnedNoVoice = true; toast("No hay voz en inglés instalada: mira Ajustes de lectura → Voz"); }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = v ? v.lang : settings.accent;
    if (v) u.voice = v;
    u.rate = slow ? Math.max(0.55, settings.rate * 0.75) : settings.rate;
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
    <button class="audio-btn slow" data-say-slow="${id}" aria-label="Escuchar despacio">0.75×</button>`;

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
    ["theme", "font", "size", "spacing", "accent", "voiceMode"].forEach(n => { const i = $(`input[name="${n}"][value="${settings[n]}"]`, f); if (i) i.checked = true; });
    f.rate.value = settings.rate;
    ["autoplay", "highlight", "ruler"].forEach(n => { f[n].checked = !!settings[n]; });
    refreshVoiceSelect();
  }
  $("#settings form").addEventListener("input", e => {
    const t = e.target; if (!t.name) return;
    setSetting(t.name, t.type === "checkbox" ? t.checked : t.type === "range" ? parseFloat(t.value) : t.value);
    if (t.name === "accent") refreshVoiceSelect();
  });

  // Selector de voz: «Automática» o cualquier voz inglesa instalada (sin las de efectos)
  function refreshVoiceSelect() {
    const sel = document.getElementById("voice-select");
    if (!sel) return;
    const en = englishVoices().sort((a, b) => rankVoice(a, settings.accent) - rankVoice(b, settings.accent));
    const auto = pickVoice(settings.accent);
    const current = settings.voiceName && en.some(v => v.name === settings.voiceName) ? settings.voiceName : "";
    sel.innerHTML = `<option value="">Automática${auto && !settings.voiceName ? ` (${esc(auto.name)})` : ""}</option>` +
      en.map(v => `<option value="${esc(v.name)}" ${v.name === current ? "selected" : ""}>${esc(v.name)} · ${esc(v.lang)}</option>`).join("");
    const hint = document.getElementById("voice-hint");
    if (hint) hint.hidden = en.some(v => /natural|google|premium|enhanced|mejorada/i.test(v.name));
  }
  document.getElementById("voice-select").addEventListener("change", e => { setSetting("voiceName", e.target.value); });
  // «Probar» siempre usa la voz del navegador elegida, que es lo que se está configurando
  document.getElementById("voice-test").addEventListener("click", () => {
    const mode = settings.voiceMode; settings.voiceMode = "browser";
    speak("Quick update: the cache is in the queue. Let's take it offline.", null, false);
    settings.voiceMode = mode;
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
      <div class="hero-grid">
      <section class="hero">
        <span class="label mono">while (!fluent) { practice(); }</span>
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
      <div class="shell" aria-hidden="true">
        <div class="shell-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="shell-title">bendi@stand-up: ~</span></div>
        <pre class="shell-body" id="shell"></pre>
      </div>
      </div>

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
      </div>

      <div class="section-head">
        <h2>Herramientas para el día a día</h2>
        <span class="label">úsalas ya</span>
      </div>
      <div class="routes tools">
        <a class="route" href="#/say">
          <div class="top-row"><span class="label mono">$ say nginx</span></div>
          <h3>Pronuncia bien los términos técnicos</h3>
          <p>Cache, nginx, Azure, queue, deploy… ${TERMS.length} términos con audio y cómo se dicen de verdad.</p>
        </a>
        <a class="route" href="#/daily">
          <div class="top-row"><span class="label mono">$ standup --build</span></div>
          <h3>Prepara tu daily</h3>
          <p>Elige qué hiciste ayer, qué harás hoy y tus bloqueos. Te lo montamos en inglés, listo para leer en voz alta.</p>
        </a>
        <a class="route" href="#/cheats">
          <div class="top-row"><span class="label mono">$ cat cheatsheet.md</span></div>
          <h3>Chuletas para copiar</h3>
          <p>Comentarios de PR, Slack, correos, reuniones e incidencias. Copiar, pegar y listo.</p>
        </a>
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

  /* ═════════════ Terminal animada de la portada ═════════════ */
  const SESSIONS = [
    { cmd: "standup --today", out: [["", "Yesterday I fixed the bug."], ["", "Today I'm on the pipeline."], ["", "No blockers."], ["ok", "✓ daily done in 27s"]] },
    { cmd: 'grep -i "actually" mistakes.log', out: [["bad", "- actually = actualmente"], ["ok", "+ actually = en realidad"], ["dim", "1 false friend fixed"]] },
    { cmd: 'git commit -m "fix: said it in English"', out: [["dim", "[main 4f2a1c9] fix: said it in English"], ["dim", " 1 meeting changed, 0 «I'm agree» left"]] },
    { cmd: 'say --slow "Let\'s take it offline."', out: [["", "▶ Let's · take · it · offline."], ["dim", "hint: no tiene nada que ver con internet"]] },
    { cmd: "curl -I https://my-english", out: [["ok", "HTTP/1.1 200 OK"], ["dim", "X-Accent: feature, not a bug"]] }
  ];
  let shellTimers = [];
  const stopShell = () => { shellTimers.forEach(clearTimeout); shellTimers = []; };

  function runShell() {
    stopShell();
    const el = $("#shell");
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const line = (cls, text) => `<span class="${cls || "out"}">${esc(text)}</span>\n`;
    const prompt = cmd => `<span class="ps1">$</span> <span class="cmd">${esc(cmd)}</span>`;
    if (reduce) {
      const s = SESSIONS[0];
      el.innerHTML = prompt(s.cmd) + "\n" + s.out.map(([c, t]) => line(c, t)).join("");
      return;
    }
    let si = Math.floor(Math.random() * SESSIONS.length);
    const at = (ms, fn) => shellTimers.push(setTimeout(fn, ms));
    const play = () => {
      const s = SESSIONS[si % SESSIONS.length]; si++;
      let t = 0, typed = "";
      el.innerHTML = prompt("") + '<span class="caret"></span>';
      for (const ch of s.cmd) {
        t += 38 + Math.random() * 40;
        at(t, () => { typed += ch; el.innerHTML = prompt(typed) + '<span class="caret"></span>'; });
      }
      t += 350;
      let out = "";
      at(t, () => { el.innerHTML = prompt(s.cmd) + "\n"; });
      s.out.forEach(([c, txt]) => { t += 420; at(t, () => { out += line(c, txt); el.innerHTML = prompt(s.cmd) + "\n" + out + '<span class="ps1">$</span> <span class="caret"></span>'; }); });
      t += 2600;
      at(t, play);
    };
    play();
  }

  /* ═════════════ fortune, man y 404 ═════════════ */
  const FORTUNES = [
    "while (!fluent) { practice(); }",
    "Your accent is not a bug. It's a feature.",
    "It works on my machine. Now say it in English.",
    "git commit -m \"said «Let's take it offline» in a real meeting\"",
    "// TODO: stop saying «I'm agree»",
    "There's no place like 127.0.0.1",
    "404: excuse not found. Practice today.",
    "Ship it. Then explain it in English.",
    "LGTM is a full sentence.",
    "Cache is pronounced «cash». Invalidate your old habits.",
    "sudo make me fluent → Permission denied. Try: practice --daily",
    "Fluency is eventual consistency."
  ];
  const fortune = () => FORTUNES[Math.floor(Math.random() * FORTUNES.length)];

  function renderMan() {
    app.innerHTML = `
      <article class="man">
        <header class="man-head mono"><span>STAND-UP(1)</span><span>Tech English Manual</span><span>STAND-UP(1)</span></header>
        <h2 class="mono">NAME</h2>
        <p><b class="mono">stand-up</b> — inglés para trabajar en equipos técnicos, para hispanohablantes.</p>
        <h2 class="mono">SYNOPSIS</h2>
        <p class="mono">stand-up [--learn | --say | --daily | --cheats] [--slow] [--theme dark|light]</p>
        <h2 class="mono">DESCRIPTION</h2>
        <p>Frases cortas y reales para dailies, Slack, reuniones, entrevistas e incidencias. Lecciones de tres minutos con audio. Las opciones falsas son errores típicos de hispanohablantes, y cada fallo explica el porqué.</p>
        <h2 class="mono">COMMANDS</h2>
        <dl class="man-dl">
          <dt class="mono"><a href="#/">learn</a></dt><dd>Rutas y lecciones al estilo Duolingo.</dd>
          <dt class="mono"><a href="#/say">say</a></dt><dd>Pronunciación de ${TERMS.length} términos técnicos.</dd>
          <dt class="mono"><a href="#/daily">daily</a></dt><dd>Prepara tu stand-up en inglés.</dd>
          <dt class="mono"><a href="#/cheats">cheats</a></dt><dd>Frases para copiar y pegar.</dd>
        </dl>
        <h2 class="mono">KEYS</h2>
        <dl class="man-dl">
          <dt><kbd>1</kbd>–<kbd>4</kbd></dt><dd>Elegir opción.</dd>
          <dt><kbd>Enter</kbd></dt><dd>Comprobar y continuar.</dd>
          <dt><kbd>⌫</kbd></dt><dd>Quitar la última ficha.</dd>
          <dt><kbd>R</kbd></dt><dd>Repetir el audio.</dd>
          <dt><kbd>Ctrl</kbd> <kbd>K</kbd></dt><dd>Paleta de comandos.</dd>
        </dl>
        <h2 class="mono">BUGS</h2>
        <p>Tu acento no es un bug. Las frases suenan con grabaciones de voz neuronal (Kokoro, Apache 2.0); los textos sin grabación usan la voz de tu navegador. Errores y frases nuevas, en <a href="https://github.com/serbenda/stand-up/issues">GitHub Issues</a>.</p>
        <h2 class="mono">AUTHOR</h2>
        <p><a href="https://bendi.dev">Bendi</a>.</p>
        <h2 class="mono">SEE ALSO</h2>
        <p class="mono">git(1), ssh(1), coffee(1)</p>
      </article>`;
  }

  function render404(path) {
    app.innerHTML = `
      <section class="notfound">
        <pre class="mono" aria-hidden="true">$ cd ${esc(path || "?")}
cd: no such file or directory</pre>
        <h1>404 · phrase not found</h1>
        <p class="lead">Esta página no existe. Las frases sí: vuelve a la portada y sigue practicando.</p>
        <a class="btn btn-primary" href="#/">cd ~</a>
      </section>`;
  }

  /* ═════════════ Herramientas ═════════════ */
  const TERMS = window.TERMS || [], TERM_CATS = window.TERM_CATS || [];
  const DAILY = window.DAILY || { yesterday: [], today: [], blockers: [] };
  const CHEATS = window.CHEATS || [];

  // Botones genéricos de audio y copiar: data-speak="texto", data-slow, data-copy="texto"
  app.addEventListener("click", e => {
    if (L) return;
    const sp = e.target.closest("[data-speak]");
    if (sp) { const host = sp.closest("[data-speak-host]"); speak(sp.dataset.speak, host && $(".speak-target", host), sp.hasAttribute("data-slow")); return; }
    const cp = e.target.closest("[data-copy]");
    if (cp) copyText(cp.dataset.copy, cp);
  });

  async function copyText(text, btn) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; }
    catch (err) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); ok = document.execCommand("copy"); ta.remove();
      } catch (e2) { ok = false; }
    }
    toast(ok ? "✓ copiado" : "No se pudo copiar: selecciona el texto a mano");
    if (ok && btn) { const old = btn.innerHTML; btn.innerHTML = ICON.check; setTimeout(() => { btn.innerHTML = old; }, 1200); }
  }

  const speakBtns = (text, big) => `<button class="audio-btn${big ? " big" : ""}" data-speak="${esc(text)}" aria-label="Escuchar">${ICON.play}</button>
    <button class="audio-btn slow" data-speak="${esc(text)}" data-slow aria-label="Escuchar despacio">0.75×</button>`;

  /* ── Pronunciación ── */
  const sayState = { cat: null, q: "" };

  function renderSay() {
    app.innerHTML = `
      <nav class="crumbs" aria-label="Migas"><a href="#/">Inicio</a><span aria-hidden="true">/</span><span>pronunciación</span></nav>
      <header class="route-head">
        <span class="label mono">$ say --correctly</span>
        <h1>Pronuncia bien los términos técnicos</h1>
        <p class="lead">Palabras que se dicen mal durante años porque nadie te corrige. La sílaba fuerte va en MAYÚSCULAS y la pronunciación es aproximada, para leer «a la española».</p>
      </header>
      <div class="toolbar">
        <div class="seg" role="group" aria-label="Categoría">
          <button class="opt" data-term-cat="" aria-pressed="${!sayState.cat}">Todos</button>
          ${TERM_CATS.map(c => `<button class="opt" data-term-cat="${c.id}" aria-pressed="${sayState.cat === c.id}">${esc(c.name)}</button>`).join("")}
        </div>
        <div class="search-box"><span class="mono prompt" aria-hidden="true">grep</span><input id="term-search" type="search" placeholder="cache, deploy…" value="${esc(sayState.q)}" aria-label="Buscar término" autocomplete="off"></div>
      </div>
      <div class="terms" id="terms"></div>`;
    renderTerms();
  }

  function renderTerms() {
    const q = sayState.q.trim().toLowerCase();
    const list = TERMS.filter(t => (!sayState.cat || t.cat === sayState.cat) && (!q || t.term.toLowerCase().includes(q)));
    $("#terms").innerHTML = list.length ? list.map(t => `
      <article class="term" data-speak-host>
        <div class="term-head">
          <h3 class="speak-target" lang="en">${esc(t.term)}</h3>
          <div class="term-audio">${speakBtns(t.say || t.term)}</div>
        </div>
        <p class="sounds"><span class="label">suena</span> ${esc(t.sounds)}</p>
        ${t.wrong ? `<p class="wrong-say"><span class="label">no</span> ${esc(t.wrong)}</p>` : ""}
        ${t.note ? `<p class="term-note">${esc(t.note)}</p>` : ""}
      </article>`).join("") : `<p class="muted">Sin resultados. ¿Echas uno de menos? Propónlo en GitHub.</p>`;
  }

  app.addEventListener("click", e => {
    const c = e.target.closest("[data-term-cat]");
    if (!c) return;
    sayState.cat = c.dataset.termCat || null;
    $$("[data-term-cat]").forEach(b => b.setAttribute("aria-pressed", String((b.dataset.termCat || null) === sayState.cat)));
    renderTerms();
  });
  app.addEventListener("input", e => {
    if (e.target.id === "term-search") { sayState.q = e.target.value; renderTerms(); }
    if (e.target.id === "cheat-search") { cheatState.q = e.target.value; renderCheatList(); }
    if (e.target.dataset.role === "blank" && e.target.closest("[data-daily-line]")) dailyInput(e.target);
  });

  /* ── Constructor de daily ── */
  const SECTIONS = [
    { id: "yesterday", title: "Ayer", lead: "Yesterday, " },
    { id: "today", title: "Hoy", lead: "Today, " },
    { id: "blockers", title: "Bloqueos", lead: "" }
  ];
  const daily = Object.assign({
    yesterday: [{ t: 0, v: [] }],
    today: [{ t: 0, v: [] }],
    blockers: [{ t: 0, v: [] }]
  }, store.get("daily", {}));
  const saveDaily = () => store.set("daily", daily);

  const blanks = tpl => (tpl.match(/…/g) || []).length;

  function fill(tpl, values, forDisplay) {
    let i = 0;
    let s = tpl.replace(/…/g, () => {
      const v = (values[i++] || "").trim().replace(/[.!?]+$/, "");
      return v ? (forDisplay ? `\u0001${v}\u0002` : v) : (forDisplay ? "\u0003" : "___");
    });
    if (!/[.!?]$/.test(s)) s += ".";
    return s;
  }

  const addAlso = s => s.replace(/^I'll /, "I'll also ").replace(/^I'm /, "I'm also ").replace(/^I /, "I also ");

  function composeDaily(forDisplay) {
    const out = ["Quick update."];
    SECTIONS.forEach(sec => {
      daily[sec.id].forEach((line, i) => {
        const tpl = DAILY[sec.id][line.t];
        if (!tpl) return;
        let s = fill(tpl, line.v, forDisplay);
        if (i > 0 && sec.id !== "blockers") s = addAlso(s);
        if (i === 0 && sec.lead && !/today|yesterday/i.test(s)) s = sec.lead + s;
        out.push(s);
      });
    });
    out.push("That's it from me.");
    return out.join(" ");
  }

  function scriptHTML() {
    return esc(composeDaily(true))
      .replace(/\u0001/g, '<mark class="filled">').replace(/\u0002/g, "</mark>")
      .replace(/\u0003/g, '<mark class="blank">___</mark>');
  }

  function renderDailyBuilder() {
    app.innerHTML = `
      <nav class="crumbs" aria-label="Migas"><a href="#/">Inicio</a><span aria-hidden="true">/</span><span>mi daily</span></nav>
      <header class="route-head">
        <span class="label mono">$ standup --build</span>
        <h1>Prepara tu daily en inglés</h1>
        <p class="lead">Elige una frase para cada parte y completa los huecos con el nombre de tu tarea, tal cual: «the Terraform module», «Ana's PR», «the DNS issue». Se guarda en este navegador para mañana.</p>
      </header>
      <div class="daily-grid">
        <div class="daily-form">
          ${SECTIONS.map(sec => `
            <section class="daily-sec" aria-labelledby="ds-${sec.id}">
              <h2 id="ds-${sec.id}">${sec.title}</h2>
              <div id="lines-${sec.id}">${daily[sec.id].map((line, i) => lineHTML(sec.id, line, i)).join("")}</div>
              <button class="btn btn-quiet" data-add-line="${sec.id}">+ Añadir otra</button>
            </section>`).join("")}
        </div>
        <aside class="daily-out" aria-labelledby="out-title" data-speak-host>
          <span class="label" id="out-title">tu daily</span>
          <p class="script speak-target" lang="en" id="script">${scriptHTML()}</p>
          <div class="out-actions">
            <button class="btn btn-primary" data-daily-say>${ICON.play} Escuchar</button>
            <button class="btn btn-ghost" data-daily-say data-slow>Despacio</button>
            <button class="btn btn-ghost" data-daily-copy>Copiar</button>
          </div>
          <p class="hint-keys">Léelo en voz alta dos o tres veces antes de la reunión. Con eso basta.</p>
        </aside>
      </div>`;
  }

  function lineHTML(sec, line, i) {
    const tpl = DAILY[sec][line.t] || DAILY[sec][0];
    const n = blanks(tpl);
    return `<div class="daily-line" data-daily-line data-sec="${sec}" data-i="${i}">
      <select aria-label="Frase" data-role="tpl" lang="en">
        ${DAILY[sec].map((t, k) => `<option value="${k}" ${k === line.t ? "selected" : ""}>${esc(t)}</option>`).join("")}
      </select>
      ${Array.from({ length: n }, (_, k) => `<input type="text" data-role="blank" data-k="${k}" lang="en" value="${esc(line.v[k] || "")}" placeholder="${k === 0 ? "the Terraform module" : "the DNS issue"}" aria-label="Hueco ${k + 1}" autocomplete="off" spellcheck="true">`).join("")}
      ${daily[sec].length > 1 ? `<button class="icon-btn" data-remove-line aria-label="Quitar esta frase">${ICON.close}</button>` : ""}
    </div>`;
  }

  function dailyInput(el) {
    const row = el.closest("[data-daily-line]");
    const sec = row.dataset.sec, i = +row.dataset.i;
    const line = daily[sec][i];
    if (el.dataset.role === "tpl") {
      line.t = +el.value;
      line.v = line.v.slice(0, blanks(DAILY[sec][line.t]));
      row.outerHTML = lineHTML(sec, line, i);
      const again = $(`[data-daily-line][data-sec="${sec}"][data-i="${i}"] input`);
      if (again) again.focus();
    } else {
      line.v[+el.dataset.k] = el.value;
    }
    saveDaily();
    $("#script").innerHTML = scriptHTML();
  }

  app.addEventListener("change", e => { if (e.target.dataset.role === "tpl") dailyInput(e.target); });

  app.addEventListener("click", e => {
    const add = e.target.closest("[data-add-line]");
    if (add) {
      const sec = add.dataset.addLine;
      daily[sec].push({ t: Math.min(1, DAILY[sec].length - 1), v: [] });
      saveDaily(); renderDailyBuilder();
      const last = $$(`[data-daily-line][data-sec="${sec}"] select`).pop(); if (last) last.focus();
      return;
    }
    const rm = e.target.closest("[data-remove-line]");
    if (rm) {
      const row = rm.closest("[data-daily-line]");
      daily[row.dataset.sec].splice(+row.dataset.i, 1);
      saveDaily(); renderDailyBuilder();
      return;
    }
    const ds = e.target.closest("[data-daily-say]");
    if (ds) { speak(composeDaily(false).replace(/___/g, "something"), null, ds.hasAttribute("data-slow")); return; }
    if (e.target.closest("[data-daily-copy]")) copyText(composeDaily(false), e.target.closest("[data-daily-copy]"));
  });

  /* ── Chuletas ── */
  const cheatState = { q: "" };

  function renderCheats() {
    app.innerHTML = `
      <nav class="crumbs" aria-label="Migas"><a href="#/">Inicio</a><span aria-hidden="true">/</span><span>chuletas</span></nav>
      <header class="route-head">
        <span class="label mono">$ cat cheatsheet.md</span>
        <h1>Chuletas para copiar</h1>
        <p class="lead">Frases hechas para el trabajo. Escúchalas, cópialas y pégalas donde las necesites.</p>
      </header>
      <div class="toolbar">
        <nav class="seg" aria-label="Secciones">${CHEATS.map(c => `<a class="opt" href="#/cheats" data-jump="${c.id}">${esc(c.title)}</a>`).join("")}</nav>
        <div class="search-box"><span class="mono prompt" aria-hidden="true">grep</span><input id="cheat-search" type="search" placeholder="PR, call, deploy…" value="${esc(cheatState.q)}" aria-label="Buscar frase" autocomplete="off"></div>
      </div>
      <div id="cheat-list"></div>`;
    renderCheatList();
  }

  function renderCheatList() {
    const q = cheatState.q.trim().toLowerCase();
    const html = CHEATS.map(c => {
      const items = c.items.filter(it => !q || (it.en + " " + it.es).toLowerCase().includes(q));
      if (!items.length) return "";
      return `<section class="unit cheat" id="cheat-${c.id}" aria-labelledby="ch-${c.id}">
        <div class="unit-head"><h2 id="ch-${c.id}">${esc(c.title)}</h2><span class="meter-txt">${items.length}</span></div>
        ${items.map(it => `<div class="cheat-row" data-speak-host>
          <button class="audio-btn" data-speak="${esc(it.en.trim())}" aria-label="Escuchar">${ICON.play}</button>
          <div><p class="en speak-target" lang="en">${esc(it.en)}</p><p class="es">${esc(it.es)}</p></div>
          <button class="btn btn-ghost copy-btn" data-copy="${esc(it.en)}" aria-label="Copiar: ${esc(it.en)}">Copiar</button>
        </div>`).join("")}
      </section>`;
    }).join("");
    $("#cheat-list").innerHTML = html || `<p class="muted">Sin resultados.</p>`;
  }

  app.addEventListener("click", e => {
    const j = e.target.closest("[data-jump]");
    if (!j) return;
    e.preventDefault();
    const sec = $(`#cheat-${j.dataset.jump}`);
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
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
    stopAudio();
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
    preloadAudio(mainText(ex));
    const nx = L.queue[L.pos + 1]; if (nx) preloadAudio(mainText(nx));
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
    { c: "daily", d: "Preparar mi daily" },
    { c: "pronounce", d: "Pronunciación de términos técnicos" },
    { c: "cheats", d: "Chuletas para copiar" },
    ...ROUTES.filter(r => r.units.length).map(r => ({ c: `route ${r.id}`, d: r.title })),
    ...LESSONS.map(l => ({ c: `lesson ${l.id}`, d: `${l.unit.title} · ${l.title}` })),
    { c: "theme dark", d: "Tema azul noche" },
    { c: "theme light", d: "Tema claro" },
    { c: "settings", d: "Ajustes de lectura" },
    { c: "voice uk", d: "Voz británica" },
    { c: "voice us", d: "Voz americana" },
    { c: "say ", d: "Leer en voz alta lo que escribas" },
    { c: "whoami", d: "Tu progreso" },
    { c: "man stand-up", d: "El manual" },
    { c: "fortune", d: "Una frase geek al azar" }
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
      case "daily": case "pronounce": case "cheats":
        if (L) leaveLesson(`#/${verb === "pronounce" ? "say" : verb}`); else location.hash = `#/${verb === "pronounce" ? "say" : verb}`; break;
      case "lesson": location.hash = `#/l/${arg}`; break;
      case "theme": if (["light", "dark"].includes(arg)) { setSetting("theme", arg); toast(`theme → ${arg}`); } break;
      case "settings": openSettings(); break;
      case "voice": setSetting("accent", arg === "us" ? "en-US" : "en-GB"); toast(`voice → ${arg === "us" ? "en-US" : "en-GB"}`); break;
      case "say": if (arg) speak(cmd.trim().slice(4)); break;
      case "whoami": toast(`${prog.xp} xp · ${streak()} días · ${learnedCount()}/${ALL_ITEMS.length} frases`); break;
      case "man": location.hash = "#/man"; break;
      case "fortune": toast(fortune()); break;
      case "sudo": toast("Permission denied. Try: practice --daily"); break;
      case "exit": case ":q": case ":wq": toast("Has salido de Vim. Enhorabuena."); break;
      case "ls": toast("learn/  say/  daily/  cheats/  man/"); break;
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
    if (L && view !== "l") { L = null; document.body.classList.remove("in-lesson"); }
    stopAudio();
    renderStats();
    const navKey = ["say", "daily", "cheats"].includes(view) ? view : (["", "r", "l"].includes(view || "") ? "learn" : null);
    $$(".nav a").forEach(a => { if (a.dataset.nav === navKey) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    if (view === "l" && lessonById[id]) startLesson(id);
    else if (view === "r") renderRoute(id);
    else if (view === "say") renderSay();
    else if (view === "daily") renderDailyBuilder();
    else if (view === "cheats") renderCheats();
    else if (view === "man") renderMan();
    else if (view && view !== "") render404(h);
    else renderHome();
    stopShell();
    if ($("#shell")) runShell();
    const f = $("#fortune"); if (f) f.textContent = fortune();
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
