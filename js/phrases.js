/*
  Frases de stand-up.
  l   = nivel (A1, A2, B1, B2, C1)
  c   = categoría (daily, interview, meetings, email, tech, idioms)
  en  = frase en inglés
  es  = traducción
  ex  = ejemplo de uso en inglés
  tip = nota opcional en castellano
*/
window.PHRASES = [
  /* ───────────── Día a día ───────────── */
  { l: "A1", c: "daily", en: "Good morning! How are you?", es: "¡Buenos días! ¿Qué tal?", ex: "Good morning, Anna! How are you today?" },
  { l: "A1", c: "daily", en: "Nice to meet you.", es: "Encantado de conocerte.", ex: "Hi, I'm Sergio. Nice to meet you." },
  { l: "A1", c: "daily", en: "Where is the meeting room?", es: "¿Dónde está la sala de reuniones?", ex: "Excuse me, where is the meeting room?" },
  { l: "A1", c: "daily", en: "Can you repeat that, please?", es: "¿Puedes repetirlo, por favor?", ex: "Sorry, can you repeat that, please?", tip: "Úsala sin miedo: los nativos también la dicen." },
  { l: "A1", c: "daily", en: "I don't understand.", es: "No lo entiendo.", ex: "Sorry, I don't understand. Can you write it down?" },
  { l: "A1", c: "daily", en: "See you tomorrow.", es: "Hasta mañana.", ex: "Bye, everyone! See you tomorrow." },

  { l: "A2", c: "daily", en: "I'm running late.", es: "Voy con retraso.", ex: "Sorry, I'm running late. I'll be there in ten minutes." },
  { l: "A2", c: "daily", en: "Do you want a coffee?", es: "¿Quieres un café?", ex: "I'm going to the kitchen. Do you want a coffee?" },
  { l: "A2", c: "daily", en: "How was your weekend?", es: "¿Qué tal el fin de semana?", ex: "Hi Tom! How was your weekend?", tip: "La pregunta típica de los lunes." },
  { l: "A2", c: "daily", en: "I'm working from home today.", es: "Hoy teletrabajo.", ex: "I'm working from home today, so call me on Teams." },
  { l: "A2", c: "daily", en: "Could you speak more slowly, please?", es: "¿Podrías hablar más despacio, por favor?", ex: "Could you speak more slowly, please? My English is not perfect." },
  { l: "A2", c: "daily", en: "Don't worry.", es: "No te preocupes.", ex: "Don't worry, I can do it tomorrow." },

  { l: "B1", c: "daily", en: "I'm off on Friday.", es: "El viernes no trabajo.", ex: "I'm off on Friday, so let's meet on Thursday." },
  { l: "B1", c: "daily", en: "Let's grab lunch.", es: "Vamos a comer algo.", ex: "It's one o'clock. Let's grab lunch!" },
  { l: "B1", c: "daily", en: "I'm swamped this week.", es: "Esta semana voy a tope.", ex: "I'm swamped this week. Can we talk next Monday?" },
  { l: "B1", c: "daily", en: "What do you mean by that?", es: "¿Qué quieres decir con eso?", ex: "Sorry, what do you mean by that?" },
  { l: "B1", c: "daily", en: "Don't mention it.", es: "No hay de qué.", ex: "Thanks for your help! — Don't mention it." },

  { l: "B2", c: "daily", en: "I didn't catch your name.", es: "No he pillado tu nombre.", ex: "Sorry, I didn't catch your name." },
  { l: "B2", c: "daily", en: "I'm not sure I follow.", es: "No sé si te sigo.", ex: "I'm not sure I follow. Could you give me an example?" },
  { l: "B2", c: "daily", en: "Sorry to bother you, have you got a minute?", es: "Perdona que te moleste, ¿tienes un minuto?", ex: "Sorry to bother you, have you got a minute? I have a quick question." },
  { l: "B2", c: "daily", en: "Long time no see!", es: "¡Cuánto tiempo!", ex: "Hey, Laura! Long time no see!" },
  { l: "B2", c: "daily", en: "Bear with me.", es: "Dame un momento, ten paciencia.", ex: "Bear with me, I'm looking for the file." },

  { l: "C1", c: "daily", en: "I'll leave you to it.", es: "Te dejo que sigas con lo tuyo.", ex: "Looks like you're busy. I'll leave you to it." },
  { l: "C1", c: "daily", en: "It slipped my mind.", es: "Se me pasó por completo.", ex: "I'm so sorry, it completely slipped my mind." },
  { l: "C1", c: "daily", en: "I'm running on fumes.", es: "Voy sin energía, en reserva.", ex: "After three on-call nights, I'm running on fumes." },
  { l: "C1", c: "daily", en: "That's a weight off my mind.", es: "Me quito un peso de encima.", ex: "The release went fine. That's a weight off my mind." },
  { l: "C1", c: "daily", en: "I'm still getting my head around it.", es: "Todavía lo estoy asimilando.", ex: "The new process is complex. I'm still getting my head around it." },

  /* ───────────── Entrevistas ───────────── */
  { l: "A1", c: "interview", en: "My name is Sergio. I am an engineer.", es: "Me llamo Sergio. Soy ingeniero.", ex: "Hello. My name is Sergio. I am an engineer." },
  { l: "A1", c: "interview", en: "I live in Madrid.", es: "Vivo en Madrid.", ex: "I live in Madrid, in Spain." },
  { l: "A1", c: "interview", en: "I work in IT.", es: "Trabajo en informática.", ex: "I work in IT, in a big bank." },
  { l: "A1", c: "interview", en: "I speak Spanish and a little English.", es: "Hablo español y un poco de inglés.", ex: "I speak Spanish and a little English." },

  { l: "A2", c: "interview", en: "I have ten years of experience.", es: "Tengo diez años de experiencia.", ex: "I have ten years of experience in systems." },
  { l: "A2", c: "interview", en: "I work in a team of five people.", es: "Trabajo en un equipo de cinco personas.", ex: "I work in a team of five people in Madrid." },
  { l: "A2", c: "interview", en: "I like solving problems.", es: "Me gusta resolver problemas.", ex: "I like solving problems and learning new things." },
  { l: "A2", c: "interview", en: "I'm available from next month.", es: "Estoy disponible a partir del mes que viene.", ex: "I'm available from next month." },

  { l: "B1", c: "interview", en: "Tell me about yourself.", es: "Háblame de ti.", ex: "So, tell me about yourself.", tip: "Casi siempre es la primera pregunta. Prepárala en 1 minuto." },
  { l: "B1", c: "interview", en: "In my current role, I'm responsible for...", es: "En mi puesto actual, me encargo de...", ex: "In my current role, I'm responsible for automating our infrastructure." },
  { l: "B1", c: "interview", en: "I'm looking for a new challenge.", es: "Busco un nuevo reto.", ex: "I'm happy in my job, but I'm looking for a new challenge." },
  { l: "B1", c: "interview", en: "What are your strengths?", es: "¿Cuáles son tus puntos fuertes?", ex: "What are your strengths? — I'm organised and I learn fast." },
  { l: "B1", c: "interview", en: "I work well under pressure.", es: "Trabajo bien bajo presión.", ex: "I work well under pressure, for example during incidents." },

  { l: "B2", c: "interview", en: "Where do you see yourself in five years?", es: "¿Dónde te ves dentro de cinco años?", ex: "Where do you see yourself in five years? — Leading a platform team." },
  { l: "B2", c: "interview", en: "Can you give me an example of a time when...?", es: "¿Me puedes dar un ejemplo de una vez en que...?", ex: "Can you give me an example of a time when you solved a conflict?", tip: "Responde con el método STAR: situación, tarea, acción y resultado." },
  { l: "B2", c: "interview", en: "I led the migration to the cloud.", es: "Lideré la migración a la nube.", ex: "Last year I led the migration of our services to the cloud." },
  { l: "B2", c: "interview", en: "What does a typical day look like?", es: "¿Cómo es un día normal en este puesto?", ex: "What does a typical day look like in this role?", tip: "Una buena pregunta para hacer tú al final." },
  { l: "B2", c: "interview", en: "My biggest weakness is that I take on too much.", es: "Mi mayor debilidad es que asumo demasiadas cosas.", ex: "My biggest weakness is that I sometimes take on too much, so now I prioritise better." },

  { l: "C1", c: "interview", en: "I thrive in fast-paced environments.", es: "Rindo mejor en entornos dinámicos.", ex: "I thrive in fast-paced environments where things change quickly." },
  { l: "C1", c: "interview", en: "I bring a pragmatic approach.", es: "Aporto un enfoque práctico.", ex: "I'd like to think I bring a pragmatic approach to problem-solving." },
  { l: "C1", c: "interview", en: "What would success look like in the first 90 days?", es: "¿Qué sería un éxito en los primeros 90 días?", ex: "What would success look like in the first 90 days?" },
  { l: "C1", c: "interview", en: "I'm keen to understand how the team is structured.", es: "Me interesa entender cómo está organizado el equipo.", ex: "I'm keen to understand how the team is structured and who I'd work with." },
  { l: "C1", c: "interview", en: "That's a great question.", es: "Buena pregunta.", ex: "That's a great question. Let me think about it for a second.", tip: "Te da unos segundos para pensar la respuesta." },

  /* ───────────── Reuniones ───────────── */
  { l: "A1", c: "meetings", en: "Can you hear me?", es: "¿Me oyes?", ex: "Hello? Can you hear me?" },
  { l: "A1", c: "meetings", en: "Yes, I agree.", es: "Sí, estoy de acuerdo.", ex: "Yes, I agree with Peter." },
  { l: "A1", c: "meetings", en: "I have a question.", es: "Tengo una pregunta.", ex: "Sorry, I have a question." },
  { l: "A1", c: "meetings", en: "Thank you, everyone.", es: "Gracias a todos.", ex: "Thank you, everyone. Have a nice day!" },

  { l: "A2", c: "meetings", en: "You're on mute.", es: "Tienes el micro silenciado.", ex: "Sorry, Mark, you're on mute." },
  { l: "A2", c: "meetings", en: "Can you see my screen?", es: "¿Veis mi pantalla?", ex: "OK, can you see my screen now?" },
  { l: "A2", c: "meetings", en: "Sorry, I was on mute.", es: "Perdón, tenía el micro silenciado.", ex: "Sorry, I was on mute. Can you ask again?" },
  { l: "A2", c: "meetings", en: "Let's start.", es: "Empecemos.", ex: "Everyone is here. Let's start." },
  { l: "A2", c: "meetings", en: "I have to leave early today.", es: "Hoy tengo que irme antes.", ex: "Sorry, I have to leave early today." },

  { l: "B1", c: "meetings", en: "Yesterday I finished the script. Today I'll test it. No blockers.", es: "Ayer terminé el script. Hoy lo probaré. Sin bloqueos.", ex: "Yesterday I finished the backup script. Today I'll test it. No blockers.", tip: "Así se cuenta el daily stand-up: ayer, hoy y bloqueos." },
  { l: "B1", c: "meetings", en: "Shall we move on to the next point?", es: "¿Pasamos al siguiente punto?", ex: "Shall we move on to the next point?" },
  { l: "B1", c: "meetings", en: "Could you share your screen?", es: "¿Puedes compartir pantalla?", ex: "Could you share your screen, please?" },
  { l: "B1", c: "meetings", en: "I'll send the notes after the meeting.", es: "Mando las notas después de la reunión.", ex: "I'll send the notes after the meeting." },
  { l: "B1", c: "meetings", en: "I'm blocked by the network team.", es: "Estoy bloqueado por el equipo de red.", ex: "I'm blocked by the network team. They need to open a port." },

  { l: "B2", c: "meetings", en: "Let's take this offline.", es: "Lo hablamos aparte.", ex: "This is getting long. Let's take this offline.", tip: "Muy típica en el daily: no es 'desconectarse', es 'hablarlo fuera de la reunión'." },
  { l: "B2", c: "meetings", en: "Just to clarify...", es: "Solo para aclarar...", ex: "Just to clarify, are we deploying on Tuesday or Wednesday?" },
  { l: "B2", c: "meetings", en: "I see your point, but...", es: "Entiendo lo que dices, pero...", ex: "I see your point, but I think it's too risky." },
  { l: "B2", c: "meetings", en: "Can we circle back to this later?", es: "¿Podemos retomarlo luego?", ex: "Can we circle back to this later? We're short on time." },
  { l: "B2", c: "meetings", en: "Who's going to own this?", es: "¿Quién se encarga de esto?", ex: "Great idea. Who's going to own this?" },
  { l: "B2", c: "meetings", en: "Are we all on the same page?", es: "¿Estamos todos de acuerdo?", ex: "Before we finish, are we all on the same page?" },

  { l: "C1", c: "meetings", en: "Let's not get bogged down in the details.", es: "No nos atasquemos en los detalles.", ex: "Let's not get bogged down in the details. What's the decision?" },
  { l: "C1", c: "meetings", en: "To play devil's advocate...", es: "Haciendo de abogado del diablo...", ex: "To play devil's advocate, what if the vendor says no?" },
  { l: "C1", c: "meetings", en: "I'd push back on that slightly.", es: "Ahí discreparía un poco.", ex: "I'd push back on that slightly. The data says otherwise." },
  { l: "C1", c: "meetings", en: "Let's park that for now.", es: "Dejemos eso aparcado de momento.", ex: "Good point, but let's park that for now." },
  { l: "C1", c: "meetings", en: "I couldn't agree more.", es: "No podría estar más de acuerdo.", ex: "I couldn't agree more. Let's go with option B." },

  /* ───────────── Correos y chat ───────────── */
  { l: "A1", c: "email", en: "Hi team,", es: "Hola, equipo:", ex: "Hi team, the meeting is at ten." },
  { l: "A1", c: "email", en: "Thanks!", es: "¡Gracias!", ex: "Got it. Thanks!" },
  { l: "A1", c: "email", en: "Best regards,", es: "Un saludo,", ex: "Best regards, Sergio" },
  { l: "A1", c: "email", en: "See you on Monday.", es: "Nos vemos el lunes.", ex: "Have a nice weekend. See you on Monday." },

  { l: "A2", c: "email", en: "Please find attached the report.", es: "Adjunto el informe.", ex: "Hi Paul, please find attached the report." },
  { l: "A2", c: "email", en: "I hope you're well.", es: "Espero que estés bien.", ex: "Hi Sarah, I hope you're well." },
  { l: "A2", c: "email", en: "Let me know.", es: "Avísame / dime algo.", ex: "Can you come on Thursday? Let me know." },
  { l: "A2", c: "email", en: "Sorry for the late reply.", es: "Perdona por tardar en responder.", ex: "Sorry for the late reply. I was on holiday." },

  { l: "B1", c: "email", en: "Just a quick reminder that...", es: "Solo un recordatorio rápido de que...", ex: "Just a quick reminder that the change is tonight at 10 pm." },
  { l: "B1", c: "email", en: "Could you please confirm?", es: "¿Puedes confirmarlo, por favor?", ex: "Could you please confirm the time of the meeting?" },
  { l: "B1", c: "email", en: "I'm following up on my previous email.", es: "Te escribo sobre mi correo anterior.", ex: "Hi Mike, I'm following up on my previous email about the access request." },
  { l: "B1", c: "email", en: "Looking forward to hearing from you.", es: "Quedo a la espera de tu respuesta.", ex: "Looking forward to hearing from you. Best, Sergio" },
  { l: "B1", c: "email", en: "FYI", es: "Para tu información", ex: "FYI, the server will be down tonight.", tip: "Se lee letra a letra: «ef-wai-ai». Significa 'for your information'." },

  { l: "B2", c: "email", en: "As discussed in today's meeting...", es: "Como hablamos en la reunión de hoy...", ex: "As discussed in today's meeting, here are the next steps." },
  { l: "B2", c: "email", en: "I'd appreciate it if you could...", es: "Te agradecería que pudieras...", ex: "I'd appreciate it if you could review the PR today." },
  { l: "B2", c: "email", en: "Please let me know if anything is unclear.", es: "Avísame si algo no queda claro.", ex: "Please let me know if anything is unclear." },
  { l: "B2", c: "email", en: "I've looped in Maria.", es: "He añadido a María al hilo.", ex: "I've looped in Maria from the storage team." },
  { l: "B2", c: "email", en: "Let's touch base next week.", es: "Hablamos la semana que viene.", ex: "No rush. Let's touch base next week." },

  { l: "C1", c: "email", en: "Apologies for any inconvenience this may have caused.", es: "Disculpa las molestias que haya podido causar.", ex: "The outage is now fixed. Apologies for any inconvenience this may have caused." },
  { l: "C1", c: "email", en: "I'd like to flag a potential issue.", es: "Quiero avisar de un posible problema.", ex: "I'd like to flag a potential issue with the certificate renewal." },
  { l: "C1", c: "email", en: "Further to our conversation...", es: "En relación con lo que hablamos...", ex: "Further to our conversation, I've attached the updated design." },
  { l: "C1", c: "email", en: "Happy to discuss further.", es: "Encantado de hablarlo con más detalle.", ex: "This is just a first proposal. Happy to discuss further." },
  { l: "C1", c: "email", en: "Gentle reminder.", es: "Te lo recuerdo amablemente.", ex: "Gentle reminder: the approval is still pending.", tip: "Una forma educada de meter prisa." },

  /* ───────────── Técnico ───────────── */
  { l: "A1", c: "tech", en: "The server is down.", es: "El servidor está caído.", ex: "Help! The server is down." },
  { l: "A1", c: "tech", en: "It doesn't work.", es: "No funciona.", ex: "I click the button, but it doesn't work." },
  { l: "A1", c: "tech", en: "Restart the computer.", es: "Reinicia el ordenador.", ex: "Please restart the computer and try again." },
  { l: "A1", c: "tech", en: "It's very slow.", es: "Va muy lento.", ex: "The website is very slow today." },

  { l: "A2", c: "tech", en: "I can't log in.", es: "No puedo iniciar sesión.", ex: "I can't log in. My password doesn't work." },
  { l: "A2", c: "tech", en: "Check the logs.", es: "Mira los logs.", ex: "There is an error. Check the logs, please." },
  { l: "A2", c: "tech", en: "I'm deploying a new version.", es: "Estoy desplegando una versión nueva.", ex: "Wait five minutes. I'm deploying a new version." },
  { l: "A2", c: "tech", en: "Did you try it again?", es: "¿Lo has vuelto a probar?", ex: "Did you try it again after the update?" },

  { l: "B1", c: "tech", en: "We need to roll back the last deployment.", es: "Hay que hacer rollback del último despliegue.", ex: "The new version has a bug. We need to roll back the last deployment." },
  { l: "B1", c: "tech", en: "The ticket is assigned to the network team.", es: "El ticket está asignado al equipo de red.", ex: "The ticket is assigned to the network team, not to us." },
  { l: "B1", c: "tech", en: "It works on my machine.", es: "En mi máquina funciona.", ex: "I don't know what happened. It works on my machine!", tip: "La frase más famosa (y graciosa) del mundo dev." },
  { l: "B1", c: "tech", en: "Let's open an incident.", es: "Abramos una incidencia.", ex: "Users can't pay. Let's open an incident." },
  { l: "B1", c: "tech", en: "The disk is almost full.", es: "El disco está casi lleno.", ex: "The disk is almost full. We need more storage." },

  { l: "B2", c: "tech", en: "What's the root cause?", es: "¿Cuál es la causa raíz?", ex: "OK, it's fixed. But what's the root cause?" },
  { l: "B2", c: "tech", en: "We've hit the rate limit.", es: "Hemos llegado al límite de peticiones.", ex: "The API is failing because we've hit the rate limit." },
  { l: "B2", c: "tech", en: "Let's spin up a new environment.", es: "Levantemos un entorno nuevo.", ex: "Let's spin up a new environment with Terraform." },
  { l: "B2", c: "tech", en: "The change is scheduled for the maintenance window.", es: "El cambio está programado en la ventana de mantenimiento.", ex: "The change is scheduled for the maintenance window on Saturday night." },
  { l: "B2", c: "tech", en: "It's a known issue; there's a workaround.", es: "Es un problema conocido; hay un apaño.", ex: "It's a known issue; there's a workaround in the wiki." },

  { l: "C1", c: "tech", en: "We should run a blameless post-mortem.", es: "Deberíamos hacer un post-mortem sin culpables.", ex: "After this outage, we should run a blameless post-mortem." },
  { l: "C1", c: "tech", en: "This is a single point of failure.", es: "Esto es un punto único de fallo.", ex: "We only have one load balancer. This is a single point of failure." },
  { l: "C1", c: "tech", en: "We're accruing technical debt.", es: "Estamos acumulando deuda técnica.", ex: "Every manual fix means we're accruing technical debt." },
  { l: "C1", c: "tech", en: "The playbook needs to be idempotent.", es: "El playbook tiene que ser idempotente.", ex: "The playbook needs to be idempotent, so we can run it twice safely." },
  { l: "C1", c: "tech", en: "The fix is in, but we're keeping an eye on it.", es: "El arreglo ya está, pero lo seguimos vigilando.", ex: "The fix is in, but we're keeping an eye on it overnight." },

  /* ───────────── Expresiones ───────────── */
  { l: "A1", c: "idioms", en: "No problem.", es: "No hay problema.", ex: "Can you help me? — No problem." },
  { l: "A1", c: "idioms", en: "Good luck!", es: "¡Buena suerte!", ex: "Good luck with the interview!" },
  { l: "A1", c: "idioms", en: "Well done!", es: "¡Bien hecho!", ex: "The demo was great. Well done!" },

  { l: "A2", c: "idioms", en: "It's up to you.", es: "Tú decides.", ex: "Tea or coffee? It's up to you." },
  { l: "A2", c: "idioms", en: "Never mind.", es: "No importa, déjalo.", ex: "Never mind, I found the file." },
  { l: "A2", c: "idioms", en: "Take it easy.", es: "Tómatelo con calma.", ex: "It's Friday. Take it easy!" },

  { l: "B1", c: "idioms", en: "Piece of cake.", es: "Pan comido.", ex: "The exam? Piece of cake!" },
  { l: "B1", c: "idioms", en: "Let's call it a day.", es: "Lo dejamos por hoy.", ex: "It's seven o'clock. Let's call it a day." },
  { l: "B1", c: "idioms", en: "I'm on it.", es: "Me pongo con ello.", ex: "The site is down? I'm on it." },
  { l: "B1", c: "idioms", en: "Keep me posted.", es: "Mantenme informado.", ex: "Good luck with the migration. Keep me posted." },
  { l: "B1", c: "idioms", en: "Better late than never.", es: "Más vale tarde que nunca.", ex: "The project is finally finished. Better late than never!" },

  { l: "B2", c: "idioms", en: "Ballpark figure", es: "Una cifra aproximada, a ojo", ex: "I don't need exact numbers. Just give me a ballpark figure." },
  { l: "B2", c: "idioms", en: "Back to square one.", es: "Volver a empezar de cero.", ex: "The test failed, so we're back to square one." },
  { l: "B2", c: "idioms", en: "It's not rocket science.", es: "No es tan difícil.", ex: "Come on, it's not rocket science. You can do it." },
  { l: "B2", c: "idioms", en: "Get the ball rolling.", es: "Poner las cosas en marcha.", ex: "Let's get the ball rolling with a quick kick-off." },
  { l: "B2", c: "idioms", en: "On the same page.", es: "En la misma onda, de acuerdo.", ex: "We need to be on the same page before talking to the client." },

  { l: "C1", c: "idioms", en: "Low-hanging fruit", es: "Lo fácil que da resultados rápidos", ex: "Let's start with the low-hanging fruit: the duplicated alerts." },
  { l: "C1", c: "idioms", en: "Move the goalposts.", es: "Cambiar las reglas a mitad de partido.", ex: "Every week they move the goalposts on the requirements." },
  { l: "C1", c: "idioms", en: "Cut corners.", es: "Hacer chapuzas para ahorrar tiempo.", ex: "We can't cut corners on security." },
  { l: "C1", c: "idioms", en: "The elephant in the room.", es: "El tema que nadie quiere tocar.", ex: "Let's talk about the elephant in the room: the budget." },
  { l: "C1", c: "idioms", en: "Bite the bullet.", es: "Hacer de tripas corazón.", ex: "We'll have to bite the bullet and rewrite the module." },
  { l: "C1", c: "idioms", en: "Play it by ear.", es: "Ir sobre la marcha.", ex: "I'm not sure about the timing. Let's play it by ear." },
  { l: "C1", c: "idioms", en: "Off the top of my head...", es: "Así de memoria, sin mirarlo...", ex: "Off the top of my head, I'd say about two hundred servers." }
];
