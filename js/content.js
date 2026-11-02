/*
  Contenido de stand-up.

  Rutas → unidades → lecciones → frases.
  Cada frase:
    en    frase en inglés (corta, real)
    es    traducción
    gap   palabra que se quita en los huecos (tiene que estar tal cual en «en»)
    wrong opciones falsas: errores típicos de hispanohablantes o palabras parecidas
    note  explicación corta (opcional)
    say   texto para el audio, si se lee distinto de como se escribe (opcional)
  Cada lección puede tener una escena: alguien te escribe y eliges la respuesta.
*/
window.ROUTES = [
  {
    id: "team",
    code: "01",
    title: "Sobrevivir al día a día del equipo",
    desc: "Dailies, Slack, correos y reuniones. El inglés que usas cada mañana.",
    units: [
      {
        id: "daily",
        title: "Daily stand-up",
        desc: "Ayer, hoy y bloqueos en 30 segundos.",
        lessons: [
          {
            title: "Ayer, hoy y bloqueos",
            level: "A2",
            items: [
              { en: "Quick update.", es: "Una actualización rápida.", gap: "update", wrong: ["actualization", "upgrade", "news"], note: "«Actualization» no existe en inglés." },
              { en: "Yesterday I fixed the bug.", es: "Ayer arreglé el bug.", gap: "fixed", wrong: ["fix", "fixes", "fixing"], note: "Para ayer, pasado: «fixed»." },
              { en: "Today I'm on the pipeline.", es: "Hoy estoy con la pipeline.", gap: "on", wrong: ["in", "at", "with"], note: "«Be on something» = estar con una tarea." },
              { en: "No blockers.", es: "Sin bloqueos.", gap: "blockers", wrong: ["blocks", "blockings", "stoppers"] },
              { en: "I'm blocked by networking.", es: "Estoy bloqueado por el equipo de red.", gap: "blocked", wrong: ["blocking", "block", "locked"], note: "«I'm blocking» significa que tú bloqueas a otros." },
              { en: "That's it from me.", es: "Eso es todo por mi parte.", gap: "from", wrong: ["for", "of", "by"] }
            ],
            scene: {
              who: "Emma", role: "Scrum Master",
              text: "Sergio, want to go first?", es: "Sergio, ¿quieres empezar tú?",
              options: [
                { en: "Sure. Yesterday I fixed the login bug. Today I'm on the pipeline. No blockers.", ok: true, why: "Ayer, hoy y bloqueos en tres frases. Así es un buen daily." },
                { en: "Yes, I go first.", ok: false, why: "Falta el futuro: «I'll go first»." },
                { en: "Of course, I begin.", ok: false, why: "Suena traducido. Lo natural es «Sure, I'll start»." }
              ]
            }
          },
          {
            title: "Estado de las tareas",
            level: "B1",
            items: [
              { en: "Still in progress.", es: "Sigue en curso.", gap: "progress", wrong: ["progression", "course", "curse"], note: "«In course» no se usa: es «in progress»." },
              { en: "Almost done.", es: "Casi terminado.", gap: "done", wrong: ["finish", "made", "ended"] },
              { en: "The PR is ready for review.", es: "La PR está lista para revisión.", gap: "review", wrong: ["revision", "check", "revise"], note: "«Revision» es una versión corregida, no una revisión de código." },
              { en: "I'll pair with Ana.", es: "Voy a trabajar en pareja con Ana.", gap: "pair", wrong: ["couple", "pairs", "join"], note: "«Pair» = programar en pareja." },
              { en: "It took longer than expected.", es: "Me llevó más de lo esperado.", gap: "longer", wrong: ["larger", "later", "longest"] },
              { en: "I'm waiting on QA.", es: "Estoy esperando a QA.", gap: "waiting", wrong: ["hoping", "expecting", "attending"], note: "«Expect» es prever. Esperar a alguien es «wait for» o «wait on»." }
            ],
            scene: {
              who: "Emma", role: "Scrum Master",
              text: "How's the migration going?", es: "¿Cómo va la migración?",
              options: [
                { en: "Almost done. It took longer than expected.", ok: true, why: "Das el estado y el motivo en dos frases." },
                { en: "It's going in course.", ok: false, why: "No existe. Di «It's in progress»." },
                { en: "Actually it's finished, but not yet.", ok: false, why: "«Actually» significa «en realidad», no «actualmente». Y la frase se contradice." }
              ]
            }
          },
          {
            title: "Pedir ayuda y cerrar",
            level: "B2",
            items: [
              { en: "Can anyone help with this?", es: "¿Alguien puede ayudar con esto?", gap: "help", wrong: ["assist", "attend", "care"], note: "«Assist» es formal y «attend» es asistir a algo. En el daily, «help»." },
              { en: "Let's take it offline.", es: "Lo hablamos aparte.", gap: "offline", wrong: ["outside", "apart", "off"], note: "No tiene nada que ver con internet: es hablarlo fuera de la reunión." },
              { en: "I'll ping you after.", es: "Te escribo después.", gap: "ping", wrong: ["touch", "ring", "beep"], note: "«Ping someone» = escribir o avisar a alguien." },
              { en: "Heads-up: I'm out on Friday.", es: "Aviso: el viernes no estoy.", gap: "out", wrong: ["absent", "outside", "holidays"], note: "«Absent» suena a colegio." },
              { en: "Who's picking this up?", es: "¿Quién se encarga de esto?", gap: "picking", wrong: ["catching", "getting", "lifting"] },
              { en: "Let's keep it short.", es: "Vamos a ser breves.", gap: "short", wrong: ["small", "little", "low"] }
            ],
            scene: {
              who: "Mike", role: "SRE",
              text: "Can we discuss the DNS issue now?", es: "¿Podemos hablar ahora del problema de DNS?",
              options: [
                { en: "Let's take it offline after the stand-up.", ok: true, why: "Proteges el tiempo del daily y no ignoras el tema." },
                { en: "Let's discuss it apart.", ok: false, why: "«Apart» no se usa así. Di «take it offline» o «discuss it separately»." },
                { en: "Better not, it's a long history.", ok: false, why: "«History» es historia del pasado. Aquí es «a long story»." }
              ]
            }
          }
        ]
      },
      {
        id: "async",
        title: "Slack y correo",
        desc: "Mensajes cortos, correos claros y tono profesional.",
        lessons: [
          {
            title: "Mensajes rápidos",
            level: "A2",
            items: [
              { en: "Got it, thanks.", es: "Entendido, gracias.", gap: "Got", wrong: ["Have", "Take", "Catch"] },
              { en: "On it.", es: "Me pongo con ello.", gap: "On", wrong: ["In", "At", "With"] },
              { en: "Sounds good.", es: "Me parece bien.", gap: "Sounds", wrong: ["Listens", "Hears", "Sound"] },
              { en: "Quick question.", es: "Una pregunta rápida.", gap: "Quick", wrong: ["Fast", "Rapid", "Speed"] },
              { en: "No rush.", es: "Sin prisa.", gap: "rush", wrong: ["press", "run", "race"] },
              { en: "Thanks for the heads-up.", es: "Gracias por avisar.", gap: "heads-up", wrong: ["advise", "advertise", "head"], note: "«Advertise» es anunciar, de publicidad. Falso amigo de «advertir»." }
            ],
            scene: {
              who: "Ana", role: "Backend Developer",
              text: "Can you review my PR today?", es: "¿Puedes revisar mi PR hoy?",
              options: [
                { en: "Sure, on it.", ok: true, why: "Corto y claro, como se escribe en Slack." },
                { en: "Of course, I will revise it.", ok: false, why: "«Revise» es corregir y reescribir. Revisar código es «review»." },
                { en: "Yes, I'm going to it.", ok: false, why: "Calco del español. Di «I'm on it» o «I'll take a look»." }
              ]
            }
          },
          {
            title: "Correos claros",
            level: "B1",
            items: [
              { en: "I've attached the report.", es: "Te adjunto el informe.", gap: "attached", wrong: ["adjunted", "annexed", "joined"], note: "«Please find attached…» también se usa, pero suena formal y algo anticuado." },
              { en: "Just following up.", es: "Te escribo para hacer seguimiento.", gap: "following", wrong: ["continuing", "pursuing", "persecuting"], note: "«Persecute» es perseguir a alguien con mala intención." },
              { en: "Could you confirm by Friday?", es: "¿Puedes confirmarlo como tarde el viernes?", gap: "by", wrong: ["until", "since", "during"], note: "«By Friday» = como tarde el viernes. «Until» marca duración." },
              { en: "Looping in Ana.", es: "Añado a Ana al hilo.", gap: "Looping", wrong: ["Rounding", "Linking", "Hooking"] },
              { en: "Let me know.", es: "Dime algo.", gap: "know", wrong: ["now", "knew", "known"] },
              { en: "Sorry for the delay.", es: "Perdona el retraso.", gap: "delay", wrong: ["late", "delayed", "retire"], note: "Ojo: la palabra inglesa parecida a «retraso» es un insulto. Usa siempre «delay»." }
            ],
            scene: {
              who: "Laura", role: "Engineering Manager",
              text: "When can you send the report?", es: "¿Cuándo puedes enviar el informe?",
              options: [
                { en: "I'll send it by Friday.", ok: true, why: "«By» es la fecha límite. Compromiso claro." },
                { en: "I'll send it until Friday.", ok: false, why: "«Until» marca duración. Para una fecha límite: «by Friday»." },
                { en: "I send it on Friday, sure.", ok: false, why: "Para prometer algo usa el futuro: «I'll send»." }
              ]
            }
          },
          {
            title: "Tono profesional",
            level: "B2",
            items: [
              { en: "Gentle reminder.", es: "Te lo recuerdo amablemente.", gap: "Gentle", wrong: ["Gentile", "Soft", "Sweet"], note: "Úsalo con cuidado: a veces suena pasivo-agresivo. Más suave: «Just bumping this up»." },
              { en: "Happy to help.", es: "Encantado de ayudar.", gap: "Happy", wrong: ["Content", "Joyful", "Funny"] },
              { en: "I'd like to flag an issue.", es: "Quiero avisar de un problema.", gap: "flag", wrong: ["advert", "alarm", "sign"] },
              { en: "As discussed, here are the next steps.", es: "Como hablamos, estos son los siguientes pasos.", gap: "discussed", wrong: ["argued", "talked", "spoken"], note: "«Argue» es discutir enfadado." },
              { en: "Let's circle back next week.", es: "Lo retomamos la semana que viene.", gap: "circle", wrong: ["turn", "round", "spin"] },
              { en: "Apologies for the confusion.", es: "Disculpas por la confusión.", gap: "Apologies", wrong: ["Excuses", "Sorries", "Pardons"], note: "«Excuses» son excusas, no disculpas." }
            ],
            scene: {
              who: "Tom", role: "Product Manager",
              text: "Wait, the deadline moved again?", es: "Espera, ¿la fecha ha vuelto a cambiar?",
              options: [
                { en: "Yes, apologies for the confusion. Here are the new dates.", ok: true, why: "Reconoces el problema y das la información." },
                { en: "Yes, excuse me for the confusion.", ok: false, why: "«Excuse me» es para pedir paso o interrumpir." },
                { en: "Yes. Not my problem.", ok: false, why: "Demasiado brusco, sobre todo por escrito." }
              ]
            }
          }
        ]
      },
      {
        id: "meetings",
        title: "Reuniones",
        desc: "Llamadas, opiniones y cómo cerrar con tareas claras.",
        lessons: [
          {
            title: "Lo básico en una llamada",
            level: "A2",
            items: [
              { en: "Can you hear me?", es: "¿Me oís?", gap: "hear", wrong: ["listen", "here", "ear"], note: "«Listen» es escuchar con atención. Para el audio, «hear»." },
              { en: "You're on mute.", es: "Tienes el micro silenciado.", gap: "mute", wrong: ["silence", "quiet", "mud"] },
              { en: "Can you see my screen?", es: "¿Veis mi pantalla?", gap: "screen", wrong: ["scream", "window", "screw"] },
              { en: "Sorry, you cut out.", es: "Perdona, se te ha cortado.", gap: "cut", wrong: ["cutted", "broke", "fell"], note: "«Cutted» no existe: el pasado de «cut» es «cut»." },
              { en: "Let's get started.", es: "Empecemos.", gap: "started", wrong: ["starting", "began", "stared"] },
              { en: "I have a hard stop at five.", es: "A las cinco tengo que irme sí o sí.", gap: "stop", wrong: ["end", "leave", "exit"] }
            ],
            scene: {
              who: "Laura", role: "Engineering Manager",
              text: "Sergio, are you there? We can't hear you.", es: "Sergio, ¿estás? No te oímos.",
              options: [
                { en: "Sorry, I was on mute. Can you hear me now?", ok: true, why: "Explicas qué pasaba y compruebas que ya te oyen." },
                { en: "Sorry, I was in silence.", ok: false, why: "Para el micrófono se dice «on mute»." },
                { en: "Yes, I'm listening you.", ok: false, why: "Falta «to»: «listening to you». Y el problema es que no te oyen a ti." }
              ]
            }
          },
          {
            title: "Opinar y preguntar",
            level: "B1",
            items: [
              { en: "I agree.", es: "Estoy de acuerdo.", gap: "agree", wrong: ["accord", "agreed", "agreeing"], note: "Nunca «I'm agree»: «agree» ya es el verbo." },
              { en: "Good point.", es: "Buen apunte.", gap: "point", wrong: ["note", "pointer", "punt"] },
              { en: "Just to clarify...", es: "Solo para aclarar...", gap: "clarify", wrong: ["clear", "clearify", "clarity"] },
              { en: "What do you mean?", es: "¿Qué quieres decir?", gap: "mean", wrong: ["means", "meaning", "signify"] },
              { en: "Could you explain that?", es: "¿Puedes explicar eso?", gap: "explain", wrong: ["expose", "explicate", "exploit"], note: "Ojo con «explain me»: lo correcto es «explain it to me»." },
              { en: "I see your point, but...", es: "Entiendo lo que dices, pero...", gap: "see", wrong: ["watch", "look", "sea"] }
            ],
            scene: {
              who: "Mike", role: "SRE",
              text: "So we migrate everything on Monday.", es: "Entonces migramos todo el lunes.",
              options: [
                { en: "Good point, but could you explain the rollback plan?", ok: true, why: "Reconoces la idea y pides lo que falta." },
                { en: "Actually, Monday is a public holiday.", ok: true, why: "Bien usado: «actually» = en realidad. Corriges un dato con educación." },
                { en: "I'm agree, but explain me the rollback.", ok: false, why: "Dos errores típicos: «I agree» y «explain it to me»." }
              ]
            }
          },
          {
            title: "Decidir y cerrar",
            level: "B2",
            items: [
              { en: "Let's park that for now.", es: "Dejemos eso aparcado de momento.", gap: "park", wrong: ["parking", "stay", "leave"] },
              { en: "Are we aligned?", es: "¿Estamos alineados?", gap: "aligned", wrong: ["aligning", "lined", "agree"] },
              { en: "Who owns this?", es: "¿Quién es responsable de esto?", gap: "owns", wrong: ["own", "owned", "owners"] },
              { en: "Let's wrap up.", es: "Vamos cerrando.", gap: "wrap", wrong: ["rap", "warp", "roll"] },
              { en: "I'll send a recap.", es: "Mando un resumen.", gap: "recap", wrong: ["resume", "resumen", "summing"], note: "«Resume» (o «résumé») es un currículum." },
              { en: "Action items are in the doc.", es: "Las tareas están en el documento.", gap: "Action", wrong: ["Acting", "Actions", "Activity"] }
            ],
            scene: {
              who: "Laura", role: "Engineering Manager",
              text: "Anything else before we finish?", es: "¿Algo más antes de terminar?",
              options: [
                { en: "No, I think we're aligned. I'll send a recap.", ok: true, why: "Confirmas el acuerdo y te comprometes a algo concreto." },
                { en: "No. I will send a resume.", ok: false, why: "«Resume» es un currículum. Resumen = «recap» o «summary»." },
                { en: "Nothing more, we can finish the reunion.", ok: false, why: "«Reunion» es un reencuentro, como el de antiguos alumnos. Reunión = «meeting»." }
              ]
            }
          }
        ]
      },
      {
        id: "numbers",
        title: "Números, fechas y siglas",
        desc: "ETA, OOO, 99.9 %, versiones y plazos: lo que se dice en cada daily.",
        lessons: [
          {
            title: "Siglas del día a día",
            level: "A2",
            items: [
              { en: "What's the ETA?", say: "What's the E. T. A.?", es: "¿Para cuándo estará?", gap: "ETA", wrong: ["EOD", "FYI", "OOO"], note: "ETA = estimated time of arrival: la fecha o la hora estimada. Se deletrea: «i-ti-ei»." },
              { en: "I'm OOO next week.", es: "La semana que viene estoy fuera de la oficina.", gap: "OOO", wrong: ["WFH", "ETA", "EOD"], note: "OOO = out of office. Se lee «ou-ou-ou»." },
              { en: "I'm WFH today.", es: "Hoy teletrabajo.", gap: "WFH", wrong: ["OOO", "ETA", "FYI"], note: "WFH = working from home." },
              { en: "FYI, the build is green.", es: "Para que lo sepas: la build está en verde.", gap: "build", wrong: ["built", "building", "construction"], note: "FYI = for your information. «Green» = todo pasa; «red» = algo falla." },
              { en: "Can you do it by EOD?", es: "¿Puedes hacerlo antes de que acabe el día?", gap: "by", wrong: ["until", "since", "during"], note: "EOD = end of day. Con fecha límite, siempre «by»." },
              { en: "We need this ASAP.", es: "Lo necesitamos cuanto antes.", gap: "ASAP", wrong: ["EOD", "FYI", "WFH"], note: "ASAP = as soon as possible. Se oye «ei-sap» o deletreado." }
            ],
            scene: {
              who: "Laura", role: "Engineering Manager",
              text: "Are you around next week?", es: "¿Estás la semana que viene?",
              options: [
                { en: "I'm OOO on Monday, but back on Tuesday.", ok: true, why: "Avisas de la ausencia y de cuándo vuelves." },
                { en: "I'm WFH on Monday, so I'm not working.", ok: false, why: "WFH es trabajar desde casa, no estar ausente. Ausente es OOO." },
                { en: "I am in vacations on Monday.", ok: false, why: "Calco del español. Di «I'm on holiday» (R. U.) o «I'm on vacation» (EE. UU.)." }
              ]
            }
          },
          {
            title: "Cifras y versiones",
            level: "B1",
            items: [
              { en: "Uptime is 99.9%.", say: "Uptime is ninety-nine point nine percent.", es: "La disponibilidad es del 99,9 %.", gap: "Uptime", wrong: ["Upload", "Update", "Uplift"], note: "El decimal se dice «point», no «comma»: «ninety-nine point nine»." },
              { en: "Latency is under 200 ms.", say: "Latency is under two hundred milliseconds.", es: "La latencia está por debajo de 200 ms.", gap: "under", wrong: ["down", "minus", "lower"], note: "«ms» se lee «milliseconds»." },
              { en: "We're on version 2.1.", say: "We're on version two point one.", es: "Estamos en la versión 2.1.", gap: "on", wrong: ["in", "at", "by"], note: "En inglés estás «on» una versión, no «in»." },
              { en: "The disk is 80% full.", say: "The disk is eighty percent full.", es: "El disco está al 80 %.", gap: "full", wrong: ["filled", "complete", "plenty"] },
              { en: "Restart takes about 30 seconds.", say: "Restart takes about thirty seconds.", es: "Reiniciar tarda unos 30 segundos.", gap: "takes", wrong: ["delays", "tooks", "lasts"], note: "«Tardar» es «take». «Delay» es retrasar." },
              { en: "The call is at 3:30 CET.", say: "The call is at three thirty, C. E. T.", es: "La llamada es a las 15:30, hora central europea.", gap: "at", wrong: ["on", "in", "to"], note: "Para una hora, «at». En equipos internacionales di siempre la zona horaria." }
            ],
            scene: {
              who: "Mike", role: "SRE",
              text: "How bad is the disk?", es: "¿Cómo de mal está el disco?",
              options: [
                { en: "It's 80% full. We have about two days.", ok: true, why: "Das la cifra y el margen. Justo lo que necesita saber." },
                { en: "It's at eighty comma five percent.", ok: false, why: "El decimal es «point»: «eighty point five»." },
                { en: "It's very full, very very full.", ok: false, why: "Sin cifra no ayuda a decidir. Di el porcentaje." }
              ]
            }
          },
          {
            title: "Fechas y plazos",
            level: "B2",
            items: [
              { en: "It's due on the 15th.", es: "La fecha límite es el día 15.", gap: "due", wrong: ["owed", "expired", "dated"], note: "«Due» = previsto o con fecha límite." },
              { en: "Can we push it to Monday?", es: "¿Podemos pasarlo al lunes?", gap: "push", wrong: ["pass", "press", "throw"], note: "«Push» = aplazar. «Pass» no se usa así." },
              { en: "The deadline is end of Q3.", say: "The deadline is end of Q three.", es: "La fecha límite es el final del tercer trimestre.", gap: "deadline", wrong: ["deathline", "dateline", "limit"] },
              { en: "Let's aim for Thursday.", es: "Apuntemos al jueves.", gap: "aim", wrong: ["point", "shoot", "look"] },
              { en: "We're two days behind.", es: "Vamos dos días con retraso.", gap: "behind", wrong: ["after", "back", "later"] },
              { en: "Should be done by Friday.", es: "Debería estar listo el viernes como tarde.", gap: "by", wrong: ["until", "since", "during"] }
            ],
            scene: {
              who: "Tom", role: "Product Manager",
              text: "When will it be ready?", es: "¿Cuándo estará listo?",
              options: [
                { en: "Should be done by Friday, if QA goes well.", ok: true, why: "Das una fecha y la condición. Honesto y útil." },
                { en: "It will be ready until Friday.", ok: false, why: "«Until» marca duración. Para una fecha límite, «by Friday»." },
                { en: "I don't know. Maybe.", ok: false, why: "Aunque no lo sepas, da una estimación: «Probably by Friday, I'll confirm tomorrow»." }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: "interviews",
    code: "02",
    title: "Pasar entrevistas",
    desc: "Preséntate, cuenta tus proyectos y responde a lo difícil.",
    units: [
      {
        id: "intro",
        title: "Preséntate",
        desc: "Tu perfil y tu experiencia en 30 segundos.",
        lessons: [
          {
            title: "Quién eres",
            level: "B1",
            items: [
              { en: "I'm a cloud engineer.", es: "Soy ingeniero cloud.", gap: "engineer", wrong: ["engineering", "ingenier", "engine"] },
              { en: "I work on infrastructure as code.", es: "Trabajo en infraestructura como código.", gap: "as", wrong: ["like", "how", "of"], note: "«Como» de función es «as». «Like» compara." },
              { en: "I've been in tech for twenty years.", es: "Llevo veinte años en tecnología.", gap: "for", wrong: ["since", "during", "from"], note: "Con una duración, «for». Con un punto de inicio, «since»." },
              { en: "Right now I'm focused on Terraform.", es: "Ahora mismo me centro en Terraform.", gap: "Right", wrong: ["Just", "Since", "Exactly"] },
              { en: "I enjoy automating things.", es: "Me gusta automatizar cosas.", gap: "automating", wrong: ["automate", "to automate", "automatize"], note: "Después de «enjoy», siempre -ing." },
              { en: "I'm looking for a new challenge.", es: "Busco un nuevo reto.", gap: "challenge", wrong: ["challenger", "chance", "defy"] }
            ],
            scene: {
              who: "Sarah", role: "Engineering Manager",
              text: "So, tell me about yourself.", es: "Bueno, háblame de ti.",
              options: [
                { en: "I'm a cloud engineer with almost twenty years in systems. Right now I'm focused on Terraform.", ok: true, why: "Corto, profesional y conectado con el puesto." },
                { en: "I was born in Madrid and I like football.", ok: false, why: "No buscan tu biografía: empieza por tu perfil profesional." },
                { en: "My name is Sergio and I have forty years.", ok: false, why: "La edad es «I'm forty», no «I have». Y no hace falta decirla." }
              ]
            }
          },
          {
            title: "Tu experiencia",
            level: "B2",
            items: [
              { en: "I led a team of five.", es: "Lideré un equipo de cinco personas.", gap: "led", wrong: ["leaded", "lead", "leading"], note: "El pasado de «lead» es «led»." },
              { en: "I was responsible for the migration.", es: "Era el responsable de la migración.", gap: "responsible", wrong: ["responsable", "response", "responsive"], note: "En inglés se escribe con «i»: responsible." },
              { en: "I reduced deploy time by 40%.", say: "I reduced deploy time by forty percent.", es: "Reduje el tiempo de despliegue un 40 %.", gap: "by", wrong: ["in", "on", "at"], note: "«En un 40 %» = «by 40%»." },
              { en: "We moved to the cloud in 2023.", say: "We moved to the cloud in twenty twenty-three.", es: "Nos pasamos a la nube en 2023.", gap: "moved", wrong: ["mudated", "removed", "translated"] },
              { en: "I mentor junior engineers.", es: "Hago de mentor de ingenieros junior.", gap: "mentor", wrong: ["tutorize", "mentorize", "monitor"] },
              { en: "My main stack is AWS and GCP.", say: "My main stack is A. W. S. and G. C. P.", es: "Mi stack principal es AWS y GCP.", gap: "stack", wrong: ["stock", "stuck", "pile"] }
            ],
            scene: {
              who: "Sarah", role: "Engineering Manager",
              text: "What's your biggest achievement?", es: "¿Cuál es tu mayor logro?",
              options: [
                { en: "I led the migration to the cloud and reduced deploy time by 40%.", ok: true, why: "Acción concreta y resultado medible." },
                { en: "I reduced the deploy time in a 40%.", ok: false, why: "Calco de «en un 40 %». Se dice «by 40%»." },
                { en: "I did a lot of things.", ok: false, why: "Demasiado vago. Elige un logro y da una cifra." }
              ]
            }
          }
        ]
      },
      {
        id: "project",
        title: "Cuenta un proyecto",
        desc: "Problema, acción y resultado, con el método STAR.",
        lessons: [
          {
            title: "Problema, acción y resultado",
            level: "B2",
            items: [
              { en: "The problem was slow deployments.", es: "El problema eran los despliegues lentos.", gap: "slow", wrong: ["low", "slowly", "late"] },
              { en: "My goal was to automate it.", es: "Mi objetivo era automatizarlo.", gap: "goal", wrong: ["gol", "goat", "gold"] },
              { en: "First, I mapped the dependencies.", es: "Primero, identifiqué las dependencias.", gap: "First", wrong: ["Fist", "Former", "Primary"] },
              { en: "Then we rolled it out gradually.", es: "Luego lo desplegamos poco a poco.", gap: "gradually", wrong: ["gradual", "graduated", "grade"], note: "«Roll out» = desplegar o lanzar por fases." },
              { en: "As a result, incidents dropped.", es: "Como resultado, bajaron las incidencias.", gap: "dropped", wrong: ["droped", "drop", "down"] },
              { en: "The key lesson was to test early.", es: "La lección clave fue probar pronto.", gap: "early", wrong: ["soon", "first", "earlier"], note: "«Pronto» en el tiempo de un proceso: «early». «Soon» es «dentro de poco»." }
            ],
            scene: {
              who: "Sarah", role: "Engineering Manager",
              text: "Tell me about a challenging project.", es: "Háblame de un proyecto difícil.",
              options: [
                { en: "Sure. The problem was slow deployments. I automated the pipeline and, as a result, deploy time dropped by half.", ok: true, why: "Problema, acción y resultado: el método STAR en tres frases." },
                { en: "It was a project very difficult and we did it.", ok: false, why: "El adjetivo va delante: «a very difficult project». Y falta qué hiciste tú." },
                { en: "I don't remember any.", ok: false, why: "Lleva siempre uno o dos proyectos preparados." }
              ]
            }
          }
        ]
      },
      {
        id: "questions",
        title: "Preguntas difíciles y tus preguntas",
        desc: "Ganar tiempo, reconocer lo que no sabes y preguntar al final.",
        lessons: [
          {
            title: "Preguntas difíciles",
            level: "B2",
            items: [
              { en: "That's a great question.", es: "Buena pregunta.", gap: "great", wrong: ["grate", "grand", "greatly"], note: "Te da unos segundos para pensar." },
              { en: "Let me think for a second.", es: "Déjame pensarlo un segundo.", gap: "think", wrong: ["thing", "thinking", "thank"] },
              { en: "I haven't used it in production.", es: "No lo he usado en producción.", gap: "production", wrong: ["produce", "productive", "producting"] },
              { en: "But I'd love to learn it.", es: "Pero me encantaría aprenderlo.", gap: "love", wrong: ["live", "lose", "loving"] },
              { en: "My weakness is that I overcommit.", es: "Mi punto débil es que asumo demasiado.", gap: "weakness", wrong: ["weak", "debility", "weekness"] },
              { en: "I'm working on delegating more.", es: "Estoy trabajando en delegar más.", gap: "delegating", wrong: ["delegate", "delegation", "to delegate"], note: "Después de una preposición, -ing: «working on delegating»." }
            ],
            scene: {
              who: "Sarah", role: "Engineering Manager",
              text: "Have you worked with Kubernetes?", es: "¿Has trabajado con Kubernetes?",
              options: [
                { en: "Not in production, but I've used it in my lab and I'd love to go deeper.", ok: true, why: "Honesto y en positivo: lo que sabes y lo que quieres aprender." },
                { en: "No.", ok: false, why: "Cierra la conversación. Di lo que sí conoces." },
                { en: "Yes, of course, I know everything.", ok: false, why: "Exagerar se nota en la siguiente pregunta técnica." }
              ]
            }
          },
          {
            title: "Tus preguntas al final",
            level: "C1",
            items: [
              { en: "What does success look like here?", es: "¿Qué se considera éxito aquí?", gap: "look", wrong: ["see", "seem", "looks"] },
              { en: "How is the team structured?", es: "¿Cómo está organizado el equipo?", gap: "structured", wrong: ["structurated", "structure", "constructed"] },
              { en: "What's the on-call rotation like?", es: "¿Cómo son las guardias?", gap: "like", wrong: ["as", "how", "similar"], note: "«¿Cómo es…?» = «What's… like?». Nunca «How is… like?»." },
              { en: "What would my first 90 days look like?", say: "What would my first ninety days look like?", es: "¿Cómo serían mis primeros 90 días?", gap: "would", wrong: ["should", "wood", "did"] },
              { en: "What are the next steps?", es: "¿Cuáles son los siguientes pasos?", gap: "steps", wrong: ["stairs", "passes", "steeps"] },
              { en: "Thanks for your time today.", es: "Gracias por tu tiempo hoy.", gap: "time", wrong: ["times", "hour", "weather"], note: "«Tiempo» del reloj es «time»; el del clima, «weather»." }
            ],
            scene: {
              who: "Sarah", role: "Engineering Manager",
              text: "Do you have any questions for us?", es: "¿Tienes alguna pregunta para nosotros?",
              options: [
                { en: "Yes. What would my first 90 days look like?", ok: true, why: "Muestra interés por hacerlo bien desde el principio." },
                { en: "No, everything is clear.", ok: false, why: "Pregunta siempre algo: demuestra interés." },
                { en: "How much is the salary?", ok: false, why: "Es válida, pero mejor más adelante, en la fase de oferta." }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: "explain",
    code: "03",
    title: "Explicar ideas técnicas",
    desc: "Proponer, comparar alternativas y dar estimaciones.",
    soon: ["Proponer", "Comparar alternativas", "Dar estimaciones"],
    units: []
  },
  {
    id: "ops",
    code: "04",
    title: "Incidencias y code review",
    desc: "Guardias, post-mortems y comentarios en PR.",
    soon: ["On-call", "Post-mortem", "Comentarios en PR"],
    units: []
  },
  {
    id: "mistakes",
    code: "05",
    title: "Errores que delatan al hispanohablante",
    desc: "Tiempos verbales, tono demasiado directo y falsos amigos.",
    units: [
      {
        id: "tenses",
        title: "Tiempos verbales",
        desc: "Ayer, hoy y «llevo…»: el error número uno en los dailies.",
        lessons: [
          {
            title: "Ayer frente a hoy",
            level: "B1",
            items: [
              { en: "Yesterday I finished the module.", es: "Ayer terminé el módulo.", gap: "finished", wrong: ["have finished", "finish", "finishing"], note: "Con «yesterday», «last week» o una hora concreta, pasado simple. Nunca «have finished»." },
              { en: "I've just pushed the fix.", es: "Acabo de subir el arreglo.", gap: "just", wrong: ["already", "yet", "now"], note: "«Acabo de…» = «I've just…»." },
              { en: "I've been on it since Monday.", es: "Llevo con ello desde el lunes.", gap: "since", wrong: ["for", "from", "during"], note: "«Since» + el momento en que empezó." },
              { en: "I worked on it for two days.", es: "Estuve dos días con ello.", gap: "for", wrong: ["since", "during", "by"], note: "«For» + cuánto tiempo." },
              { en: "Have you deployed it yet?", es: "¿Lo has desplegado ya?", gap: "yet", wrong: ["still", "now", "until"], note: "En preguntas y negativas, «ya» suele ser «yet»." },
              { en: "It's been down for an hour.", es: "Lleva caído una hora.", gap: "been", wrong: ["is", "was", "being"], note: "«Llevar + tiempo» = «have been + for»." }
            ],
            scene: {
              who: "Emma", role: "Scrum Master",
              text: "Did you finish the migration?", es: "¿Terminaste la migración?",
              options: [
                { en: "Yes, I finished it yesterday.", ok: true, why: "Momento concreto del pasado, pasado simple." },
                { en: "Yes, I have finished it yesterday.", ok: false, why: "Con «yesterday» no se usa «have finished». Es el error más típico." },
                { en: "Yes, I finish it yesterday.", ok: false, why: "Falta el pasado: «finished»." }
              ]
            }
          },
          {
            title: "Llevo… desde…",
            level: "B2",
            items: [
              { en: "How long have you been on this?", es: "¿Cuánto llevas con esto?", gap: "long", wrong: ["much", "many", "time"], note: "«¿Cuánto tiempo?» = «How long?», no «How much time»." },
              { en: "I've been on call all week.", es: "He estado de guardia toda la semana.", gap: "on", wrong: ["in", "at", "of"] },
              { en: "We've had three incidents this month.", es: "Llevamos tres incidencias este mes.", gap: "had", wrong: ["have", "having", "has"], note: "«This month» aún no ha terminado: presente perfecto." },
              { en: "I've worked here since 2016.", say: "I've worked here since twenty sixteen.", es: "Trabajo aquí desde 2016.", gap: "since", wrong: ["for", "from", "during"], note: "«Trabajo aquí desde…» no es «I work here since»: es «I've worked»." },
              { en: "I used to work with Ansible.", es: "Antes trabajaba con Ansible.", gap: "used", wrong: ["use", "was", "usually"], note: "«Antes hacía…» = «I used to…»." },
              { en: "It'll be done by the time you're back.", es: "Estará listo para cuando vuelvas.", gap: "by", wrong: ["until", "when", "for"] }
            ],
            scene: {
              who: "Sarah", role: "Engineering Manager",
              text: "How long have you been working with Terraform?", es: "¿Cuánto llevas trabajando con Terraform?",
              options: [
                { en: "I've been working with it for about three years.", ok: true, why: "Presente perfecto continuo con «for»: perfecto." },
                { en: "I am working with it since three years.", ok: false, why: "Calco de «desde hace». Es «I've been working with it for three years»." },
                { en: "Since three years.", ok: false, why: "Con una duración, «for three years», nunca «since»." }
              ]
            }
          }
        ]
      },
      {
        id: "tone",
        title: "Suavizar el tono",
        desc: "El español directo traducido suena brusco. Así se suena profesional.",
        lessons: [
          {
            title: "Pedir sin sonar brusco",
            level: "B1",
            items: [
              { en: "Could you take a look?", es: "¿Podrías echarle un vistazo?", gap: "Could", wrong: ["Must", "Do", "Shall"] },
              { en: "Would you mind checking this?", es: "¿Te importaría revisar esto?", gap: "mind", wrong: ["matter", "care", "import"], note: "Después de «would you mind», -ing." },
              { en: "When you have a moment.", es: "Cuando tengas un momento.", gap: "When", wrong: ["While", "Then", "As"] },
              { en: "No pressure.", es: "Sin presión.", gap: "pressure", wrong: ["press", "pression", "pushing"] },
              { en: "Just a thought.", es: "Es solo una idea.", gap: "thought", wrong: ["think", "thinking", "thoughts"] },
              { en: "I might be wrong, but…", es: "Puede que me equivoque, pero…", gap: "wrong", wrong: ["wronged", "bad", "error"] }
            ],
            scene: {
              who: "Ana", role: "Backend Developer",
              text: "I'm a bit busy. What's up?", es: "Estoy algo liada. ¿Qué pasa?",
              options: [
                { en: "No rush, but could you take a look at my PR when you have a moment?", ok: true, why: "Pides lo que necesitas sin presionar." },
                { en: "You must review my PR now.", ok: false, why: "«Must» suena a orden, sobre todo a una compañera." },
                { en: "Review my PR, please.", ok: false, why: "El «please» no basta: el imperativo suena brusco. Mejor «Could you…?»." }
              ]
            }
          },
          {
            title: "Discrepar con educación",
            level: "B2",
            items: [
              { en: "I see it a bit differently.", es: "Yo lo veo algo distinto.", gap: "differently", wrong: ["different", "difference", "differ"] },
              { en: "Have we considered caching?", es: "¿Hemos pensado en usar caché?", gap: "considered", wrong: ["considerated", "consider", "pensed"] },
              { en: "That's a fair point.", es: "Es un argumento razonable.", gap: "fair", wrong: ["fear", "fare", "just"] },
              { en: "I'd suggest a smaller change.", es: "Yo propondría un cambio más pequeño.", gap: "suggest", wrong: ["suggestion", "sugest", "advice"] },
              { en: "Could we try another approach?", es: "¿Podríamos probar otro enfoque?", gap: "approach", wrong: ["focus", "aproach", "approximation"], note: "«Enfoque» es «approach», no «focus»." },
              { en: "I'm not sure that'll scale.", es: "No tengo claro que eso escale.", gap: "scale", wrong: ["escalate", "scalate", "climb"], note: "«Escalate» es escalar un problema a un superior, no crecer." }
            ],
            scene: {
              who: "Mike", role: "SRE",
              text: "Let's just restart the server every night.", es: "Reiniciemos el servidor cada noche y ya.",
              options: [
                { en: "I see it a bit differently. Could we find the root cause first?", ok: true, why: "Discrepas sin atacar y propones una alternativa." },
                { en: "That's a bad idea.", ok: false, why: "Demasiado directo. Empieza reconociendo y luego propón." },
                { en: "You are wrong, we must find the root cause.", ok: false, why: "«You are wrong» suena a ataque personal." }
              ]
            }
          },
          {
            title: "Code review con tacto",
            level: "C1",
            items: [
              { en: "Approved with minor comments.", es: "Aprobado, con comentarios menores.", gap: "minor", wrong: ["minus", "menor", "little"] },
              { en: "Could you add some context?", es: "¿Podrías añadir algo de contexto?", gap: "context", wrong: ["contest", "contents", "contexts"] },
              { en: "This might break backwards compatibility.", es: "Esto podría romper la compatibilidad hacia atrás.", gap: "break", wrong: ["broke", "crash", "breaking"] },
              { en: "Happy to discuss on a call.", es: "Encantado de hablarlo en una llamada.", gap: "discuss", wrong: ["argue", "discussing", "discussion"] },
              { en: "Can you rebase onto main?", es: "¿Puedes hacer rebase sobre main?", gap: "rebase", wrong: ["rebasing", "rebased", "reset"] },
              { en: "Feel free to ignore.", es: "Si quieres, ignóralo.", gap: "Feel", wrong: ["Fell", "Fill", "Feeling"], note: "Para comentarios opcionales. Quita peso a la sugerencia." }
            ],
            scene: {
              who: "Tom", role: "Backend Developer",
              text: "Any feedback on my PR?", es: "¿Algún comentario sobre mi PR?",
              options: [
                { en: "Looks good overall. A couple of non-blocking nits, happy to discuss.", ok: true, why: "Valoras lo bueno y dejas claro que no bloquea." },
                { en: "There are many errors. Change them.", ok: false, why: "Imperativo y sin contexto: suena a reproche." },
                { en: "Your code is bad, but OK.", ok: false, why: "Critica el código, nunca a la persona, y di qué cambiar." }
              ]
            }
          }
        ]
      },
      {
        id: "false-friends",
        title: "Falsos amigos",
        desc: "Palabras que parecen lo mismo y no lo son.",
        lessons: [
          {
            title: "Actually, eventually y compañía",
            level: "B1",
            items: [
              { en: "Actually, it's fixed.", es: "En realidad, ya está arreglado.", gap: "Actually", wrong: ["Currently", "Actual", "Nowadays"], note: "«Actually» = en realidad. «Actualmente» = «currently»." },
              { en: "Currently, we use Jenkins.", es: "Actualmente usamos Jenkins.", gap: "Currently", wrong: ["Actually", "Actual", "Actuality"] },
              { en: "Eventually, it worked.", es: "Al final, funcionó.", gap: "Eventually", wrong: ["Possibly", "Casually", "Eventual"], note: "«Eventually» = al final. «Eventualmente» = «possibly»." },
              { en: "I'll attend the meeting.", es: "Asistiré a la reunión.", gap: "attend", wrong: ["assist", "atend", "attend to"], note: "«Assist» es ayudar. Asistir a algo es «attend»." },
              { en: "The docs are outdated.", es: "La documentación está desactualizada.", gap: "outdated", wrong: ["desactualized", "disactualized", "old-dated"] },
              { en: "Sensitive data must be encrypted.", es: "Los datos sensibles deben ir cifrados.", gap: "Sensitive", wrong: ["Sensible", "Sensual", "Sensory"], note: "«Sensible» en inglés significa «sensato»." }
            ],
            scene: {
              who: "Laura", role: "Engineering Manager",
              text: "Is the old API still in use?", es: "¿La API antigua sigue en uso?",
              options: [
                { en: "Currently, yes. Eventually we'll remove it.", ok: true, why: "«Currently» = actualmente y «eventually» = al final. Bien usados." },
                { en: "Yes, it's the actual version.", ok: false, why: "«Actual» significa «real». La versión actual es «the current version»." },
                { en: "Actually yes, but eventually maybe no.", ok: false, why: "«Eventually» no es «eventualmente»: significa «al final»." }
              ]
            }
          }
        ]
      }
    ]
  }
];
