/*
  Contenido de las herramientas: pronunciación, constructor de daily y chuletas.
*/

/*
  Pronunciación de términos técnicos.
  term   cómo se escribe
  sounds pronunciación aproximada «a la española» (sílaba fuerte en MAYÚSCULAS)
  wrong  cómo se suele decir mal (opcional)
  say    texto que se manda a la voz si el término solo lo lee mal (opcional)
  note   aclaración (opcional)
  cat    tools | cloud | code | trap
*/
window.TERMS = [
  // Herramientas y productos
  { cat: "tools", term: "nginx", sounds: "én-yin-ex", wrong: "en-jínx", say: "engine x", note: "Se lee «engine X»." },
  { cat: "tools", term: "Azure", sounds: "Á-zher", wrong: "a-ZUR", note: "En Reino Unido también «Á-ziur»." },
  { cat: "tools", term: "Kubernetes", sounds: "ku-ber-NÉ-tis", wrong: "ku-ber-NE-tes" },
  { cat: "tools", term: "kubectl", sounds: "kiub-ci-ti-el", say: "cube control", note: "Hay quien dice «cube control» o «cube cuttle». Cualquiera vale." },
  { cat: "tools", term: "Git", sounds: "guit", wrong: "yit", note: "Con «g» de «guitarra»." },
  { cat: "tools", term: "GitHub", sounds: "GUIT-jab", wrong: "yit-jub" },
  { cat: "tools", term: "Jira", sounds: "YÍ-ra", wrong: "JI-ra" },
  { cat: "tools", term: "Jenkins", sounds: "YÉN-kins", wrong: "JEN-kins" },
  { cat: "tools", term: "Docker", sounds: "DÓ-ker" },
  { cat: "tools", term: "Terraform", sounds: "TÉ-ra-form" },
  { cat: "tools", term: "Ansible", sounds: "ÁN-si-bol", wrong: "an-SI-ble" },
  { cat: "tools", term: "Grafana", sounds: "gra-FÁ-na" },
  { cat: "tools", term: "Postgres", sounds: "PÓUST-gres", say: "post gress", note: "También «Postgres-Q-L»." },
  { cat: "tools", term: "Ubuntu", sounds: "u-BÚN-tu" },
  { cat: "tools", term: "Linux", sounds: "LÍ-nux", wrong: "LÁI-nux" },
  { cat: "tools", term: "Python", sounds: "PÁI-zon", wrong: "PI-ton", note: "La «th» suena como la «z» de España." },
  { cat: "tools", term: "Java", sounds: "YÁ-va", wrong: "JA-va" },
  { cat: "tools", term: "YAML", sounds: "YÁ-mel", say: "yammel" },
  { cat: "tools", term: "JSON", sounds: "YÉI-son", wrong: "JOT-son", say: "Jason" },

  // Cloud y sistemas
  { cat: "cloud", term: "cache", sounds: "cash", wrong: "CA-che / ca-CHÉ", note: "Igual que «cash» (dinero)." },
  { cat: "cloud", term: "router", sounds: "RÁU-ter (EE. UU.) · RÚ-ter (R. U.)" },
  { cat: "cloud", term: "Wi-Fi", sounds: "UÁI-fai", wrong: "UI-fi" },
  { cat: "cloud", term: "sudo", sounds: "SÚ-du", note: "También «sú-dou»." },
  { cat: "cloud", term: "Unix", sounds: "IÚ-nix", wrong: "U-nix" },
  { cat: "cloud", term: "SQL", sounds: "SÍ-kuel · es-kiu-ÉL", say: "sequel", note: "Las dos formas son correctas." },
  { cat: "cloud", term: "GUI", sounds: "GÚ-i", say: "gooey", note: "Se lee como «gooey» (pegajoso)." },
  { cat: "cloud", term: "ASCII", sounds: "Á-ski", wrong: "AS-ki-i" },
  { cat: "cloud", term: "suite", sounds: "suít", wrong: "SU-ite", note: "Igual que «sweet»." },
  { cat: "cloud", term: "queue", sounds: "kiú", wrong: "KÚ-e-ue", note: "Igual que la letra Q." },
  { cat: "cloud", term: "Oracle", sounds: "Ó-ra-kol", wrong: "o-RA-cle" },

  // Código
  { cat: "code", term: "data", sounds: "DÉI-ta", note: "Es lo más común a los dos lados del Atlántico. «DÁ-ta» también se oye." },
  { cat: "code", term: "query", sounds: "KUÍ-ri", wrong: "KÉ-ri" },
  { cat: "code", term: "char", sounds: "char · kar", note: "Las dos se oyen. «Char» como «charcoal» es lo más común." },
  { cat: "code", term: "regex", sounds: "RÉ-yex", say: "redge ex", note: "También «RÉ-gex» con «g» dura." },
  { cat: "code", term: "integer", sounds: "ÍN-ti-yer", wrong: "in-te-GUER" },
  { cat: "code", term: "variable", sounds: "VÉ-ri-a-bol", wrong: "va-RIA-ble" },
  { cat: "code", term: "method", sounds: "MÉ-zod", wrong: "ME-tod" },
  { cat: "code", term: "null", sounds: "nal", wrong: "nul" },
  { cat: "code", term: "tuple", sounds: "TIÚ-pol · TÁ-pol" },
  { cat: "code", term: "width", sounds: "uidz", wrong: "uid", note: "Termina en «th»: la lengua entre los dientes." },
  { cat: "code", term: "height", sounds: "jáit", wrong: "jéit", note: "Rima con «light»." },
  { cat: "code", term: "schema", sounds: "SKÍ-ma", wrong: "ES-que-ma" },
  { cat: "code", term: "bug", sounds: "bag (a corta)", wrong: "bug (con «u»)", note: "La vocal es corta y apagada, como en «up». No es «bag» (bolsa)." },
  { cat: "code", term: "debug", sounds: "di-BÁG", wrong: "DE-bug", say: "dee bug" },
  { cat: "code", term: "binary", sounds: "BÁI-na-ri", wrong: "bi-NA-ri" },

  // Palabras trampa: el acento cae donde no esperas
  { cat: "trap", term: "deploy", sounds: "di-PLÓI", wrong: "DÉ-ploi" },
  { cat: "trap", term: "develop", sounds: "di-VÉ-lop", wrong: "de-ve-LÓP" },
  { cat: "trap", term: "determine", sounds: "di-TÉR-min", wrong: "de-ter-MÁIN" },
  { cat: "trap", term: "deprecated", sounds: "DÉ-pre-kei-tid" },
  { cat: "trap", term: "event", sounds: "i-VÉNT", wrong: "É-vent" },
  { cat: "trap", term: "library", sounds: "LÁI-bra-ri", wrong: "li-BRA-ri" },
  { cat: "trap", term: "archive", sounds: "ÁR-kaiv", wrong: "ar-CHÁIV" },
  { cat: "trap", term: "architecture", sounds: "ÁR-ki-tek-cher", wrong: "ar-chi-TEC-ture" },
  { cat: "trap", term: "hierarchy", sounds: "JÁI-rar-ki", wrong: "ie-RAR-ki" },
  { cat: "trap", term: "focus", sounds: "FÓU-kus", wrong: "FO-cus", note: "Ojo: pronunciado «fókus» puede sonar a una palabrota." }
];

