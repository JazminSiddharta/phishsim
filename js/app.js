// js/app.js
// Módulo principal — conecta todos los módulos y controla la navegación

const ADMIN_PASSWORD = 'admin123';
let resultadoFinal = null;

// ══════════════════════════════════════════════════════════════════════════
//  NAVEGACIÓN ENTRE PANTALLAS
// ══════════════════════════════════════════════════════════════════════════

function mostrarPantalla(idPantalla) {
  document.querySelectorAll('.pantalla').forEach(p => {
    p.classList.remove('activa');
  });
  document.getElementById(idPantalla).classList.add('activa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════════════════════════════════════════
//  FLUJO DEL ADMINISTRADOR
// ══════════════════════════════════════════════════════════════════════════

function mostrarLoginAdmin() {
  document.getElementById('input-password').value = '';
  document.getElementById('error-login').style.display = 'none';
  mostrarPantalla('pantalla-login-admin');
}

function verificarAdmin() {
  const password = document.getElementById('input-password').value;
  if (password === ADMIN_PASSWORD) {
    mostrarPantalla('pantalla-admin');
    Metrics.renderizarDashboardAdmin();
  } else {
    document.getElementById('error-login').style.display = 'block';
    document.getElementById('input-password').value = '';
    document.getElementById('input-password').focus();
  }
}

function cerrarSesionAdmin() {
  mostrarPantalla('pantalla-inicio');
}

// ══════════════════════════════════════════════════════════════════════════
//  FLUJO DEL EMPLEADO
// ══════════════════════════════════════════════════════════════════════════

function iniciarCapacitacion() {
  const nombre = document.getElementById('input-nombre').value.trim();
  const departamento = document.getElementById('input-departamento').value;
  const errorEl = document.getElementById('error-registro');

  if (!nombre || !departamento) {
    errorEl.style.display = 'block';
    return;
  }

  errorEl.style.display = 'none';
  Tracker.iniciarSesion(nombre, departamento);
  Simulator.inicializar(PHISHING_SCENARIOS);
  mostrarPantalla('pantalla-simulador');
  Simulator.renderizarEscenarioActual();
}

function registrarDecision(decision) {
  const escenario = Simulator.escenarioActual();
  Simulator.habilitarBotones(false);
  Tracker.registrarDecision(escenario, decision);
  Simulator.renderizarFeedback(escenario, decision);
  mostrarPantalla('pantalla-feedback');
}

function siguienteEscenario() {
  if (Simulator.hayMas()) {
    Simulator.avanzar();
    mostrarPantalla('pantalla-simulador');
    Simulator.renderizarEscenarioActual();
  } else {
    resultadoFinal = Tracker.finalizarSesion();
    mostrarPantalla('pantalla-resumen');
    Metrics.renderizarResumenPersonal(resultadoFinal);
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  INICIALIZACIÓN
// ══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  mostrarPantalla('pantalla-inicio');
  console.log('✅ SecureAware inicializado correctamente');
});