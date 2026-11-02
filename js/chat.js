/*
  Chat del equipo: los mensajes que más llegan en el día a día (Teams, Slack…)
  y cómo responder.
  rate: "best" (la mejor), "ok" (válida) o "avoid" (evítala). why = por qué.
*/
window.CHAT = [
  {
    who: "Ana", role: "Backend Developer", channel: "Mensaje directo",
    text: "Hey, quick question. Do you have a minute?", es: "Oye, una pregunta rápida. ¿Tienes un minuto?",
    replies: [
      { en: "Sure, what's up?", rate: "best", why: "Natural y abierto. Lo más común." },
      { en: "Give me 10 minutes, I'm in a call.", rate: "ok", why: "Perfecta si estás ocupado: das un plazo." },
      { en: "Yes, tell me.", rate: "avoid", why: "Calco de «sí, dime». Suena seco en inglés." }
    ]
  },
  {
    who: "Laura", role: "Engineering Manager", channel: "Mensaje directo",
    text: "Can you join a quick call in 5?", es: "¿Puedes unirte a una llamada rápida en 5 minutos?",
    replies: [
      { en: "Sure, joining in 5.", rate: "best", why: "Corto y claro." },
      { en: "Could we make it 15? I'm finishing something.", rate: "ok", why: "Propones otra hora con motivo." },
      { en: "Now I can't.", rate: "avoid", why: "Orden de palabras del español. Di «I can't right now»." }
    ]
  },
  {
    who: "Mike", role: "SRE", channel: "#team-platform",
    text: "Is the deploy still on for today?", es: "¿Sigue en pie el despliegue de hoy?",
    replies: [
      { en: "Yes, it's scheduled for 5 pm.", rate: "best", why: "«Scheduled» = programado en el calendario." },
      { en: "Yes, still on.", rate: "ok", why: "Correcto, aunque sin hora." },
      { en: "Yes, it's programmed for 5.", rate: "avoid", why: "«Programmed» es programar código. Para horarios, «scheduled»." }
    ]
  },
  {
    who: "Tom", role: "Backend Developer", channel: "Mensaje directo",
    text: "Can you review my PR when you get a chance?", es: "¿Puedes revisar mi PR cuando puedas?",
    replies: [
      { en: "Sure, I'll take a look this afternoon.", rate: "best", why: "Dices sí y cuándo." },
      { en: "On it.", rate: "ok", why: "Válido si te pones ya." },
      { en: "Yes, I revise it.", rate: "avoid", why: "«Revise» es reescribir. Revisar código es «review», y en futuro: «I'll review it»." }
    ]
  },
  {
    who: "Ana", role: "Backend Developer", channel: "Mensaje directo",
    text: "Did you see my message?", es: "¿Viste mi mensaje?",
    replies: [
      { en: "Sorry, I missed it. Looking now.", rate: "best", why: "Te disculpas y actúas." },
      { en: "Just saw it, give me a minute.", rate: "ok", why: "Correcto y natural." },
      { en: "No, I didn't see it.", rate: "avoid", why: "Correcto, pero seco. Añade qué vas a hacer." }
    ]
  },
  {
    who: "Laura", role: "Engineering Manager", channel: "Mensaje directo",
    text: "How's the migration going?", es: "¿Cómo va la migración?",
    replies: [
      { en: "Going well, about 70% done. Should be finished by Thursday.", rate: "best", why: "Estado, cifra y fecha." },
      { en: "Good, almost done.", rate: "ok", why: "Correcto, aunque poco concreto." },
      { en: "Good, I have done 70% yesterday.", rate: "avoid", why: "Con «yesterday», pasado simple: «I did». Y mejor da una fecha." }
    ]
  },
  {
    who: "Mike", role: "SRE", channel: "#team-platform",
    text: "The build is failing on main. Was it your change?", es: "La build falla en main. ¿Fue tu cambio?",
    replies: [
      { en: "Looking into it now. I'll revert if it's mine.", rate: "best", why: "Asumes y propones la solución." },
      { en: "Let me check.", rate: "ok", why: "Correcto, pero di cuándo vuelves." },
      { en: "Not my fault.", rate: "avoid", why: "A la defensiva. Primero mira, luego responde." }
    ]
  },
  {
    who: "Sarah", role: "Product Manager", channel: "Mensaje directo",
    text: "Are you free tomorrow at 10?", es: "¿Estás libre mañana a las 10?",
    replies: [
      { en: "Yes, 10 works for me.", rate: "best", why: "La fórmula estándar." },
      { en: "Could we do 11 instead?", rate: "ok", why: "Propones otra hora con educación." },
      { en: "Yes, I have free at 10.", rate: "avoid", why: "Calco de «tengo libre». Es «I'm free at 10»." }
    ]
  },
  {
    who: "Ana", role: "Backend Developer", channel: "Mensaje directo",
    text: "Thanks for your help today!", es: "¡Gracias por tu ayuda hoy!",
    replies: [
      { en: "Anytime! Glad it worked.", rate: "best", why: "Cercano y profesional." },
      { en: "No problem!", rate: "ok", why: "Correcto y muy común." },
      { en: "Of nothing!", rate: "avoid", why: "Calco de «de nada». Es «You're welcome» o «No problem»." }
    ]
  },
  {
    who: "Laura", role: "Engineering Manager", channel: "Mensaje directo",
    text: "Can you send me the report by EOD?", es: "¿Me puedes mandar el informe antes de que acabe el día?",
    replies: [
      { en: "Sure, I'll send it by 5.", rate: "best", why: "«By» + hora: compromiso claro." },
      { en: "I'll try, but it might be tomorrow morning.", rate: "ok", why: "Honesto: avisas antes." },
      { en: "Yes, until the end of the day.", rate: "avoid", why: "«Until» es duración. Fecha límite: «by the end of the day»." }
    ]
  },
  {
    who: "Tom", role: "Backend Developer", channel: "#team-platform",
    text: "Are you joining the stand-up?", es: "¿Te unes al daily?",
    replies: [
      { en: "Joining now, sorry!", rate: "best", why: "Rápido y educado." },
      { en: "Yes, one minute.", rate: "ok", why: "Válido." },
      { en: "I go now.", rate: "avoid", why: "Presente simple para algo inmediato suena raro: «I'm joining now»." }
    ]
  },
  {
    who: "Mike", role: "SRE · on-call", channel: "#incident",
    text: "Prod is down. Can you help?", es: "Producción está caída. ¿Puedes ayudar?",
    replies: [
      { en: "On it. Joining the incident call now.", rate: "best", why: "Lo que se espera en una incidencia." },
      { en: "Yes, what do you need from me?", rate: "ok", why: "Correcto: preguntas cómo ayudar." },
      { en: "It's fallen?", rate: "avoid", why: "Calco de «¿se ha caído?». Es «Is it down?»." }
    ]
  },
  {
    who: "Ana", role: "Backend Developer", channel: "Mensaje directo",
    text: "Can you add me to the repo?", es: "¿Me añades al repositorio?",
    replies: [
      { en: "Done! You should have access now.", rate: "best", why: "Lo haces y lo confirmas." },
      { en: "Sure, give me a minute.", rate: "ok", why: "Válido." },
      { en: "Yes, I add you.", rate: "avoid", why: "Falta el futuro: «I'll add you»." }
    ]
  },
  {
    who: "Laura", role: "Engineering Manager", channel: "Mensaje directo",
    text: "Can we move our 1:1 to Thursday?", es: "¿Podemos mover nuestra 1:1 al jueves?",
    replies: [
      { en: "Sure, Thursday works. Same time?", rate: "best", why: "Aceptas y concretas." },
      { en: "Thursday is fine.", rate: "ok", why: "Correcto." },
      { en: "Whatever.", rate: "avoid", why: "Suena a que te da igual. Muy maleducado en inglés." }
    ]
  },
  {
    who: "Tom", role: "Backend Developer", channel: "Mensaje directo",
    text: "I'm stuck with a Terraform error. Any ideas?", es: "Estoy atascado con un error de Terraform. ¿Alguna idea?",
    replies: [
      { en: "Can you share the error? Happy to jump on a call.", rate: "best", why: "Pides datos y ofreces ayuda." },
      { en: "Did you run terraform init?", rate: "ok", why: "Útil, aunque directo." },
      { en: "Search on Google.", rate: "avoid", why: "Suena despectivo." }
    ]
  },
  {
    who: "Ana", role: "Backend Developer", channel: "Mensaje directo",
    text: "Running 5 mins late to the meeting, sorry!", es: "Llego 5 minutos tarde a la reunión, ¡perdón!",
    replies: [
      { en: "No worries, see you soon.", rate: "best", why: "Tranquilizas y cierras." },
      { en: "OK, thanks for letting me know.", rate: "ok", why: "Correcto." },
      { en: "No problem, we wait you.", rate: "avoid", why: "Falta «for»: «we'll wait for you»." }
    ]
  },
  {
    who: "Laura", role: "Engineering Manager", channel: "#team-platform",
    text: "Great job on the release, everyone!", es: "¡Buen trabajo con la release, equipo!",
    replies: [
      { en: "Thanks! It was a team effort.", rate: "best", why: "Agradeces y compartes el mérito." },
      { en: "Thank you!", rate: "ok", why: "Correcto." },
      { en: "Thanks, I know.", rate: "avoid", why: "Suena arrogante." }
    ]
  },
  {
    who: "Mike", role: "SRE", channel: "Mensaje directo",
    text: "Can you cover my on-call on Saturday?", es: "¿Me cubres la guardia del sábado?",
    replies: [
      { en: "Sure, I can cover. Can we swap for next weekend?", rate: "best", why: "Ayudas y negocias." },
      { en: "Sorry, I can't this weekend. Maybe ask Ana?", rate: "ok", why: "Dices que no con educación y una alternativa." },
      { en: "Impossible.", rate: "avoid", why: "Demasiado tajante." }
    ]
  },
  {
    who: "Priya", role: "New joiner", channel: "#team-platform",
    text: "Hi all! I'm Priya, I just joined the team.", es: "¡Hola a todos! Soy Priya, me acabo de incorporar al equipo.",
    replies: [
      { en: "Welcome, Priya! Let me know if you need anything.", rate: "best", why: "Das la bienvenida y ofreces ayuda." },
      { en: "Hi Priya, welcome!", rate: "ok", why: "Correcto." },
      { en: "Hello, I have 20 years here.", rate: "avoid", why: "«Llevo 20 años aquí» es «I've been here for 20 years»." }
    ]
  },
  {
    who: "Laura", role: "Engineering Manager", channel: "#team-platform",
    text: "Any blockers?", es: "¿Algún bloqueo?",
    replies: [
      { en: "One: I'm waiting on access to the prod account.", rate: "best", why: "Dices cuál y qué necesitas." },
      { en: "No blockers, thanks.", rate: "best", why: "Perfecta si no tienes ninguno." },
      { en: "No, I have no blockings.", rate: "avoid", why: "«Blockings» no existe: «no blockers»." }
    ]
  },
  {
    who: "Ana", role: "Backend Developer", channel: "Mensaje directo",
    text: "Can you explain how the pipeline works?", es: "¿Me explicas cómo funciona la pipeline?",
    replies: [
      { en: "Sure! Quick call, or should I write it up?", rate: "best", why: "Ofreces dos formas. Muy profesional." },
      { en: "Sure, here's the doc.", rate: "ok", why: "Válido si hay documentación." },
      { en: "Explain me which part.", rate: "avoid", why: "Nunca «explain me». Di «Which part should I explain?»." }
    ]
  },
  {
    who: "Tom", role: "Backend Developer", channel: "Mensaje directo",
    text: "Lunch?", es: "¿Comemos?",
    replies: [
      { en: "Sure, 1 pm?", rate: "best", why: "Natural." },
      { en: "Can't today, maybe tomorrow?", rate: "ok", why: "Dices que no y propones otro día." },
      { en: "Yes, I go to eat with you.", rate: "avoid", why: "Calco. Lo natural es «Sure, let's go»." }
    ]
  },
  {
    who: "Laura", role: "Engineering Manager", channel: "#team-platform",
    text: "Please update your tickets before planning.", es: "Actualizad vuestros tickets antes del planning.",
    replies: [
      { en: "Will do, thanks for the reminder.", rate: "best", why: "Confirmas y agradeces." },
      { en: "Done.", rate: "ok", why: "Perfecto si ya está." },
      { en: "Yes, yes.", rate: "avoid", why: "Suena a que no te importa." }
    ]
  },
  {
    who: "Sarah", role: "Product Manager", channel: "Mensaje directo",
    text: "When will the feature be ready?", es: "¿Cuándo estará lista la funcionalidad?",
    replies: [
      { en: "We're aiming for the end of the sprint. I'll confirm on Friday.", rate: "best", why: "Estimación y cuándo confirmarás." },
      { en: "Probably next week.", rate: "ok", why: "Válido, aunque poco firme." },
      { en: "Soon.", rate: "avoid", why: "Demasiado vago para producto." }
    ]
  },
  {
    who: "Ana", role: "Backend Developer", channel: "Mensaje directo",
    text: "Sorry to bother you on your day off!", es: "¡Perdona que te moleste en tu día libre!",
    replies: [
      { en: "No worries. Is it urgent, or can it wait until tomorrow?", rate: "best", why: "Amable y pones límites." },
      { en: "No problem, what do you need?", rate: "ok", why: "Correcto si te viene bien ayudar." },
      { en: "Don't worry, I'm connected all the day.", rate: "avoid", why: "«All day», sin «the». Y no hace falta decirlo." }
    ]
  },
  {
    who: "Laura", role: "Engineering Manager", channel: "Mensaje directo",
    text: "Could you present this at the all-hands?", es: "¿Podrías presentarlo en la reunión general?",
    replies: [
      { en: "Sure, happy to. When is it?", rate: "best", why: "Aceptas y preguntas lo que necesitas." },
      { en: "Could I have a few days to prepare?", rate: "ok", why: "Pides tiempo con educación." },
      { en: "My English is not good, better not.", rate: "avoid", why: "No te infravalores: acepta y practícalo antes." }
    ]
  },
  {
    who: "Tom", role: "Backend Developer", channel: "#team-platform",
    text: "Is the API down for you too?", es: "¿A ti también se te ha caído la API?",
    replies: [
      { en: "Yes, I'm getting 500s too. Opening an incident.", rate: "best", why: "Confirmas y actúas." },
      { en: "Works for me. Which endpoint?", rate: "ok", why: "Útil: pides más datos." },
      { en: "Yes, it's fallen for me too.", rate: "avoid", why: "Calco de «se ha caído». Es «it's down»." }
    ]
  },
  {
    who: "Mike", role: "SRE", channel: "#random",
    text: "Happy Friday! Any plans for the weekend?", es: "¡Feliz viernes! ¿Planes para el finde?",
    replies: [
      { en: "Nothing big, just relaxing. You?", rate: "best", why: "Respondes y devuelves la pregunta." },
      { en: "Going to the mountains with the kids.", rate: "ok", why: "Natural." },
      { en: "Yes.", rate: "avoid", why: "Corta la conversación." }
    ]
  },
  {
    who: "Laura", role: "Engineering Manager", channel: "Mensaje directo",
    text: "Can you take the lead on this?", es: "¿Puedes liderar esto?",
    replies: [
      { en: "Sure, I'll take it. I'll share a plan by Wednesday.", rate: "best", why: "Aceptas y te comprometes a un siguiente paso." },
      { en: "Happy to. Who else is involved?", rate: "ok", why: "Aceptas y preguntas." },
      { en: "OK, I'll lead it, but I'm very full.", rate: "avoid", why: "«I'm very full» es estar lleno de comer. Di «I'm quite busy»." }
    ]
  },
  {
    who: "Ana", role: "Backend Developer", channel: "Mensaje directo",
    text: "Did you finish the ticket?", es: "¿Terminaste el ticket?",
    replies: [
      { en: "Yes, I finished it this morning.", rate: "best", why: "Pasado simple con momento concreto." },
      { en: "Almost, I'm on the tests now.", rate: "ok", why: "Correcto: estado actual." },
      { en: "Yes, I have finished it this morning at 9.", rate: "avoid", why: "Con hora concreta, pasado simple: «I finished it at 9»." }
    ]
  }
];
