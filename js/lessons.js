// js/lessons.js
// Mini-lecciones interactivas tipo slides — rediseño completo

const Lessons = {

  moduloActual:    null,
  slideActual:     0,
  totalSlides:     0,
  flipsRevelados:  [],
  senalesReveladas: [],
  quizRespondido:  false,
  vidasRestantes:  3,
  aciertosEjemplos: 0,
  totalEjemplos:   3,

  // ══════════════════════════════════════════════════════════════════════
  //  CONTENIDO
  // ══════════════════════════════════════════════════════════════════════
  contenido: {

    phishing: {
      titulo:   'Phishing',
      emoji:    '🎣',
      tiempo:   '~12 minutos',
      dificultad: 3,
      slides: [

        // SLIDE 1 — CASO REAL
        {
          tipo: 'casoreal',
          tag:   'Caso Real — México 2023',
          titulo: 'Una empresa perdió $2.3 millones por un solo correo',
          desc:   'Un empleado de una empresa en CDMX recibió un correo que parecía ser de su Director General, pidiendo una transferencia urgente. El dominio del remitente tenía una sola letra diferente al real. Nadie lo notó. En minutos, $2.3 millones de pesos fueron transferidos a una cuenta de atacantes.',
          leccion: 'Un solo carácter diferente en el dominio fue suficiente para robar millones. Esto le pasa a personas inteligentes todos los días — no porque sean descuidadas, sino porque los atacantes son muy buenos en lo que hacen.',
          stats: [
            { valor: '$2.3M',  label: 'Pesos perdidos' },
            { valor: '1',      label: 'Carácter diferente' },
            { valor: '0',      label: 'Empleados que lo detectaron' },
          ],
          accion: 'Quiero aprender a detectarlo →',
        },

        // SLIDE 2 — QUÉ ES
        {
          tipo: 'concepto',
          titulo: '¿Qué es el Phishing?',
          intro: 'En palabras simples: alguien finge ser tu banco, tu jefe o una app conocida para robarte información o dinero.',
          pasos: [
            { icono: '👤', texto: 'Un atacante crea un correo que parece completamente legítimo — del banco, de TI, de tu jefe' },
            { icono: '📧', texto: 'Te lo envía esperando que hagas clic en un enlace o entregues tu contraseña' },
            { icono: '🎭', texto: 'El sitio al que llegas es una copia falsa que captura todo lo que escribes' },
            { icono: '💀', texto: 'El atacante accede a tus cuentas, datos bancarios o los sistemas de tu empresa' },
          ],
        },

        // SLIDE 3 — TÉCNICAS
        {
          tipo: 'flipcards',
          titulo: '3 trucos que usan para engañarte',
          instruccion: 'Toca cada tarjeta para descubrir cómo te manipulan',
          cards: [
            {
              frente: { icono: '⚡', titulo: 'Te asustan' },
              atras:  { titulo: 'Urgencia y miedo', desc: '"Tu cuenta será cancelada en 24 horas." El miedo te hace actuar sin pensar. Es exactamente lo que buscan — que no tengas tiempo de verificar.' },
            },
            {
              frente: { icono: '🏛️', titulo: 'Fingen autoridad' },
              atras:  { titulo: 'Suplantación de autoridad', desc: 'Se hacen pasar por tu banco, el SAT, tu jefe o el área de TI. Psicológicamente, estamos entrenados para obedecer a figuras de autoridad sin cuestionar.' },
            },
            {
              frente: { icono: '🎁', titulo: 'Te ofrecen algo' },
              atras:  { titulo: 'Recompensas falsas', desc: '"Ganaste un premio. Reclámalo aquí." La emoción y la tentación desactivan el pensamiento crítico igual que el miedo.' },
            },
          ],
        },

        // SLIDE 4 — ¿ES PHISHING O NO?
        {
          tipo: 'ejemplos',
          titulo: '¿Puedes detectarlos?',
          instruccion: 'Mira cada correo y decide: ¿es legítimo o es phishing?',
          minAciertos: 2,
          ejemplos: [
            {
              esPhishing: true,
              remitente: 'seguridad@banamex-alertas.com',
              asunto: '⚠️ Tu cuenta será BLOQUEADA en 30 minutos',
              cuerpo: 'Detectamos actividad sospechosa en tu cuenta desde Moscú, Rusia. Verifica tu identidad INMEDIATAMENTE para evitar el bloqueo permanente.',
              senalClave: 'El dominio es "banamex-alertas.com" — Banamex real usa banamex.com únicamente',
              parteResaltada: 'banamex-alertas.com',
            },
            {
              esPhishing: false,
              remitente: 'notificaciones@spotify.com',
              asunto: 'Tu recibo de Spotify — enero 2025',
              cuerpo: 'Hola, te confirmamos que tu suscripción Premium fue renovada exitosamente. Puedes ver tu recibo en tu cuenta de Spotify en cualquier momento.',
              senalClave: 'El dominio es spotify.com — oficial y verificable. No pide ninguna acción urgente ni datos sensibles.',
              parteResaltada: 'spotify.com',
            },
            {
              esPhishing: true,
              remitente: 'rrhh@corporativo-documentos.net',
              asunto: 'Documento urgente pendiente de firma — nómina',
              cuerpo: 'El área de Recursos Humanos requiere tu firma digital para procesar tu nómina del mes. Si no firmas antes del viernes, tu pago podría retrasarse.',
              senalClave: 'RRHH real no usa "corporativo-documentos.net". Además, amenaza con retrasar tu sueldo para presionarte.',
              parteResaltada: 'corporativo-documentos.net',
            },
          ],
        },

        // SLIDE 5 — SEÑALES CON EJEMPLOS VISUALES
        {
          tipo: 'senales_visuales',
          titulo: '5 señales que debes buscar siempre',
          instruccion: 'Toca cada señal para ver un ejemplo real',
          senales: [
            {
              icono: '🔍',
              titulo: 'Dominio del remitente sospechoso',
              desc: 'El dominio es lo que va después del @ en el correo. Los atacantes usan dominios muy similares al real pero con pequeñas diferencias.',
              ejemplo: {
                falso:  'soporte@banamex-seguridad.com',
                real:   'soporte@banamex.com',
                diff:   '-seguridad',
              },
            },
            {
              icono: '⏰',
              titulo: 'Urgencia artificial',
              desc: 'Plazos imposibles como "30 minutos" o "24 horas" son una trampa psicológica. Las organizaciones reales no operan así.',
              ejemplo: {
                falso:  '"Tu cuenta será cancelada en 30 MINUTOS si no actúas ahora"',
                real:   '"Tu suscripción vence el 15 de febrero. Renuévala cuando gustes."',
                diff:   null,
              },
            },
            {
              icono: '🔗',
              titulo: 'El enlace no coincide',
              desc: 'Antes de hacer clic en cualquier enlace, pasa el cursor por encima. La URL real aparece abajo. Si no coincide con el sitio oficial, es una trampa.',
              ejemplo: {
                falso:  'www.banamex-verificacion.com/login',
                real:   'www.banamex.com/login',
                diff:   '-verificacion',
              },
            },
            {
              icono: '📝',
              titulo: 'Pide información sensible',
              desc: 'Ninguna organización legítima te pedirá contraseñas, números de tarjeta, e.firma o códigos de verificación por correo electrónico. Nunca.',
              ejemplo: {
                falso:  '"Ingresa tu contraseña y número de tarjeta para verificar tu identidad"',
                real:   '"Para cualquier duda llama al número al reverso de tu tarjeta"',
                diff:   null,
              },
            },
            {
              icono: '😱',
              titulo: 'Te genera miedo o emoción extrema',
              desc: 'Si un correo te hace sentir pánico, urgencia o emoción muy intensa — detente. Es una señal de alerta. Respira y verifica.',
              ejemplo: {
                falso:  '"¡FELICIDADES! Fuiste seleccionado. ACTÚA AHORA — solo quedan 2 lugares"',
                real:   '"Gracias por participar. Te notificaremos los resultados en 5 días hábiles."',
                diff:   null,
              },
            },
          ],
        },

        // SLIDE 6 — RESUMEN 3 PUNTOS CLAVE
        {
          tipo: 'resumen',
          titulo: 'Llévate esto',
          puntos: [
            { icono: '🔍', titulo: 'Verifica siempre el dominio', desc: 'Antes de hacer clic en cualquier enlace o dar información, revisa el dominio completo del remitente. Un carácter diferente lo delata.' },
            { icono: '🛑', titulo: 'La urgencia es una trampa', desc: 'Cuando algo te genere pánico o prisa, detente. Las organizaciones reales te dan tiempo. Los atacantes no.' },
            { icono: '📞', titulo: 'Ante la duda, llama', desc: 'Si recibes un correo sospechoso de tu banco, jefe o TI — no hagas clic. Llama directamente al número oficial.' },
          ],
        },

        // SLIDE 7 — QUIZ FINAL
        {
          tipo: 'quiz',
          titulo: '¿Listo para el examen?',
          pregunta: 'Recibes este correo: "De: seguridad@sat-gobierno.mx — Tu RFC será suspendido por no verificar tu e.firma antes del fin de mes. Multa de $87,000 MXN." ¿Qué haces?',
          opciones: [
            { texto: 'Hago clic rápido para evitar la multa', correcto: false, feedback: 'Eso es exactamente lo que el atacante quiere. La urgencia y el miedo a una multa son tácticas para que no pienses.' },
            { texto: 'Llamo al SAT al número oficial (55 627 22 728) para verificar', correcto: true, feedback: '¡Perfecto! El SAT usa sat.gob.mx — no sat-gobierno.mx. Y nunca solicita credenciales por correo. Verificar por otro canal es siempre la respuesta correcta.' },
            { texto: 'Ignoro el correo sin reportarlo', correcto: false, feedback: 'Mejor que hacer clic, pero lo ideal es reportarlo al área de seguridad para que otros no caigan.' },
            { texto: 'Lo reenvío a mis contactos para advertirles', correcto: false, feedback: 'Nunca reenvíes correos sospechosos — podrías propagar el ataque. Repórtalo internamente.' },
          ],
        },
      ],
    },

    contrasenas: {
      titulo:     'Contraseñas Seguras',
      emoji:      '🔐',
      tiempo:     '~10 minutos',
      dificultad: 2,
      slides: [
        {
          tipo: 'casoreal',
          tag:   'Caso Real — Global 2021',
          titulo: '8,400,000,000 contraseñas filtradas en un día',
          desc:   'En 2021, la filtración "RockYou2021" expuso 8.4 mil millones de contraseñas únicas recopiladas de brechas anteriores. Millones de personas usaban las mismas contraseñas en múltiples servicios. Los atacantes accedieron a cuentas bancarias, correos y redes sociales en minutos.',
          leccion: 'Si usas la misma contraseña en varios sitios y una es comprometida, todas tus cuentas caen al mismo tiempo. No es cuestión de si te pasará — es cuestión de cuándo.',
          stats: [
            { valor: '8.4B',  label: 'Contraseñas filtradas' },
            { valor: '100GB', label: 'Tamaño del archivo' },
            { valor: '<1s',   label: 'Para descifrar "Password123"' },
          ],
          accion: 'Quiero protegerme →',
        },
        {
          tipo: 'concepto',
          titulo: '¿Cómo roban tu contraseña?',
          intro: 'No necesitan hackearte directamente. Hay formas mucho más fáciles.',
          pasos: [
            { icono: '📖', texto: 'Diccionario: prueban millones de palabras comunes y contraseñas de filtraciones anteriores' },
            { icono: '💪', texto: 'Fuerza bruta: prueban todas las combinaciones posibles — una contraseña de 8 caracteres se descifra en horas' },
            { icono: '🎣', texto: 'Phishing: te engañan para que la escribas tú mismo en un sitio falso' },
            { icono: '🕵️', texto: 'Ingeniería social: usan tu fecha de nacimiento, nombre de mascota o info pública para adivinarla' },
          ],
        },
        {
          tipo: 'flipcards',
          titulo: '3 claves de una contraseña segura',
          instruccion: 'Toca cada tarjeta para aprender',
          cards: [
            {
              frente: { icono: '📏', titulo: 'Larga' },
              atras:  { titulo: 'Mínimo 12 caracteres', desc: 'Una contraseña de 8 caracteres se descifra en horas. Una de 16 caracteres tardaría millones de años con la tecnología actual.' },
            },
            {
              frente: { icono: '🎲', titulo: 'Aleatoria' },
              atras:  { titulo: 'Sin información personal', desc: 'Combina palabras al azar, números y símbolos. "Tr0mb0n#Azul$Luna" es infinitamente más segura que "maria1990".' },
            },
            {
              frente: { icono: '🔄', titulo: 'Única' },
              atras:  { titulo: 'Una por cuenta', desc: 'Una contraseña diferente para cada servicio. Si una es comprometida, las demás siguen seguras. Usa un gestor de contraseñas.' },
            },
          ],
        },
        {
          tipo: 'ejemplos',
          titulo: '¿Cuál es más segura?',
          instruccion: 'Elige la contraseña MÁS segura de cada par',
          minAciertos: 2,
          ejemplos: [
            {
              esPhishing: false,
              remitente: 'Contraseña A',
              asunto: 'maria1990cdmx',
              cuerpo: 'Usa el nombre de la persona, año de nacimiento y ciudad. Cualquier atacante que te conozca un poco podría adivinarla.',
              senalClave: 'Esta contraseña contiene información personal predecible. Un atacante que revise tus redes sociales la adivinaría fácilmente.',
              parteResaltada: 'maria1990cdmx',
              esSegura: false,
              labelBotonVerde: '✅ Esta es más segura',
              labelBotonRojo: '❌ Esta no',
            },
            {
              esPhishing: true,
              remitente: 'Contraseña B',
              asunto: 'Tr0mb0n#Azul$Luna42',
              cuerpo: 'Combina palabras aleatorias, números y símbolos. No contiene información personal y tiene 19 caracteres.',
              senalClave: '¡Correcto! Esta contraseña es muy segura: larga, aleatoria y sin información personal identificable.',
              parteResaltada: 'Tr0mb0n#Azul$Luna42',
              esSegura: true,
              labelBotonVerde: '✅ Esta es más segura',
              labelBotonRojo: '❌ Esta no',
            },
            {
              esPhishing: true,
              remitente: 'Elige la opción correcta',
              asunto: '¿Cuál deberías usar?',
              cuerpo: 'A) La misma contraseña en todos tus servicios para no olvidarla. B) Una contraseña diferente para cada cuenta guardada en un gestor de contraseñas.',
              senalClave: 'Un gestor de contraseñas genera y recuerda contraseñas únicas y seguras por ti. Solo necesitas recordar una contraseña maestra.',
              parteResaltada: 'gestor de contraseñas',
              esSegura: true,
            },
          ],
        },
        {
          tipo: 'senales_visuales',
          titulo: '5 hábitos peligrosos que debes evitar',
          instruccion: 'Toca cada hábito para entender por qué es peligroso',
          senales: [
            {
              icono: '♻️',
              titulo: 'Reutilizar contraseñas',
              desc: 'Si una cuenta es comprometida, todas las cuentas con la misma contraseña quedan expuestas automáticamente.',
              ejemplo: { falso: 'netflix123 → spotify123 → banco123', real: 'Contraseña única y aleatoria para cada servicio', diff: null },
            },
            {
              icono: '📅',
              titulo: 'Usar información personal',
              desc: 'Tu fecha de nacimiento, nombre o el de tu mascota son lo primero que un atacante prueba.',
              ejemplo: { falso: '"maria1990", "rex2015", "cdmx123"', real: '"Kx9#mP2$vL7@nQ4"', diff: null },
            },
            {
              icono: '📱',
              titulo: 'Guardarlas en notas del celular',
              desc: 'Si pierdes tu celular o alguien accede a él, tendrá todas tus contraseñas de inmediato.',
              ejemplo: { falso: 'Notas: "Facebook: maria123, Banco: 1234"', real: 'Gestor de contraseñas con cifrado', diff: null },
            },
            {
              icono: '💬',
              titulo: 'Compartirlas por mensaje',
              desc: 'Los mensajes pueden ser interceptados, hackeados o simplemente quedar guardados para siempre.',
              ejemplo: { falso: '"Te mando mi contraseña por WhatsApp"', real: 'Nunca compartir contraseñas — ni con TI', diff: null },
            },
            {
              icono: '🔓',
              titulo: 'No usar autenticación de dos factores',
              desc: 'El 2FA es tu segunda línea de defensa. Aunque roben tu contraseña, no podrán entrar sin el código.',
              ejemplo: { falso: 'Solo contraseña → una barrera', real: 'Contraseña + código SMS → dos barreras', diff: null },
            },
          ],
        },
        {
          tipo: 'resumen',
          titulo: 'Llévate esto',
          puntos: [
            { icono: '📏', titulo: 'Larga, aleatoria y única', desc: 'Mínimo 12 caracteres, sin información personal, una diferente para cada cuenta.' },
            { icono: '🔐', titulo: 'Usa un gestor de contraseñas', desc: 'Bitwarden, 1Password o el gestor de tu navegador generan y recuerdan contraseñas seguras por ti.' },
            { icono: '📱', titulo: 'Activa el 2FA en todo', desc: 'Especialmente en banco, correo y redes sociales. Es la diferencia entre una cuenta segura y una comprometida.' },
          ],
        },
        {
          tipo: 'quiz',
          titulo: '¿Listo para el examen?',
          pregunta: '¿Cuál de estas prácticas es MÁS segura para manejar tus contraseñas?',
          opciones: [
            { texto: 'Usar una contraseña larga y memorizarla en todos mis servicios', correcto: false, feedback: 'Reutilizar la misma contraseña, aunque sea larga, es peligroso. Una sola brecha compromete todas tus cuentas.' },
            { texto: 'Usar un gestor de contraseñas con contraseñas únicas para cada cuenta', correcto: true, feedback: '¡Exacto! Un gestor genera contraseñas únicas y seguras para cada servicio. Solo necesitas recordar una contraseña maestra.' },
            { texto: 'Guardar mis contraseñas en una nota en mi celular', correcto: false, feedback: 'Las notas no están cifradas. Si alguien accede a tu celular, tiene todas tus contraseñas.' },
            { texto: 'Cambiar mis contraseñas cada mes', correcto: false, feedback: 'Cambiar contraseñas frecuentemente sin una estrategia no es suficiente. Lo importante es que sean únicas y aleatorias.' },
          ],
        },
      ],
    },

    redes_sociales: {
      titulo:     'Redes Sociales',
      emoji:      '📱',
      tiempo:     '~10 minutos',
      dificultad: 2,
      slides: [
        {
          tipo: 'casoreal',
          tag:   'Caso Real — Twitter 2020',
          titulo: 'Hackearon a Obama, Elon Musk y Apple usando LinkedIn',
          desc:   'En 2020, hackers usaron información pública de LinkedIn para identificar empleados de Twitter con acceso privilegiado. Los llamaron por teléfono haciéndose pasar por el equipo de TI. En minutos tenían acceso a las cuentas de Obama, Elon Musk, Apple y Biden. Robaron $120,000 USD en Bitcoin en horas.',
          leccion: 'No hackearon sistemas — hackearon personas usando información pública. Lo que compartes en redes sociales puede convertirse en el arma que usen contra ti.',
          stats: [
            { valor: '130',   label: 'Cuentas comprometidas' },
            { valor: '$120K', label: 'Robados en horas' },
            { valor: '0',     label: 'Vulnerabilidades técnicas usadas' },
          ],
          accion: 'Quiero entender cómo →',
        },
        {
          tipo: 'concepto',
          titulo: '¿Cómo usan tus redes para atacarte?',
          intro: 'No necesitan hackear tus cuentas. Con lo que publicas públicamente ya tienen suficiente.',
          pasos: [
            { icono: '🔍', texto: 'Buscan tu perfil de LinkedIn, Instagram y Facebook para recopilar información' },
            { icono: '🗺️', texto: 'Mapean tu red: saben quiénes son tus colegas, tu jefe y tus proveedores' },
            { icono: '🎭', texto: 'Construyen un ataque personalizado — te escriben suplantando a alguien de tu confianza' },
            { icono: '💸', texto: 'Con esa confianza te engañan para que entregues información, accesos o dinero' },
          ],
        },
        {
          tipo: 'flipcards',
          titulo: '3 riesgos que no conocías',
          instruccion: 'Toca cada tarjeta para descubrirlos',
          cards: [
            {
              frente: { icono: '🔍', titulo: 'OSINT' },
              atras:  { titulo: 'Tu perfil es un mapa de ataque', desc: 'OSINT significa "inteligencia de fuentes abiertas". Los atacantes usan herramientas gratuitas para recopilar todo sobre ti en minutos desde tus perfiles públicos.' },
            },
            {
              frente: { icono: '📍', titulo: 'Ubicación' },
              atras:  { titulo: 'Sabes dónde estás', desc: 'Publicar "estoy de vacaciones" le dice a un atacante que tu casa está sola y tú estás distraído. El momento perfecto para un ataque dirigido.' },
            },
            {
              frente: { icono: '🤝', titulo: 'Conexiones' },
              atras:  { titulo: 'Tu red revela tu empresa', desc: 'Tus conexiones en LinkedIn muestran la jerarquía completa de tu organización. Un atacante sabe exactamente a quién suplantar para que confíes.' },
            },
          ],
        },
        {
          tipo: 'ejemplos',
          titulo: '¿Qué está bien compartir?',
          instruccion: 'Decide si esta publicación representa un riesgo de seguridad',
          minAciertos: 2,
          ejemplos: [
            {
              esPhishing: true,
              remitente: 'Tu publicación en LinkedIn',
              asunto: 'Emocionado de comenzar el proyecto X con el equipo de [Empresa]. Trabajando directamente con [Nombre del Director] en la nueva estrategia de expansión.',
              cuerpo: 'Esta publicación revela: tu empresa, un proyecto activo, el nombre de tu director y que hay una estrategia de expansión. Un atacante puede usarlo todo.',
              senalClave: '⚠️ Riesgo alto. Esta información permite construir un spear phishing perfectamente personalizado dirigido a ti o a tu director.',
              parteResaltada: 'proyecto X',
            },
            {
              esPhishing: false,
              remitente: 'Tu publicación en Instagram',
              asunto: '¡Fin de semana perfecto con la familia! 🌮',
              cuerpo: 'Una foto comiendo tacos con tu familia sin mencionar ubicación exacta, trabajo ni información sensible.',
              senalClave: '✅ Sin riesgo significativo. No revela información laboral, ubicación exacta ni datos que un atacante pueda usar.',
              parteResaltada: null,
            },
            {
              esPhishing: true,
              remitente: 'Tu historia de Instagram',
              asunto: 'Check-in: "En el aeropuerto rumbo a Cancún 🏖️ — fuera de la oficina del 15 al 22"',
              cuerpo: 'Revela que estarás fuera por 7 días, que tu casa y oficina estarán sin supervisión, y que probablemente tendrás menos vigilancia en tu correo.',
              senalClave: '⚠️ Riesgo. Publicar cuándo estarás fuera y por cuánto tiempo es información valiosa para atacantes que buscan el momento oportuno.',
              parteResaltada: 'fuera de la oficina del 15 al 22',
            },
          ],
        },
        {
          tipo: 'senales_visuales',
          titulo: '5 cosas peligrosas que publicamos sin saberlo',
          instruccion: 'Toca cada una para entender el riesgo',
          senales: [
            {
              icono: '🏢',
              titulo: 'Nombre de tu jefe y proyectos',
              desc: 'Con eso un atacante construye un correo perfectamente personalizado suplantando a tu superior.',
              ejemplo: { falso: '"Trabajando con [jefe] en proyecto de expansión a LATAM"', real: '"Trabajando en proyectos emocionantes este trimestre"', diff: null },
            },
            {
              icono: '📍',
              titulo: 'Ubicación en tiempo real',
              desc: 'Las fotos con geolocalización y check-ins revelan exactamente dónde estás y cuándo no estás en casa.',
              ejemplo: { falso: 'Check-in: "Hotel Marriott, CDMX — aquí hasta el viernes"', real: 'Foto sin ubicación, publicada después de regresar', diff: null },
            },
            {
              icono: '🎂',
              titulo: 'Fecha de nacimiento completa',
              desc: 'Es usada para verificar identidad en bancos y para adivinar contraseñas o preguntas de seguridad.',
              ejemplo: { falso: '"Hoy cumplo 32 años — 15 de marzo de 1992 🎂"', real: 'Solo el día y mes, sin el año', diff: null },
            },
            {
              icono: '📞',
              titulo: 'Número de teléfono personal',
              desc: 'Permite ataques de vishing (phishing por voz) y SIM swapping para robar tu número.',
              ejemplo: { falso: '"Para contactarme: +52 55 1234 5678"', real: 'Solo en plataformas privadas y de confianza', diff: null },
            },
            {
              icono: '🖥️',
              titulo: 'Fotos de tu pantalla o escritorio',
              desc: 'Pueden revelar sistemas que usas, documentos abiertos o información confidencial de fondo.',
              ejemplo: { falso: 'Selfie con documentos confidenciales visibles en pantalla', real: 'Verificar el fondo de toda foto antes de publicar', diff: null },
            },
          ],
        },
        {
          tipo: 'resumen',
          titulo: 'Llévate esto',
          puntos: [
            { icono: '🤔', titulo: 'Antes de publicar, pregúntate', desc: '¿Podría un atacante usar esto para engañarme o engañar a alguien de mi empresa? Si la respuesta es posiblemente sí — no lo publiques.' },
            { icono: '🔒', titulo: 'Revisa tu privacidad', desc: 'Configura tus perfiles en privado. No aceptes solicitudes de desconocidos. Revisa quién puede ver qué.' },
            { icono: '📅', titulo: 'Publica después, no durante', desc: 'En lugar de publicar "estoy de vacaciones ahora", publica las fotos cuando ya regresaste.' },
          ],
        },
        {
          tipo: 'quiz',
          titulo: '¿Listo para el examen?',
          pregunta: 'Recibes una llamada de alguien que dice ser del área de TI de tu empresa. Sabe tu nombre, el nombre de tu jefe y el proyecto en el que trabajas. Te pide tu contraseña para "actualizar el sistema". ¿Qué haces?',
          opciones: [
            { texto: 'Le doy mi contraseña — sabe demasiados detalles para ser un atacante', correcto: false, feedback: 'Esos detalles probablemente los encontró en tus redes sociales o LinkedIn. Saber información sobre ti no significa ser quien dice ser.' },
            { texto: 'Cuelgo y llamo directamente al área de TI por el número oficial de la empresa', correcto: true, feedback: '¡Perfecto! El área de TI real nunca pide contraseñas por teléfono. Siempre verifica por un canal oficial que tú inicies.' },
            { texto: 'Le pido que me envíe un correo primero', correcto: false, feedback: 'Un atacante puede falsificar correos fácilmente. Verificar por otro canal que tú inicies es más seguro.' },
            { texto: 'Le doy solo parte de mi contraseña para verificar', correcto: false, feedback: 'Cualquier parte de tu contraseña es demasiado. Nadie legítimo necesita tu contraseña — ni siquiera TI.' },
          ],
        },
      ],
    },

    malware: {
      titulo:     'Malware',
      emoji:      '🦠',
      tiempo:     '~10 minutos',
      dificultad: 3,
      slides: [
        {
          tipo: 'casoreal',
          tag:   'Caso Real — Global 2017',
          titulo: 'WannaCry paralizó 200,000 computadoras en 150 países en un día',
          desc:   'El ransomware WannaCry se propagó globalmente en horas. Hospitales del NHS en Reino Unido cancelaron cirugías. Telefónica, FedEx y el Ministerio del Interior de Rusia fueron paralizados. Todo comenzó con empleados que abrieron archivos adjuntos en correos aparentemente normales.',
          leccion: 'Un solo clic en el archivo equivocado puede paralizar toda una organización. La primera — y más importante — línea de defensa eres tú.',
          stats: [
            { valor: '200K', label: 'Computadoras infectadas' },
            { valor: '150',  label: 'Países afectados' },
            { valor: '$4B',  label: 'En pérdidas globales' },
          ],
          accion: 'Quiero aprender a protegerme →',
        },
        {
          tipo: 'concepto',
          titulo: '¿Cómo llega el malware a tu dispositivo?',
          intro: 'El malware casi nunca llega solo — necesita que tú hagas algo para activarlo.',
          pasos: [
            { icono: '📎', texto: 'Adjuntos maliciosos: facturas, CVs, documentos Word con código oculto que se activa al abrirlos' },
            { icono: '🔗', texto: 'Enlaces trampa: URLs que descargan malware automáticamente al visitarlas' },
            { icono: '💾', texto: 'USBs infectados: dispositivos abandonados o "regalados" que se ejecutan al conectarlos' },
            { icono: '📥', texto: 'Software falso: actualizaciones o programas que en realidad son malware disfrazado' },
          ],
        },
        {
          tipo: 'flipcards',
          titulo: '3 tipos de malware que debes conocer',
          instruccion: 'Toca cada tarjeta para descubrirlos',
          cards: [
            {
              frente: { icono: '🔒', titulo: 'Ransomware' },
              atras:  { titulo: 'Te secuestra los archivos', desc: 'Cifra todos tus documentos y pide un rescate para devolvértelos. Sin backup, los datos se pierden para siempre. Las empresas pagan millones.' },
            },
            {
              frente: { icono: '🕵️', titulo: 'Spyware' },
              atras:  { titulo: 'Te espía en silencio', desc: 'Se instala sin que lo notes y registra todo: contraseñas que escribes, sitios que visitas, conversaciones. Puedes tenerlo ahora mismo.' },
            },
            {
              frente: { icono: '🤖', titulo: 'Troyano' },
              atras:  { titulo: 'Parece legítimo pero no lo es', desc: 'Se disfraza de programa útil pero abre una puerta trasera en tu dispositivo. El atacante puede controlarlo remotamente sin que te des cuenta.' },
            },
          ],
        },
        {
          tipo: 'ejemplos',
          titulo: '¿Abrirías este archivo?',
          instruccion: 'Decide si es seguro abrir cada uno',
          minAciertos: 2,
          ejemplos: [
            {
              esPhishing: true,
              remitente: 'facturacion@proveedor-mx.net',
              asunto: 'Factura_Pendiente_URGENTE.exe',
              cuerpo: 'Estimado cliente, adjuntamos su factura pendiente de pago. Por favor ábrala inmediatamente para evitar cargos adicionales. [Archivo: Factura_001.exe]',
              senalClave: 'Los archivos .exe son programas ejecutables — nunca son facturas. Además el dominio es genérico y hay urgencia artificial.',
              parteResaltada: '.exe',
            },
            {
              esPhishing: false,
              remitente: 'documentos@empresa.com',
              asunto: 'Reporte_Mensual_Enero2025.pdf',
              cuerpo: 'Hola, adjunto el reporte mensual en formato PDF como siempre. Cualquier duda me avisas. Saludos, [Nombre conocido del equipo]',
              senalClave: 'PDF de un remitente conocido, sin urgencia, sin petición de datos. Siempre verifica con el remitente si tienes dudas, pero no hay señales de alerta obvias.',
              parteResaltada: null,
            },
            {
              esPhishing: true,
              remitente: 'soporte@microsoft-actualizacion.com',
              asunto: 'URGENTE: Actualiza Windows ahora para evitar virus',
              cuerpo: 'Tu versión de Windows está desactualizada y vulnerable. Descarga la actualización de seguridad inmediatamente desde el enlace de abajo.',
              senalClave: 'Microsoft nunca envía actualizaciones por correo. El dominio "microsoft-actualizacion.com" es falso. Las actualizaciones reales llegan desde Windows Update directamente.',
              parteResaltada: 'microsoft-actualizacion.com',
            },
          ],
        },
        {
          tipo: 'senales_visuales',
          titulo: '5 señales de alerta antes de abrir algo',
          instruccion: 'Toca cada señal para aprender a detectarla',
          senales: [
            {
              icono: '📄',
              titulo: 'Extensiones ejecutables por correo',
              desc: '.exe, .bat, .vbs, .js adjuntos en correos son casi siempre malware. Ninguna empresa legítima envía programas por correo.',
              ejemplo: { falso: '"Factura.exe", "Reporte.bat", "Contrato.vbs"', real: '"Factura.pdf", "Reporte.xlsx", "Contrato.docx"', diff: null },
            },
            {
              icono: '⚙️',
              titulo: '"Habilita macros para ver el contenido"',
              desc: 'Los documentos legítimos NO necesitan macros para mostrar su contenido. Esta es la técnica más común para distribuir malware en documentos Office.',
              ejemplo: { falso: '"Este documento está protegido. Habilita macros para continuar"', real: 'El documento se abre directamente sin solicitudes especiales', diff: null },
            },
            {
              icono: '🔄',
              titulo: 'Actualización solicitada por correo',
              desc: 'Las actualizaciones legítimas llegan desde la app misma o el sistema operativo — nunca por correo electrónico.',
              ejemplo: { falso: '"Descarga la actualización de seguridad desde este enlace"', real: 'Windows Update, App Store o la app misma te avisa directamente', diff: null },
            },
            {
              icono: '💾',
              titulo: 'USB de origen desconocido',
              desc: 'Los atacantes dejan USBs en estacionamientos y lobbys. La curiosidad humana hace el resto. Nunca conectes uno que no sea tuyo.',
              ejemplo: { falso: 'USB encontrado en el estacionamiento de la oficina', real: 'Solo usar USBs propios o de fuentes absolutamente confiables', diff: null },
            },
            {
              icono: '🌐',
              titulo: '"Instala este plugin para continuar"',
              desc: 'Sitios que piden instalar software para ver contenido casi siempre están distribuyendo malware.',
              ejemplo: { falso: '"Necesitas instalar este plugin para ver el video"', real: 'Sitios legítimos usan tecnología estándar sin instalaciones adicionales', diff: null },
            },
          ],
        },
        {
          tipo: 'resumen',
          titulo: 'Llévate esto',
          puntos: [
            { icono: '🚫', titulo: 'Nunca abras .exe por correo', desc: 'Facturas, contratos y reportes llegan en PDF o documentos Office — nunca como archivos ejecutables.' },
            { icono: '⚙️', titulo: 'Nunca habilites macros', desc: 'Si un documento pide habilitar macros para verse, es una trampa. Ciérralo y repórtalo.' },
            { icono: '💾', titulo: 'No conectes USBs desconocidos', desc: 'Un USB encontrado o regalado por desconocidos puede infectar tu dispositivo al conectarlo, incluso sin abrir nada.' },
          ],
        },
        {
          tipo: 'quiz',
          titulo: '¿Listo para el examen?',
          pregunta: 'Recibes un documento Word de un proveedor conocido. Al abrirlo aparece: "Este documento está protegido. Habilita las macros para ver el contenido." ¿Qué haces?',
          opciones: [
            { texto: 'Habilito las macros — es un proveedor que conozco', correcto: false, feedback: 'La cuenta del proveedor pudo haber sido comprometida. Los documentos legítimos nunca necesitan macros para mostrar su contenido.' },
            { texto: 'No habilito las macros y llamo al proveedor para verificar', correcto: true, feedback: '¡Perfecto! Verificar por otro canal es siempre la respuesta correcta. Si el proveedor confirma que no envió nada, tienes un incidente de seguridad.' },
            { texto: 'Habilito las macros solo si el antivirus no detecta nada', correcto: false, feedback: 'El malware moderno está diseñado para evadir antivirus. No confíes solo en eso.' },
            { texto: 'Abro el archivo en modo incógnito', correcto: false, feedback: 'El modo incógnito no protege contra malware en archivos descargados — solo afecta el historial del navegador.' },
          ],
        },
      ],
    },

  },

  // ══════════════════════════════════════════════════════════════════════
  //  RENDERIZAR LECCIÓN
  // ══════════════════════════════════════════════════════════════════════

  renderizar(moduloId) {
    this.moduloActual     = moduloId;
    this.slideActual      = 0;
    this.flipsRevelados   = [];
    this.senalesReveladas = [];
    this.quizRespondido   = false;
    this.vidasRestantes   = 3;
    this.aciertosEjemplos = 0;

    const leccion = this.contenido[moduloId];
    if (!leccion) return;

    this.totalSlides = leccion.slides.length;
    this.renderizarSlide();
  },

  renderizarSlide() {
    const leccion = this.contenido[this.moduloActual];
    const slide   = leccion.slides[this.slideActual];

    // Header
    const headerModulo = document.getElementById('leccion-header-modulo');
    if (headerModulo) headerModulo.textContent = `${leccion.emoji} ${leccion.titulo}`;

    const progreso = document.getElementById('leccion-progreso-texto');
    if (progreso) progreso.textContent = `Paso ${this.slideActual + 1} de ${this.totalSlides}`;

    const barra = document.getElementById('leccion-barra-progreso');
    if (barra) {
      setTimeout(() => {
        barra.style.width = `${((this.slideActual + 1) / this.totalSlides) * 100}%`;
      }, 100);
    }

    const contenedor = document.getElementById('leccion-contenido');
    if (!contenedor) return;

    this.flipsRevelados   = [];
    this.senalesReveladas = [];
    this.quizRespondido   = false;

    switch (slide.tipo) {
      case 'casoreal':        contenedor.innerHTML = this.htmlCasoReal(slide, empleadoActivo?.nombre);       break;       break;
      case 'concepto':        contenedor.innerHTML = this.htmlConcepto(slide);       break;
      case 'flipcards':       contenedor.innerHTML = this.htmlFlipCards(slide);      break;
      case 'ejemplos':        contenedor.innerHTML = this.htmlEjemplos(slide);       break;
      case 'senales_visuales':contenedor.innerHTML = this.htmlSenalesVisuales(slide);break;
      case 'resumen':         contenedor.innerHTML = this.htmlResumen(slide);        break;
      case 'quiz':            contenedor.innerHTML = this.htmlQuiz(slide);           break;
    }

    contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  avanzar() {
    if (this.slideActual < this.totalSlides - 1) {
      this.slideActual++;
      this.renderizarSlide();
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  //  HTML DE SLIDES
  // ══════════════════════════════════════════════════════════════════════

  htmlCasoReal(slide, nombreEmpleado) {
    return `
      <div class="slide-casoreal">
        <div class="casoreal-tag">${slide.tag}</div>
${nombreEmpleado ? `<div class="casoreal-saludo">👋 Hola, <strong>${nombreEmpleado}</strong> — esto le puede pasar a cualquiera</div>` : ''}
        <h2 class="casoreal-titulo">${slide.titulo}</h2>
        <p class="casoreal-desc">${slide.desc}</p>
        <div class="casoreal-stats">
          ${slide.stats.map(s => `
            <div class="casoreal-stat">
              <div class="casoreal-stat-valor">${s.valor}</div>
              <div class="casoreal-stat-label">${s.label}</div>
            </div>
          `).join('')}
        </div>
        <div class="casoreal-leccion">
          <span class="casoreal-leccion-label">💡 Lo que esto significa para ti:</span>
          ${slide.leccion}
        </div>
        <button class="btn-slide-avanzar" onclick="Lessons.avanzar()">
          ${slide.accion}
        </button>
      </div>
    `;
  },

  htmlConcepto(slide) {
    return `
      <div class="slide-concepto">
        <h2 class="slide-titulo">${slide.titulo}</h2>
        <p class="concepto-intro">${slide.intro}</p>
        <div class="concepto-pasos">
          ${slide.pasos.map((p, i) => `
            <div class="concepto-paso" style="animation-delay:${i * 0.15}s">
              <div class="concepto-paso-icono">${p.icono}</div>
              <div class="concepto-paso-texto">${p.texto}</div>
            </div>
          `).join('')}
        </div>
        <button class="btn-slide-avanzar" onclick="Lessons.avanzar()">
          Entendido, continuar →
        </button>
      </div>
    `;
  },

  htmlFlipCards(slide) {
    return `
      <div class="slide-flipcards">
        <h2 class="slide-titulo">${slide.titulo}</h2>
        <p class="slide-instruccion">👆 ${slide.instruccion}</p>
        <div class="flipcards-grid">
          ${slide.cards.map((card, i) => `
            <div class="flip-card" id="flip-${i}" onclick="Lessons.flipCard(${i}, ${slide.cards.length})">
              <div class="flip-card-inner" id="flip-inner-${i}">
                <div class="flip-card-front">
                  <div class="flip-icono">${card.frente.icono}</div>
                  <div class="flip-titulo">${card.frente.titulo}</div>
                  <div class="flip-hint">Toca para descubrir</div>
                </div>
                <div class="flip-card-back">
                  <div class="flip-back-titulo">${card.atras.titulo}</div>
                  <div class="flip-back-desc">${card.atras.desc}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div id="flip-avanzar" style="display:none; margin-top:24px; text-align:center">
          <p style="color:var(--recompensa); font-size:13px; margin-bottom:12px; font-weight:600">
            ✅ ¡Revisaste todas las técnicas!
          </p>
          <button class="btn-slide-avanzar" onclick="Lessons.avanzar()">
            Continuar →
          </button>
        </div>
      </div>
    `;
  },

  htmlEjemplos(slide) {
    return `
      <div class="slide-ejemplos">
        <h2 class="slide-titulo">${slide.titulo}</h2>
        <p class="slide-instruccion">👆 ${slide.instruccion}</p>
        <div class="vidas-contenedor">
          <span class="vidas-label">Vidas:</span>
          <span id="vidas-display">❤️❤️❤️</span>
        </div>
        <div class="ejemplos-progreso">
          <span id="ejemplos-contador">Ejemplo 1 de ${slide.ejemplos.length}</span>
        </div>
        <div id="ejemplo-actual">
          ${this.htmlEjemploItem(slide.ejemplos[0], 0)}
        </div>
        <div id="ejemplos-avanzar" style="display:none; margin-top:20px; text-align:center">
          <p style="color:var(--recompensa); font-size:13px; margin-bottom:12px; font-weight:600">
            ✅ ¡Superaste los ejemplos!
          </p>
          <button class="btn-slide-avanzar" onclick="Lessons.avanzar()">
            Continuar →
          </button>
        </div>
      </div>
    `;
  },

  htmlEjemploItem(ejemplo, indice) {
    return `
      <div class="ejemplo-correo" id="ejemplo-${indice}">
        <div class="ejemplo-correo-header">
          <div class="ejemplo-avatar">${ejemplo.remitente.charAt(0).toUpperCase()}</div>
          <div class="ejemplo-meta">
            <div class="ejemplo-remitente">${ejemplo.remitente}</div>
            <div class="ejemplo-asunto">${ejemplo.asunto}</div>
          </div>
        </div>
        <div class="ejemplo-cuerpo">${ejemplo.cuerpo}</div>
        <div class="ejemplo-acciones">
          <button class="btn-ejemplo btn-legitimo"
                  onclick="Lessons.responderEjemplo(${indice}, false)">
            ✅ Es legítimo
          </button>
          <button class="btn-ejemplo btn-phishing"
                  onclick="Lessons.responderEjemplo(${indice}, true)">
            🚨 Es sospechoso
          </button>
        </div>
        <div id="ejemplo-feedback-${indice}" style="display:none"></div>
      </div>
    `;
  },

  htmlSenalesVisuales(slide) {
    return `
      <div class="slide-senales">
        <h2 class="slide-titulo">${slide.titulo}</h2>
        <p class="slide-instruccion">👆 ${slide.instruccion}</p>
        <div class="senales-lista">
          ${slide.senales.map((s, i) => `
            <div class="senal-item ${i === 0 ? 'senal-activa' : 'senal-bloqueada'}"
                 id="senal-${i}"
                 onclick="Lessons.revelarSenal(${i}, ${slide.senales.length})">
              <div class="senal-numero">${i + 1}</div>
              <div class="senal-cuerpo">
                <div class="senal-icono-titulo">
                  <span>${s.icono}</span>
                  <span class="senal-titulo">${s.titulo}</span>
                </div>
                <div class="senal-desc" id="senal-desc-${i}" style="display:none">
                  ${s.desc}
                  <div class="senal-ejemplo" id="senal-ejemplo-${i}" style="display:none">
                    <div class="senal-ejemplo-fila">
                      <span class="senal-ejemplo-label rojo">❌ Peligroso:</span>
                      <span class="senal-ejemplo-valor">${s.ejemplo.falso}</span>
                    </div>
                    <div class="senal-ejemplo-fila">
                      <span class="senal-ejemplo-label verde">✅ Seguro:</span>
                      <span class="senal-ejemplo-valor">${s.ejemplo.real}</span>
                    </div>
                  </div>
                </div>
                <div class="senal-tap" id="senal-tap-${i}">
                  ${i === 0 ? 'Toca para revelar →' : '🔒 Completa la anterior primero'}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div id="senales-avanzar" style="display:none; margin-top:20px; text-align:center">
          <p style="color:var(--recompensa); font-size:13px; margin-bottom:12px; font-weight:600">
            ✅ ¡Conoces todas las señales!
          </p>
          <button class="btn-slide-avanzar" onclick="Lessons.avanzar()">
            Continuar →
          </button>
        </div>
      </div>
    `;
  },

  htmlResumen(slide) {
    return `
      <div class="slide-resumen">
        <div class="resumen-badge">🧠 Llévate esto</div>
        <h2 class="slide-titulo">${slide.titulo}</h2>
        <div class="resumen-puntos">
          ${slide.puntos.map((p, i) => `
            <div class="resumen-punto" style="animation-delay:${i * 0.2}s">
              <div class="resumen-punto-icono">${p.icono}</div>
              <div class="resumen-punto-cuerpo">
                <div class="resumen-punto-titulo">${p.titulo}</div>
                <div class="resumen-punto-desc">${p.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="btn-slide-avanzar" onclick="Lessons.avanzar()">
          Ya lo tengo — al quiz final →
        </button>
      </div>
    `;
  },

  htmlQuiz(slide) {
    return `
      <div class="slide-quiz">
        <div class="quiz-header">
          <div class="quiz-badge">🎯 Quiz Final</div>
          <h2 class="slide-titulo">${slide.titulo}</h2>
        </div>
        <p class="quiz-pregunta">${slide.pregunta}</p>
        <div class="quiz-opciones">
          ${slide.opciones.map((op, i) => `
            <button class="quiz-opcion" id="quiz-op-${i}"
                    onclick="Lessons.responderQuiz(${i}, ${op.correcto}, \`${op.feedback.replace(/`/g, '\\`')}\`, ${slide.opciones.length})">
              <span class="quiz-opcion-letra">${String.fromCharCode(65 + i)}</span>
              <span>${op.texto}</span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback-contenedor" id="quiz-feedback" style="display:none"></div>
        <div id="quiz-avanzar" style="display:none; margin-top:20px">
          <button class="btn-slide-avanzar btn-verde" onclick="iniciarEjerciciosDesdeLeccion()">
            🎯 ¡Comenzar ejercicios!
          </button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════════════════════════════
  //  INTERACCIONES
  // ══════════════════════════════════════════════════════════════════════

  flipCard(indice, total) {
    const inner = document.getElementById(`flip-inner-${indice}`);
    if (!inner) return;
    inner.classList.toggle('flipped');

    if (!this.flipsRevelados.includes(indice)) {
      this.flipsRevelados.push(indice);
    }

    if (this.flipsRevelados.length === total) {
      const avanzar = document.getElementById('flip-avanzar');
      if (avanzar) {
        avanzar.style.display = 'block';
        avanzar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  },

  revelarSenal(indice, total) {
    const item = document.getElementById(`senal-${indice}`);
    if (!item || item.classList.contains('senal-bloqueada')) return;

    const desc    = document.getElementById(`senal-desc-${indice}`);
    const ejemplo = document.getElementById(`senal-ejemplo-${indice}`);
    const tap     = document.getElementById(`senal-tap-${indice}`);

    if (desc)    desc.style.display    = 'block';
    if (ejemplo) ejemplo.style.display = 'block';
    if (tap)     tap.style.display     = 'none';
    item.classList.add('senal-revelada');

    // Desbloquear siguiente
    const siguiente = document.getElementById(`senal-${indice + 1}`);
    const tapSig    = document.getElementById(`senal-tap-${indice + 1}`);
    if (siguiente) {
      siguiente.classList.remove('senal-bloqueada');
      siguiente.classList.add('senal-activa');
      if (tapSig) tapSig.textContent = 'Toca para revelar →';
    }

    if (!this.senalesReveladas.includes(indice)) {
      this.senalesReveladas.push(indice);
    }

    if (this.senalesReveladas.length === total) {
      const avanzar = document.getElementById('senales-avanzar');
      if (avanzar) {
        avanzar.style.display = 'block';
        avanzar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  },

  _ejemploActual: 0,

  responderEjemplo(indice, respondioSospechoso) {
    const slide   = this.contenido[this.moduloActual].slides[this.slideActual];
    const ejemplo = slide.ejemplos[indice];
    const correcto = respondioSospechoso === ejemplo.esPhishing;

    const feedbackEl = document.getElementById(`ejemplo-feedback-${indice}`);
    const botonesEl  = document.querySelectorAll('.btn-ejemplo');
    botonesEl.forEach(b => b.disabled = true);

    if (correcto) {
      this.aciertosEjemplos++;
      feedbackEl.style.display = 'block';
      feedbackEl.innerHTML = `
        <div class="ejemplo-feedback correcto">
          <div class="ejemplo-feedback-icono">✅</div>
          <div>
            <strong>¡Correcto!</strong><br>
            ${ejemplo.senalClave}
            ${ejemplo.parteResaltada ? `<div class="ejemplo-resaltado">🔍 Clave: <strong>${ejemplo.parteResaltada}</strong></div>` : ''}
          </div>
        </div>
      `;
    } else {
      this.vidasRestantes--;
      this.actualizarVidas();
      feedbackEl.style.display = 'block';
      feedbackEl.innerHTML = `
        <div class="ejemplo-feedback incorrecto">
          <div class="ejemplo-feedback-icono">❌</div>
          <div>
            <strong>${ejemplo.esPhishing ? 'Era sospechoso' : 'Era legítimo'}</strong><br>
            ${ejemplo.senalClave}
            ${ejemplo.parteResaltada ? `<div class="ejemplo-resaltado">🔍 Fíjate en: <strong>${ejemplo.parteResaltada}</strong></div>` : ''}
          </div>
        </div>
      `;
    }

    // Siguiente ejemplo o finalizar
    setTimeout(() => {
      const siguienteIndice = indice + 1;
      if (siguienteIndice < slide.ejemplos.length) {
        const contador = document.getElementById('ejemplos-contador');
        if (contador) contador.textContent = `Ejemplo ${siguienteIndice + 1} de ${slide.ejemplos.length}`;

        const contenedor = document.getElementById('ejemplo-actual');
        if (contenedor) {
          contenedor.innerHTML = this.htmlEjemploItem(slide.ejemplos[siguienteIndice], siguienteIndice);
        }
      } else {
        // Terminaron todos los ejemplos
        if (this.aciertosEjemplos >= slide.minAciertos) {
          const avanzar = document.getElementById('ejemplos-avanzar');
          if (avanzar) {
            avanzar.style.display = 'block';
            avanzar.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          // No alcanzó el mínimo — reintentar
          const contenedor = document.getElementById('ejemplo-actual');
          if (contenedor) {
            contenedor.innerHTML = `
              <div style="text-align:center; padding:24px">
                <div style="font-size:36px; margin-bottom:12px">😅</div>
                <div style="font-size:16px; font-weight:700; color:var(--urgencia); margin-bottom:8px">
                  Necesitas acertar ${slide.minAciertos} de ${slide.ejemplos.length}
                </div>
                <div style="font-size:14px; color:var(--gris-oscuro); margin-bottom:20px">
                  Obtuviste ${this.aciertosEjemplos}. ¡Inténtalo de nuevo!
                </div>
                <button class="btn-slide-avanzar" onclick="Lessons.reiniciarEjemplos()">
                  🔄 Intentar de nuevo
                </button>
              </div>
            `;
          }
        }
      }
    }, 2000);
  },

  reiniciarEjemplos() {
    this.aciertosEjemplos = 0;
    this.vidasRestantes   = 3;
    this.actualizarVidas();
    this.renderizarSlide();
  },

  actualizarVidas() {
    const el = document.getElementById('vidas-display');
    if (!el) return;
    const corazones = '❤️'.repeat(Math.max(0, this.vidasRestantes)) +
                      '🖤'.repeat(Math.max(0, 3 - this.vidasRestantes));
    el.textContent = corazones;
  },

  responderQuiz(indice, correcto, feedback, total) {
    if (this.quizRespondido) return;
    this.quizRespondido = true;

    for (let i = 0; i < total; i++) {
      const btn = document.getElementById(`quiz-op-${i}`);
      if (btn) btn.disabled = true;
    }

    const btnSel = document.getElementById(`quiz-op-${indice}`);
    if (btnSel) btnSel.classList.add(correcto ? 'quiz-opcion-correcta' : 'quiz-opcion-incorrecta');

    if (!correcto) {
      const slide = this.contenido[this.moduloActual].slides[this.slideActual];
      slide.opciones.forEach((op, i) => {
        if (op.correcto) {
          const btn = document.getElementById(`quiz-op-${i}`);
          if (btn) btn.classList.add('quiz-opcion-correcta');
        }
      });
    }

    const feedbackEl = document.getElementById('quiz-feedback');
    if (feedbackEl) {
      feedbackEl.style.display = 'block';
      feedbackEl.className     = `quiz-feedback-contenedor ${correcto ? 'feedback-correcto' : 'feedback-incorrecto'}`;
      feedbackEl.innerHTML     = `<strong>${correcto ? '✅ ¡Correcto!' : '❌ No exactamente...'}</strong><br>${feedback}`;
    }

    const avanzar = document.getElementById('quiz-avanzar');
    if (avanzar) {
      setTimeout(() => {
        avanzar.style.display = 'block';
        const btn = avanzar.querySelector('button');
        if (btn && !correcto) {
          btn.textContent = '🔄 Intentar quiz de nuevo';
          btn.classList.remove('btn-verde');
          btn.onclick = () => {
            this.quizRespondido = false;
            this.renderizarSlide();
          };
        }
        avanzar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    }
  },
};

console.log('✅ Lessons cargado correctamente');