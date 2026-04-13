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
  Tracker.registrar(escenario, decision);
  mostrarFeedback(escenario, decision);
  mostrarPantalla('pantalla-feedback');
};

// ── Renderiza el feedback educativo ───────────────────────
const mostrarFeedback = (escenario, decision) => {
  const header = document.getElementById('feedback-header');
  const configs = {
    reportar: {
      clase:     'correcto',
      icono:     '🎯',
      titulo:    '¡Correcto! Lo detectaste',
      subtitulo: 'Reportaste este correo como phishing. Esa es siempre la mejor decisión.'
    },
    ignorar: {
      clase:     'advertencia',
      icono:     '😐',
      titulo:    'Ignoraste el correo',
      subtitulo: 'Ignorar es mejor que hacer clic, pero lo correcto es reportarlo a tu equipo de seguridad.'
    },
    clic: {
      clase:     'peligro',
      icono:     '⚠️',
      titulo:    'Hiciste clic en el enlace',
      subtitulo: 'En un ataque real, esto podría haber comprometido tus datos o dispositivo.'
    }
  };

  const cfg = configs[decision];
  header.className       = `feedback-header ${cfg.clase}`;
  document.getElementById('feedback-icono').textContent    = cfg.icono;
  document.getElementById('feedback-titulo').textContent   = cfg.titulo;
  document.getElementById('feedback-subtitulo').textContent = cfg.subtitulo;

  // Explicación del escenario
  document.getElementById('feedback-explicacion').textContent = escenario.explicacion;

  // Señales de alerta
  document.getElementById('feedback-senales').innerHTML =
    escenario.senalesAlerta.map(s => `<li>${s}</li>`).join('');

  // Consejos
  document.getElementById('feedback-consejos').innerHTML =
    escenario.consejos.map(c => `<li>${c}</li>`).join('');

  // Botón: si es el último escenario, ir al dashboard
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