window.TERM_CATS = [
  { id: "tools", name: "Herramientas" },
  { id: "cloud", name: "Cloud y sistemas" },
  { id: "code", name: "Código" },
  { id: "trap", name: "Acento trampa" }
];

/*
  Constructor de daily: plantillas con un hueco «…» que rellenas tú.
*/
window.DAILY = {
  yesterday: [
    "I finished …",
    "I worked on …",
    "I fixed …",
    "I reviewed …",
    "I merged …",
    "I opened a PR for …",
    "I pushed a hotfix for …",
    "I investigated …",
    "I paired with … on …",
    "I had meetings most of the day."
  ],
  today: [
    "I'll continue with …",
    "I'm still on …",
    "I'm wrapping up …",
    "I'll work on …",
    "I'll review …",
    "I'll test …",
    "I'll deploy … to staging.",
    "I'll pair with …",
    "I'm on call today."
  ],
  eta: [
    "",
    "It should be done by …",
    "I'll have a PR up by …",
    "It's taking longer than expected.",
    "No ETA yet. I'll update you tomorrow."
  ],
  blockers: [
    "No blockers.",
    "I'm blocked by …",
    "I'm waiting on …",
    "I need help with …",
    "I need access to …"
  ]
};

/*
  Chuletas: frases para copiar y pegar.
*/
window.CHEATS = [
  {
    id: "pr", title: "Comentarios en PR",
    items: [
      { en: "LGTM.", es: "Looks good to me: por mi parte, aprobado." },
      { en: "nit: typo in the variable name.", es: "«nit» = detalle menor que no bloquea." },
      { en: "Non-blocking: maybe extract this into a function.", es: "Sugerencia que no impide aprobar." },
      { en: "Could we split this into smaller PRs?", es: "¿Podemos dividir esto en PR más pequeñas?" },
      { en: "Can you add a test for this case?", es: "¿Puedes añadir un test para este caso?" },
      { en: "What happens if this is null?", es: "¿Qué pasa si esto es null?" },
      { en: "Nice catch!", es: "¡Bien visto!" },
      { en: "Good point, fixed.", es: "Buen apunte, corregido." },
      { en: "Addressed your comments. Could you take another look?", es: "He resuelto tus comentarios. ¿Le echas otro vistazo?" },
      { en: "Approved with minor comments.", es: "Aprobado, con comentarios menores." },
      { en: "Can you rebase onto main?", es: "¿Puedes hacer rebase sobre main?" },
      { en: "This might break backwards compatibility.", es: "Esto podría romper la compatibilidad hacia atrás." },
      { en: "Could you add some context to the description?", es: "¿Puedes añadir contexto a la descripción de la PR?" },
      { en: "Feel free to ignore, just a thought.", es: "Si quieres, ignóralo: es solo una idea." }
    ]
  },
  {
    id: "slack", title: "Slack",
    items: [
      { en: "Hi Ana! Quick question about the deploy: ", es: "Saluda y pregunta en el mismo mensaje. No envíes solo «Hi» y esperes: es la norma «no hello»." },
      { en: "Got it, thanks.", es: "Entendido, gracias." },
      { en: "On it.", es: "Me pongo con ello." },
      { en: "No rush.", es: "Sin prisa." },
      { en: "Sorry, I missed this.", es: "Perdona, se me pasó." },
      { en: "Can we jump on a quick call?", es: "¿Hacemos una llamada rápida?" },
      { en: "I'll get back to you by EOD.", es: "Te digo algo antes de que acabe el día (EOD = end of day)." },
      { en: "Heads-up: the deploy is at 5 pm.", es: "Aviso: el despliegue es a las 5." },
      { en: "Moving this to a thread.", es: "Lo paso a un hilo." }
    ]
  },
  {
    id: "email", title: "Correos",
    items: [
      { en: "Hi all, quick update on ", es: "Hola a todos, una actualización rápida sobre …" },
      { en: "I've attached the report.", es: "Te adjunto el informe." },
      { en: "Just bumping this up.", es: "Lo vuelvo a subir (recordatorio suave)." },
      { en: "Just following up on this.", es: "Te escribo para hacer seguimiento." },
      { en: "Could you confirm by Friday?", es: "¿Puedes confirmarlo como tarde el viernes?" },
      { en: "Looping in Ana, who owns this.", es: "Añado a Ana, que es la responsable." },
      { en: "Let me know if you have any questions.", es: "Dime si tienes cualquier duda." },
      { en: "Thanks for your patience.", es: "Gracias por tu paciencia." },
      { en: "Best regards,", es: "Un saludo," }
    ]
  },
  {
    id: "meetings", title: "Reuniones",
    items: [
      { en: "Sorry, could you repeat that?", es: "Perdona, ¿puedes repetirlo?" },
      { en: "Could you speak a bit slower, please?", es: "¿Puedes hablar un poco más despacio, por favor?" },
      { en: "Just to make sure I understood: ", es: "Para asegurarme de que lo he entendido: …" },
      { en: "Let me check and get back to you.", es: "Lo miro y te digo." },
      { en: "Sorry, go ahead.", es: "Perdona, sigue tú (cuando habláis a la vez)." },
      { en: "Can you share your screen?", es: "¿Puedes compartir pantalla?" },
      { en: "Let's take it offline.", es: "Lo hablamos aparte." },
      { en: "I need to drop off in five minutes.", es: "Tengo que salirme en cinco minutos." }
    ]
  },
  {
    id: "acronyms", title: "Sprint y siglas",
    items: [
      { en: "ETA", say: "E. T. A.", es: "Estimated time of arrival: fecha u hora estimada." },
      { en: "EOD", es: "End of day: antes de que acabe el día." },
      { en: "OOO", es: "Out of office: fuera de la oficina." },
      { en: "WFH", es: "Working from home: teletrabajando." },
      { en: "FYI", es: "For your information: para que lo sepas." },
      { en: "ASAP", es: "As soon as possible: cuanto antes." },
      { en: "TL;DR", say: "T. L. D. R.", es: "Too long; didn't read: resumen corto al principio de un texto largo." },
      { en: "PTAL", say: "P. T. A. L.", es: "Please take another look: revísalo otra vez (en PR)." },
      { en: "WIP", es: "Work in progress: sin terminar, no lo fusiones aún." },
      { en: "This ticket is in the current sprint.", es: "Este ticket está en el sprint actual." },
      { en: "It's a three-point story.", es: "Es una historia de tres puntos (estimación)." },
      { en: "We need a hotfix.", es: "Necesitamos un arreglo urgente en producción." }
    ]
  },
  {
    id: "incident", title: "Incidencias",
    items: [
      { en: "Investigating.", es: "Investigando." },
      { en: "We're seeing elevated error rates on ", es: "Estamos viendo más errores de lo normal en …" },
      { en: "Rolling back the last deploy.", es: "Deshaciendo el último despliegue." },
      { en: "Mitigated. Monitoring.", es: "Mitigado. Lo seguimos vigilando." },
      { en: "Next update in 30 minutes.", es: "Próxima actualización en 30 minutos." },
      { en: "Root cause identified: ", es: "Causa raíz identificada: …" },
      { en: "Resolved. Post-mortem to follow.", es: "Resuelto. Después haremos el post-mortem." }
    ]
  }
];
