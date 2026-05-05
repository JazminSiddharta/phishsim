// js/app.js
// Controlador principal de PhishSim
// Conecta todos los módulos y gestiona el flujo entre pantallas

// ── Utilidad: cambiar de pantalla ──────────────────────────
const mostrarPantalla = (id) => {
  document.querySelectorAll('.pantalla').forEach(p => {
    p.classList.remove('activa');
  });
  document.getElementById(id).classList.add('activa');
};

// ── PANTALLA 1 → 2: Iniciar simulación ────────────────────
const iniciarSimulacion = () => {
  Tracker.reiniciar();
  Simulator.iniciar(PHISHING_SCENARIOS);
  mostrarPantalla('pantalla-simulador');
};

// ── PANTALLA 2 → 3: Registrar decisión y mostrar feedback ─
const registrarDecision = (decision) => {
  const escenario = Simulator.obtenerActual();
  const tiempo = Simulator.obtenerTiempo();
  Tracker.registrar(escenario, decision, tiempo);
  mostrarFeedback(escenario, decision);
  mostrarPantalla('pantalla-feedback');
};

// ── Renderiza el feedback educativo ───────────────────────
const mostrarFeedback = (escenario, decision) => {
  const header = document.getElementById('feedback-header');

  // Configuración según tipo de correo y decisión
  let cfg = {};

  if (escenario.esPhishing) {
    const configs = {
      reportar: {
        clase: 'correcto',
        icono: '🎯',
        titulo: '¡Correcto! Lo detectaste',
        subtitulo: 'Reportaste este correo como phishing. Esa es siempre la mejor decisión.'
      },
      ignorar: {
        clase: 'advertencia',
        icono: '😐',
        titulo: 'Ignoraste el correo',
        subtitulo: 'Ignorar es mejor que hacer clic, pero lo correcto es reportarlo a tu equipo de seguridad.'
      },
      clic: {
        clase: 'peligro',
        icono: '⚠️',
        titulo: 'Hiciste clic en el enlace',
        subtitulo: 'En un ataque real, esto podría haber comprometido tus datos o dispositivo.'
      }
    };
    cfg = configs[decision];
  } else {
    // Correo legítimo
    const configs = {
      clic: {
        clase: 'correcto',
        icono: '✅',
        titulo: '¡Correcto! Era un correo legítimo',
        subtitulo: 'Identificaste correctamente que este correo era real y seguro.'
      },
      ignorar: {
        clase: 'advertencia',
        icono: '😐',
        titulo: 'Ignoraste un correo legítimo',
        subtitulo: 'Este correo era real. Ignorarlo no causa daño, pero podrías perder información importante.'
      },
      reportar: {
        clase: 'peligro',
        icono: '❌',
        titulo: 'Falso positivo — era legítimo',
        subtitulo: 'Reportaste un correo real como phishing. Ser precavido es bueno, pero aprender a distinguir es mejor.'
      }
    };
    cfg = configs[decision];
  }

  // Aplicar configuración al header
  header.className = `feedback-header ${cfg.clase}`;
  document.getElementById('feedback-icono').textContent = cfg.icono;
  document.getElementById('feedback-titulo').textContent = cfg.titulo;
  document.getElementById('feedback-subtitulo').textContent = cfg.subtitulo;

  // Explicación del escenario
  document.getElementById('feedback-explicacion').textContent = escenario.explicacion;

  // Señales: de alerta si es phishing, de confianza si es legítimo
  const senalesEl = document.getElementById('feedback-senales');
  const tituloSenales = senalesEl.previousElementSibling;

  if (escenario.esPhishing) {
    tituloSenales.textContent = '🚩 Señales de alerta que debiste notar:';
    senalesEl.innerHTML =
      escenario.senalesAlerta.map(s => `<li>${s}</li>`).join('');
  } else {
    tituloSenales.textContent = '✅ Señales de confianza en este correo:';
    senalesEl.innerHTML =
      escenario.senalesConfianza.map(s => `<li>${s}</li>`).join('');
  }

  // Consejos
  document.getElementById('feedback-consejos').innerHTML =
    escenario.consejos.map(c => `<li>${c}</li>`).join('');

  // Botón final o siguiente
  const btnSiguiente = document.getElementById('btn-siguiente');
  const esUltimo = Tracker.obtenerTodas().length === PHISHING_SCENARIOS.length;
  btnSiguiente.textContent = esUltimo ? '📊 Ver mis resultados →' : 'Siguiente correo →';
};

// ── PANTALLA 3 → 2 o 4: Siguiente escenario o dashboard ──
const siguienteEscenario = () => {
  const hayMas = Simulator.siguiente();
  if (hayMas) {
    mostrarPantalla('pantalla-simulador');
  } else {
    Metrics.renderizar();
    mostrarPantalla('pantalla-dashboard');
  }
};

// ── PANTALLA 4 → 1: Reiniciar todo ────────────────────────
const reiniciarSimulacion = () => {
  Tracker.reiniciar();
  mostrarPantalla('pantalla-bienvenida');
};