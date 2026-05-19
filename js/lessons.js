// js/lessons.js
// Mini-lecciones interactivas tipo slides
// El usuario debe completar cada slide para avanzar

const Lessons = {

    // ── Estado ────────────────────────────────────────────────────────────
    moduloActual: null,
    slideActual: 0,
    totalSlides: 0,
    puntosRevelados: [],
    quizRespondido: false,
    flipsRevelados: [],

    // ══════════════════════════════════════════════════════════════════════
    //  CONTENIDO DE LECCIONES
    // ══════════════════════════════════════════════════════════════════════
    contenido: {

        phishing: {
            titulo: 'Phishing',
            emoji: '🎣',
            slides: [
                // ── SLIDE 1: Dato impactante ──────────────────────────────────
                {
                    tipo: 'impacto',
                    dato: '94%',
                    desc: 'de los ciberataques comienzan con un correo de phishing',
                    contexto: 'En México, se registran más de 43 millones de intentos de phishing al año. Cualquier persona — sin importar su nivel técnico — puede ser víctima.',
                    accion: 'Entendido, ¿qué es exactamente? →',
                },
                // ── SLIDE 2: ¿Qué es? ────────────────────────────────────────
                {
                    tipo: 'concepto',
                    titulo: '¿Qué es el Phishing?',
                    pasos: [
                        { icono: '👤', texto: 'Un atacante crea un correo que parece legítimo — de tu banco, jefe o una app conocida' },
                        { icono: '📧', texto: 'Te lo envía esperando que hagas clic en un enlace o entregues tus credenciales' },
                        { icono: '🎭', texto: 'El sitio al que llegas es una copia falsa que roba tu información' },
                        { icono: '💀', texto: 'El atacante accede a tus cuentas, datos o dispositivos' },
                    ],
                },
                // ── SLIDE 3: Técnicas (flip cards) ───────────────────────────
                {
                    tipo: 'flipcards',
                    titulo: '3 Técnicas que usan los atacantes',
                    instruccion: 'Toca cada tarjeta para descubrir cómo te manipulan',
                    cards: [
                        {
                            frente: { icono: '⚡', titulo: 'Urgencia' },
                            atras: { titulo: 'Urgencia', desc: 'Te presionan con plazos imposibles: "Tu cuenta será cancelada en 24 horas". El miedo desactiva tu pensamiento crítico y te hace actuar sin pensar.' },
                        },
                        {
                            frente: { icono: '🏛️', titulo: 'Autoridad' },
                            atras: { titulo: 'Autoridad', desc: 'Suplantan a tu banco, el SAT, tu jefe o el área de TI. Nadie quiere ignorar a quien tiene poder sobre ti o tu dinero.' },
                        },
                        {
                            frente: { icono: '🎁', titulo: 'Recompensa' },
                            atras: { titulo: 'Recompensa', desc: 'Te ofrecen algo irresistible: un premio, meses gratis, una oferta exclusiva. La tentación y la emoción nublan el juicio.' },
                        },
                    ],
                },
                // ── SLIDE 4: Señales de alerta ────────────────────────────────
                {
                    tipo: 'senales',
                    titulo: '5 Señales que debes detectar',
                    instruccion: 'Toca cada señal para revelarla',
                    senales: [
                        { icono: '🔍', titulo: 'Dominio sospechoso', desc: 'El remitente usa "banamex-alertas.com" en vez de "banamex.com". Siempre revisa el dominio completo.' },
                        { icono: '⏰', titulo: 'Urgencia artificial', desc: 'Plazos de 24 horas, 30 minutos o "acción inmediata requerida". Los atacantes no quieren que tengas tiempo de pensar.' },
                        { icono: '🔗', titulo: 'Enlace sospechoso', desc: 'Pasa el cursor sobre el enlace antes de hacer clic. Si la URL no coincide con el sitio oficial, es una trampa.' },
                        { icono: '📝', titulo: 'Pide datos sensibles', desc: 'Ninguna organización legítima te pedirá contraseñas, números de tarjeta o e.firma por correo electrónico.' },
                        { icono: '😱', titulo: 'Genera miedo o emoción extrema', desc: 'Si un correo te hace sentir pánico o emoción intensa, detente. Es exactamente lo que el atacante busca.' },
                    ],
                },
                // ── SLIDE 5: Caso real ────────────────────────────────────────
                {
                    tipo: 'casoreal',
                    tag: 'Caso Real — México 2023',
                    titulo: 'CEO Fraud: $2.3 millones perdidos',
                    desc: 'Una empresa en CDMX recibió un correo que suplantaba al Director General, pidiendo una transferencia urgente a un proveedor. El dominio del remitente tenía una letra diferente al real: "empresa-corp.com" en vez de "empresacorp.com". Nadie lo notó.',
                    leccion: 'Un solo carácter diferente en el dominio fue suficiente para robar millones. Siempre verifica el dominio COMPLETO antes de actuar.',
                    stats: [
                        { valor: '$2.3M', label: 'Pesos perdidos' },
                        { valor: '1', label: 'Carácter diferente' },
                        { valor: '0', label: 'Empleados que lo detectaron' },
                    ],
                },
                // ── SLIDE 6: Quiz ─────────────────────────────────────────────
                {
                    tipo: 'quiz',
                    titulo: '¿Listo para los ejercicios?',
                    pregunta: 'Recibes este correo: "seguridad@banamex-alertas.com — Tu cuenta será bloqueada en 30 minutos si no verificas tu identidad". ¿Qué haces?',
                    opciones: [
                        { texto: 'Hago clic rápido para no perder acceso a mi cuenta', correcto: false, feedback: 'Eso es exactamente lo que el atacante quiere. La urgencia es una trampa para que actúes sin pensar.' },
                        { texto: 'Llamo al número oficial de mi banco para verificar', correcto: true, feedback: '¡Perfecto! Verificar por un canal diferente es siempre la respuesta correcta. El banco nunca bloquea cuentas sin aviso previo.' },
                        { texto: 'Ignoro el correo sin reportarlo', correcto: false, feedback: 'Mejor que hacer clic, pero lo ideal es reportarlo. Así proteges también a tus compañeros.' },
                        { texto: 'Reenvío el correo a mis contactos para advertirles', correcto: false, feedback: 'Nunca reenvíes correos sospechosos — podrías propagar el ataque. Repórtalo al área de seguridad.' },
                    ],
                },
            ],
        },

        contrasenas: {
            titulo: 'Contraseñas Seguras',
            emoji: '🔐',
            slides: [
                {
                    tipo: 'impacto',
                    dato: '80%',
                    desc: 'de las brechas de seguridad involucran contraseñas débiles o robadas',
                    contexto: 'En 2021, la filtración RockYou2021 expuso 8.4 mil millones de contraseñas. Si usas la misma contraseña en varios sitios, todas tus cuentas están en riesgo.',
                    accion: 'Quiero protegerme →',
                },
                {
                    tipo: 'concepto',
                    titulo: '¿Cómo roban tu contraseña?',
                    pasos: [
                        { icono: '📖', texto: 'Diccionario: prueban millones de palabras comunes y contraseñas filtradas' },
                        { icono: '💪', texto: 'Fuerza bruta: prueban todas las combinaciones posibles hasta encontrar la tuya' },
                        { icono: '🎣', texto: 'Phishing: te engañan para que la escribas en un sitio falso' },
                        { icono: '🕵️', texto: 'Ingeniería social: usan tu información pública para adivinarla' },
                    ],
                },
                {
                    tipo: 'flipcards',
                    titulo: '3 Claves de una contraseña segura',
                    instruccion: 'Toca cada tarjeta para aprender',
                    cards: [
                        {
                            frente: { icono: '📏', titulo: 'Longitud' },
                            atras: { titulo: 'Longitud', desc: 'Mínimo 12 caracteres. Una contraseña de 8 caracteres se descifra en horas. Una de 16 caracteres tardaría millones de años.' },
                        },
                        {
                            frente: { icono: '🎲', titulo: 'Aleatoriedad' },
                            atras: { titulo: 'Aleatoriedad', desc: 'Combina mayúsculas, minúsculas, números y símbolos. Evita fechas, nombres o palabras del diccionario.' },
                        },
                        {
                            frente: { icono: '🔄', titulo: 'Unicidad' },
                            atras: { titulo: 'Unicidad', desc: 'Una contraseña diferente para cada cuenta. Si una es comprometida, las demás siguen seguras. Usa un gestor de contraseñas.' },
                        },
                    ],
                },
                {
                    tipo: 'senales',
                    titulo: '5 Hábitos peligrosos que debes evitar',
                    instruccion: 'Toca cada hábito para entender por qué es peligroso',
                    senales: [
                        { icono: '♻️', titulo: 'Reutilizar contraseñas', desc: 'Si una cuenta es comprometida, todas las cuentas con la misma contraseña quedan expuestas automáticamente.' },
                        { icono: '📅', titulo: 'Usar información personal', desc: 'Tu fecha de nacimiento, nombre o el de tu mascota son lo primero que un atacante prueba.' },
                        { icono: '📱', titulo: 'Guardarlas en notas del celular', desc: 'Si pierdes tu celular o alguien accede a él, tendrá todas tus contraseñas de inmediato.' },
                        { icono: '💬', titulo: 'Compartirlas por mensaje', desc: 'Los mensajes pueden ser interceptados, hackeados o simplemente quedar guardados para siempre.' },
                        { icono: '🔓', titulo: 'No usar 2FA', desc: 'La autenticación de dos factores es tu segunda línea de defensa. Sin ella, tu contraseña es tu único escudo.' },
                    ],
                },
                {
                    tipo: 'casoreal',
                    tag: 'Caso Real — Global 2021',
                    titulo: 'RockYou2021: 8.4 mil millones de contraseñas filtradas',
                    desc: 'La mayor filtración de contraseñas de la historia expuso 8.4 mil millones de contraseñas únicas recopiladas de brechas anteriores. Millones de personas usaban las mismas contraseñas en múltiples servicios, permitiendo a los atacantes acceder a cuentas bancarias, correos y redes sociales con un solo archivo.',
                    leccion: 'Si tu contraseña aparece en una filtración y la usas en múltiples sitios, todas tus cuentas están comprometidas al mismo tiempo.',
                    stats: [
                        { valor: '8.4B', label: 'Contraseñas filtradas' },
                        { valor: '100GB', label: 'Tamaño del archivo' },
                        { valor: '1 clic', label: 'Para verificar si eres víctima' },
                    ],
                },
                {
                    tipo: 'quiz',
                    titulo: '¿Cuánto aprendiste?',
                    pregunta: '¿Cuál de estas contraseñas es MÁS segura?',
                    opciones: [
                        { texto: 'Password123!', correcto: false, feedback: 'Es una de las contraseñas más usadas del mundo. Los atacantes la prueban en los primeros segundos.' },
                        { texto: 'maria1990cdmx', correcto: false, feedback: 'Contiene información personal predecible. Un atacante que te conozca un poco la adivinaría fácil.' },
                        { texto: 'Tr0mb0n#Azul$Luna42', correcto: true, feedback: '¡Correcto! Combina palabras aleatorias, números y símbolos, no tiene información personal y tiene 19 caracteres.' },
                        { texto: '12345678', correcto: false, feedback: 'Esta es literalmente la contraseña más común del mundo. Se descifra en menos de 1 segundo.' },
                    ],
                },
            ],
        },

        redes_sociales: {
            titulo: 'Redes Sociales',
            emoji: '📱',
            slides: [
                {
                    tipo: 'impacto',
                    dato: '91%',
                    desc: 'de los ataques de spear phishing usan información de redes sociales',
                    contexto: 'Lo que publicas en LinkedIn, Instagram o Facebook puede ser usado por atacantes para construir ataques personalizados contra ti o tu organización.',
                    accion: 'Quiero saber más →',
                },
                {
                    tipo: 'concepto',
                    titulo: '¿Cómo usan tus redes para atacarte?',
                    pasos: [
                        { icono: '🔍', texto: 'OSINT: recopilan tu información pública — trabajo, jefe, proyectos, contactos' },
                        { icono: '🗺️', texto: 'Mapean tu red: saben quiénes son tus colegas, proveedores y superiores' },
                        { icono: '🎭', texto: 'Construyen un ataque personalizado suplantando a alguien de tu confianza' },
                        { icono: '💸', texto: 'Te engañan para que entregues información o dinero sin sospechar' },
                    ],
                },
                {
                    tipo: 'flipcards',
                    titulo: '3 Riesgos que no conocías',
                    instruccion: 'Toca cada tarjeta para descubrirlos',
                    cards: [
                        {
                            frente: { icono: '🔍', titulo: 'OSINT' },
                            atras: { titulo: 'Inteligencia de Fuentes Abiertas', desc: 'Los atacantes usan herramientas gratuitas para recopilar toda tu información pública en minutos. Tu perfil de LinkedIn es un mapa de ataque.' },
                        },
                        {
                            frente: { icono: '📍', titulo: 'Geolocalización' },
                            atras: { titulo: 'Ubicación en tiempo real', desc: 'Publicar "estoy de vacaciones" le dice a un atacante que tu casa está sola, tu oficina sin supervisión y tú distraído.' },
                        },
                        {
                            frente: { icono: '🤝', titulo: 'Conexiones' },
                            atras: { titulo: 'Tu red de contactos', desc: 'Tus conexiones en LinkedIn revelan la jerarquía de tu empresa. Un atacante sabe exactamente a quién suplantar para que confíes.' },
                        },
                    ],
                },
                {
                    tipo: 'senales',
                    titulo: '5 Cosas peligrosas que publicamos sin saberlo',
                    instruccion: 'Toca cada una para entender el riesgo',
                    senales: [
                        { icono: '🏢', titulo: 'Nombre de tu jefe y proyectos', desc: 'Con eso, un atacante puede enviarte un correo perfectamente personalizado suplantando a tu superior.' },
                        { icono: '📍', titulo: 'Ubicación en tiempo real', desc: 'Fotos con geolocalización, check-ins y stories revelan exactamente dónde estás y cuándo no estás en casa u oficina.' },
                        { icono: '🎂', titulo: 'Fecha de nacimiento completa', desc: 'Es usada para verificar identidad en bancos y para adivinar contraseñas o preguntas de seguridad.' },
                        { icono: '📞', titulo: 'Número de teléfono personal', desc: 'Permite ataques de vishing (phishing por voz) y SIM swapping para robar tu número de celular.' },
                        { icono: '🖼️', titulo: 'Fotos de tu área de trabajo', desc: 'Pueden revelar pantallas con información confidencial, sistemas que usas o el layout de tu oficina.' },
                    ],
                },
                {
                    tipo: 'casoreal',
                    tag: 'Caso Real — Twitter 2020',
                    titulo: 'Hackeo masivo usando LinkedIn e ingeniería social',
                    desc: 'Hackers usaron información de LinkedIn para identificar empleados de Twitter con acceso privilegiado. Los contactaron por teléfono haciéndose pasar por el equipo de TI interno. Con eso accedieron a cuentas de Obama, Elon Musk, Apple y Biden para promover una estafa de Bitcoin que generó $120,000 USD en minutos.',
                    leccion: 'La información que compartes públicamente se convierte en el arma que usan contra ti. Cada dato es una pieza del puzzle.',
                    stats: [
                        { valor: '130', label: 'Cuentas hackeadas' },
                        { valor: '$120K', label: 'Robados en minutos' },
                        { valor: '0', label: 'Vulnerabilidades técnicas' },
                    ],
                },
                {
                    tipo: 'quiz',
                    titulo: '¿Qué aprendiste?',
                    pregunta: '¿Qué información es MÁS peligrosa publicar en LinkedIn?',
                    opciones: [
                        { texto: 'Tu película favorita', correcto: false, feedback: 'Eso no representa un riesgo significativo para tu seguridad.' },
                        { texto: 'El nombre de tu jefe, tu área y los proyectos en los que trabajas', correcto: true, feedback: '¡Correcto! Con esa información un atacante construye un spear phishing perfectamente personalizado y convincente.' },
                        { texto: 'Tu universidad y año de graduación', correcto: false, feedback: 'Información general educativa tiene bajo riesgo, aunque las fechas pueden usarse en contraseñas.' },
                        { texto: 'Que te gusta el café por las mañanas', correcto: false, feedback: 'Eso no representa información útil para un atacante.' },
                    ],
                },
            ],
        },

        malware: {
            titulo: 'Malware',
            emoji: '🦠',
            slides: [
                {
                    tipo: 'impacto',
                    dato: '$4B',
                    desc: 'en pérdidas causadas por un solo ataque de ransomware en 2017',
                    contexto: 'WannaCry infectó 200,000 computadoras en 150 países en un solo día. Todo comenzó con empleados que abrieron archivos adjuntos maliciosos.',
                    accion: 'Quiero aprender a protegerme →',
                },
                {
                    tipo: 'concepto',
                    titulo: '¿Cómo llega el malware a tu dispositivo?',
                    pasos: [
                        { icono: '📎', texto: 'Adjuntos en correos: facturas, documentos Word, PDFs con código malicioso oculto' },
                        { icono: '🔗', texto: 'Enlaces maliciosos: URLs que descargan malware automáticamente al visitarlas' },
                        { icono: '💾', texto: 'Dispositivos físicos: USBs abandonados o "regalados" que se ejecutan al conectarlos' },
                        { icono: '📥', texto: 'Software falso: actualizaciones o programas que en realidad son malware disfrazado' },
                    ],
                },
                {
                    tipo: 'flipcards',
                    titulo: '3 Tipos de malware que debes conocer',
                    instruccion: 'Toca cada tarjeta para descubrirlos',
                    cards: [
                        {
                            frente: { icono: '🔒', titulo: 'Ransomware' },
                            atras: { titulo: 'Ransomware', desc: 'Cifra todos tus archivos y pide un rescate para devolvértelos. Las empresas pagan millones. Sin backup, los datos se pierden para siempre.' },
                        },
                        {
                            frente: { icono: '🕵️', titulo: 'Spyware' },
                            atras: { titulo: 'Spyware', desc: 'Se instala silenciosamente y espía todo lo que haces: contraseñas que escribes, sitios que visitas, conversaciones. Puedes tenerlo ahora y no saberlo.' },
                        },
                        {
                            frente: { icono: '🤖', titulo: 'Troyano' },
                            atras: { titulo: 'Troyano', desc: 'Parece un programa legítimo pero abre una puerta trasera en tu dispositivo. El atacante puede controlarlo remotamente sin que te des cuenta.' },
                        },
                    ],
                },
                {
                    tipo: 'senales',
                    titulo: '5 Señales de alerta antes de abrir algo',
                    instruccion: 'Toca cada señal para aprender a detectarlas',
                    senales: [
                        { icono: '📄', titulo: 'Archivos ejecutables por correo', desc: '.exe, .bat, .vbs, .js adjuntos en correos son casi siempre malware. Ninguna empresa legítima envía programas por correo.' },
                        { icono: '⚙️', titulo: '"Habilita macros para ver el contenido"', desc: 'Los documentos legítimos no necesitan macros. Esta es la técnica más común para distribuir malware en documentos Office.' },
                        { icono: '🔄', titulo: 'Actualización solicitada por correo', desc: 'Las actualizaciones legítimas llegan desde la app misma o el sistema operativo, nunca por correo electrónico.' },
                        { icono: '💾', titulo: 'USB de origen desconocido', desc: 'Los atacantes dejan USBs en estacionamientos y lobbys. La curiosidad humana hace el resto. Nunca conectes uno que no sea tuyo.' },
                        { icono: '🌐', titulo: '"Instala este plugin para continuar"', desc: 'Sitios que piden instalar software para ver contenido casi siempre están distribuyendo malware.' },
                    ],
                },
                {
                    tipo: 'casoreal',
                    tag: 'Caso Real — Global 2017',
                    titulo: 'WannaCry: 200,000 víctimas en 150 países',
                    desc: 'El ransomware WannaCry se propagó globalmente en horas. Hospitales del NHS en Reino Unido tuvieron que cancelar cirugías. Empresas como Telefónica, FedEx y el Ministerio del Interior de Rusia fueron paralizadas. Todo comenzó con empleados que abrieron adjuntos maliciosos en correos aparentemente normales.',
                    leccion: 'Un solo clic en el dispositivo equivocado puede paralizar toda una organización. La primera línea de defensa eres tú.',
                    stats: [
                        { valor: '200K', label: 'Computadoras infectadas' },
                        { valor: '150', label: 'Países afectados' },
                        { valor: '$4B', label: 'En pérdidas globales' },
                    ],
                },
                {
                    tipo: 'quiz',
                    titulo: '¿Estás listo?',
                    pregunta: 'Recibes un documento Word de un proveedor conocido. Al abrirlo aparece: "Este documento está protegido. Habilita las macros para ver el contenido." ¿Qué haces?',
                    opciones: [
                        { texto: 'Habilito las macros — es un proveedor que conozco', correcto: false, feedback: 'El hecho de conocer al proveedor no garantiza que el correo sea legítimo. Su cuenta pudo haber sido comprometida.' },
                        { texto: 'No habilito las macros y contacto al proveedor por teléfono para verificar', correcto: true, feedback: '¡Perfecto! Los documentos legítimos nunca necesitan macros para mostrar su contenido. Verificar por otro canal es la respuesta correcta.' },
                        { texto: 'Habilito las macros solo si el antivirus no detecta nada', correcto: false, feedback: 'El malware moderno está diseñado para evadir antivirus. No confíes solo en eso.' },
                        { texto: 'Abro el archivo en modo incógnito del navegador', correcto: false, feedback: 'El modo incógnito no protege contra malware en archivos descargados. Solo afecta el historial de navegación.' },
                    ],
                },
            ],
        },
    },

    // ══════════════════════════════════════════════════════════════════════
    //  RENDERIZAR LECCIÓN
    // ══════════════════════════════════════════════════════════════════════

    renderizar(moduloId) {
        this.moduloActual = moduloId;
        this.slideActual = 0;
        this.puntosRevelados = [];
        this.flipsRevelados = [];
        this.quizRespondido = false;

        const leccion = this.contenido[moduloId];
        if (!leccion) return;

        this.totalSlides = leccion.slides.length;
        this.renderizarSlide();
    },

    // ── Renderizar slide actual ───────────────────────────────────────────
    renderizarSlide() {
        const leccion = this.contenido[this.moduloActual];
        const slide = leccion.slides[this.slideActual];

        // Actualizar header
        const headerModulo = document.getElementById('leccion-header-modulo');
        if (headerModulo) headerModulo.textContent = `${leccion.emoji} ${leccion.titulo}`;

        const progreso = document.getElementById('leccion-progreso-texto');
        if (progreso) progreso.textContent = `Paso ${this.slideActual + 1} de ${this.totalSlides}`;

        // Actualizar barra de progreso
        const barra = document.getElementById('leccion-barra-progreso');
        if (barra) {
            setTimeout(() => {
                barra.style.width = `${((this.slideActual + 1) / this.totalSlides) * 100}%`;
            }, 100);
        }

        // Renderizar contenido según tipo
        const contenedor = document.getElementById('leccion-contenido');
        if (!contenedor) return;

        switch (slide.tipo) {
            case 'impacto': contenedor.innerHTML = this.htmlImpacto(slide); break;
            case 'concepto': contenedor.innerHTML = this.htmlConcepto(slide); break;
            case 'flipcards': contenedor.innerHTML = this.htmlFlipCards(slide); break;
            case 'senales': contenedor.innerHTML = this.htmlSenales(slide); break;
            case 'casoreal': contenedor.innerHTML = this.htmlCasoReal(slide); break;
            case 'quiz': contenedor.innerHTML = this.htmlQuiz(slide); break;
        }

        // Scroll al inicio
        contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    // ── Avanzar al siguiente slide ────────────────────────────────────────
    avanzar() {
        if (this.slideActual < this.totalSlides - 1) {
            this.slideActual++;
            this.puntosRevelados = [];
            this.flipsRevelados = [];
            this.renderizarSlide();
        }
    },

    // ══════════════════════════════════════════════════════════════════════
    //  HTML DE CADA TIPO DE SLIDE
    // ══════════════════════════════════════════════════════════════════════

    htmlImpacto(slide) {
        return `
      <div class="slide-impacto">
        <div class="impacto-dato">${slide.dato}</div>
        <div class="impacto-desc">${slide.desc}</div>
        <div class="impacto-contexto">${slide.contexto}</div>
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
        <div class="concepto-pasos">
          ${slide.pasos.map((p, i) => `
            <div class="concepto-paso" style="animation-delay: ${i * 0.15}s">
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
            <div class="flip-card" id="flip-${i}" onclick="Lessons.flipCard(${i})">
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
        <div id="flip-avanzar" style="display:none; margin-top:24px">
          <p class="slide-instruccion" style="color: var(--recompensa); margin-bottom:12px">
            ✅ ¡Revisaste todas las técnicas!
          </p>
          <button class="btn-slide-avanzar" onclick="Lessons.avanzar()">
            Continuar →
          </button>
        </div>
      </div>
    `;
    },

    htmlSenales(slide) {
        return `
      <div class="slide-senales">
        <h2 class="slide-titulo">${slide.titulo}</h2>
        <p class="slide-instruccion">👆 ${slide.instruccion}</p>
        <div class="senales-lista" id="senales-lista">
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
                </div>
                <div class="senal-tap" id="senal-tap-${i}">
                  ${i === 0 ? 'Toca para revelar →' : '🔒 Completa la anterior primero'}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div id="senales-avanzar" style="display:none; margin-top:20px">
          <p class="slide-instruccion" style="color: var(--recompensa); margin-bottom:12px">
            ✅ ¡Conoces todas las señales de alerta!
          </p>
          <button class="btn-slide-avanzar" onclick="Lessons.avanzar()">
            Continuar →
          </button>
        </div>
      </div>
    `;
    },

    htmlCasoReal(slide) {
        return `
      <div class="slide-casoreal">
        <div class="casoreal-tag">${slide.tag}</div>
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
          <span class="casoreal-leccion-label">💡 Lección:</span>
          ${slide.leccion}
        </div>
        <button class="btn-slide-avanzar" onclick="Lessons.avanzar()">
          Entendido →
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
                    onclick="Lessons.responderQuiz(${i}, ${op.correcto}, '${op.feedback.replace(/'/g, "\\'")}', ${slide.opciones.length})">
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

    flipCard(indice) {
        const inner = document.getElementById(`flip-inner-${indice}`);
        if (!inner) return;

        inner.classList.toggle('flipped');

        if (!this.flipsRevelados.includes(indice)) {
            this.flipsRevelados.push(indice);
        }

        const leccion = this.contenido[this.moduloActual];
        const slide = leccion.slides[this.slideActual];
        const totalCards = slide.cards.length;

        if (this.flipsRevelados.length === totalCards) {
            const avanzar = document.getElementById('flip-avanzar');
            if (avanzar) {
                avanzar.style.display = 'block';
                avanzar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    },

    revelarSenal(indice, total) {
        const desc = document.getElementById(`senal-desc-${indice}`);
        const tap = document.getElementById(`senal-tap-${indice}`);
        const item = document.getElementById(`senal-${indice}`);

        if (!desc || item.classList.contains('senal-bloqueada')) return;

        desc.style.display = 'block';
        if (tap) tap.style.display = 'none';
        item.classList.add('senal-revelada');

        // Desbloquear siguiente
        const siguiente = document.getElementById(`senal-${indice + 1}`);
        const tapSig = document.getElementById(`senal-tap-${indice + 1}`);
        if (siguiente) {
            siguiente.classList.remove('senal-bloqueada');
            siguiente.classList.add('senal-activa');
            if (tapSig) tapSig.textContent = 'Toca para revelar →';
        }

        if (!this.puntosRevelados.includes(indice)) {
            this.puntosRevelados.push(indice);
        }

        if (this.puntosRevelados.length === total) {
            const avanzar = document.getElementById('senales-avanzar');
            if (avanzar) {
                avanzar.style.display = 'block';
                avanzar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    },

    responderQuiz(indice, correcto, feedback, total) {
        if (this.quizRespondido) return;
        this.quizRespondido = true;

        // Colorear opciones
        for (let i = 0; i < total; i++) {
            const btn = document.getElementById(`quiz-op-${i}`);
            if (!btn) continue;
            btn.disabled = true;
        }

        const btnSeleccionado = document.getElementById(`quiz-op-${indice}`);
        if (btnSeleccionado) {
            btnSeleccionado.classList.add(correcto ? 'quiz-opcion-correcta' : 'quiz-opcion-incorrecta');
        }

        // Marcar la correcta si falló
        if (!correcto) {
            const leccion = this.contenido[this.moduloActual];
            const slide = leccion.slides[this.slideActual];
            slide.opciones.forEach((op, i) => {
                if (op.correcto) {
                    const btn = document.getElementById(`quiz-op-${i}`);
                    if (btn) btn.classList.add('quiz-opcion-correcta');
                }
            });
        }

        // Feedback
        const feedbackEl = document.getElementById('quiz-feedback');
        if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.className = `quiz-feedback-contenedor ${correcto ? 'feedback-correcto' : 'feedback-incorrecto'}`;
            feedbackEl.innerHTML = `
        <strong>${correcto ? '✅ ¡Correcto!' : '❌ No exactamente...'}</strong><br>
        ${feedback}
      `;
        }

        // Botón continuar
        const avanzar = document.getElementById('quiz-avanzar');
        if (avanzar) {
            setTimeout(() => {
                avanzar.style.display = 'block';
                const btn = avanzar.querySelector('button');
                if (btn && !correcto) {
                    btn.textContent = '🔄 Reintentar quiz';
                    btn.onclick = () => {
                        this.quizRespondido = false;
                        this.renderizarSlide();
                    };
                    btn.classList.remove('btn-verde');
                }
                avanzar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 600);
        }
    },
};

console.log('✅ Lessons cargado correctamente');