// js/app.js
// Módulo principal — conecta todos los módulos y controla la navegación

const ADMIN_PASSWORD = 'admin123';
let resultadoFinal = null;
let categoriaAnterior = null;

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
//  FLUJO ADMINISTRADOR
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

// ── Drill-down: ver detalle de departamento ───────────────────────────────
function verDetalleDepartamento(nombreDepto) {
  Metrics.renderizarDetalleDepartamento(nombreDepto);
  mostrarPantalla('pantalla-depto');
}

function volverAlAdmin() {
  mostrarPantalla('pantalla-admin');
  Metrics.renderizarDashboardAdmin();
}

// ── Drill-down: ver detalle de empleado ───────────────────────────────────
function verDetalleEmpleado(idEmpleado, departamento) {
  Metrics.deptoActual = departamento;
  Metrics.renderizarDetalleEmpleado(idEmpleado);
  mostrarPantalla('pantalla-empleado');
}

function volverAlDepto() {
  if (Metrics.deptoActual) {
    verDetalleDepartamento(Metrics.deptoActual);
  } else {
    volverAlAdmin();
  }
}

// ── Exportar CSV ──────────────────────────────────────────────────────────
function exportarCSV() {
  const historial = Tracker.obtenerHistorial();
  if (historial.length === 0) {
    alert('No hay datos para exportar.');
    return;
  }

  const headers = [
    'Nombre',
    'Num. Empleado',
    'Departamento',
    'Fecha',
    'Score',
    'Tasa de Clic (%)',
    'Tasa de Detección (%)',
    'Tasa de Ignorar (%)',
    'Nivel de Riesgo',
    'Categoría más vulnerable',
  ];

  const filas = historial.map(emp => [
    emp.nombre,
    emp.numEmpleado || 'N/A',
    emp.departamento,
    Metrics.formatearFecha(emp.fechaFin),
    emp.score || 0,
    emp.metricas.tasaClic,
    emp.metricas.tasaDeteccion,
    emp.metricas.tasaIgnorar,
    emp.metricas.nivelRiesgo,
    emp.metricas.catMasVulnerable || 'N/A',
  ]);

  const csv = [headers, ...filas]
    .map(fila => fila.map(celda => `"${celda}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SecureAware_Resultados_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════════════════════════════════════
//  FLUJO EMPLEADO
// ══════════════════════════════════════════════════════════════════════════

function iniciarCapacitacion() {
  const nombre = document.getElementById('input-nombre').value.trim();
  const numEmpleado = document.getElementById('input-num-empleado').value.trim();
  const departamento = document.getElementById('input-departamento').value;
  const errorEl = document.getElementById('error-registro');

  if (!nombre || !numEmpleado || !departamento) {
    errorEl.style.display = 'block';
    return;
  }

  errorEl.style.display = 'none';
  Tracker.iniciarSesion(nombre, numEmpleado, departamento);
  Gamification.inicializar();
  Simulator.inicializar(PHISHING_SCENARIOS);
  categoriaAnterior = null;
  mostrarPantalla('pantalla-simulador');
  Simulator.renderizarEscenarioActual();
  Gamification.iniciarTimer();
}

// ── Registrar decisión ────────────────────────────────────────────────────
function registrarDecision(decision) {
  const escenario = Simulator.escenarioActual();
  Simulator.habilitarBotones(false);

  // Registrar en gamificación
  Gamification.registrarDecision(decision, escenario.nivel);

  // Registrar en tracker
  Tracker.registrarDecision(escenario, decision);

  // Mostrar feedback
  Simulator.renderizarFeedback(escenario, decision);
  mostrarPantalla('pantalla-feedback');
}

// ── Siguiente escenario con transición entre categorías ───────────────────
function siguienteEscenario() {
  if (Simulator.hayMas()) {
    Simulator.avanzar();
    const siguiente = Simulator.escenarioActual();

    // Verificar si cambiamos de categoría
    if (categoriaAnterior && categoriaAnterior !== siguiente.categoria) {
      Gamification.mostrarTransicion(
        categoriaAnterior,
        siguiente.categoria,
        () => {
          mostrarPantalla('pantalla-simulador');
          Simulator.renderizarEscenarioActual();
          Gamification.iniciarTimer();
        }
      );
    } else {
      mostrarPantalla('pantalla-simulador');
      Simulator.renderizarEscenarioActual();
      Gamification.iniciarTimer();
    }

    categoriaAnterior = siguiente.categoria;

  } else {
    // Finalizar
    resultadoFinal = Tracker.finalizarSesion();

    // Guardar score en el resultado
    resultadoFinal.score = Gamification.score;
    const historial = Tracker.obtenerHistorial();
    const entrada = historial.find(e => e.id === resultadoFinal.id);
    if (entrada) {
      entrada.score = Gamification.score;
      localStorage.setItem('secureaware_resultados', JSON.stringify(historial));
    }

    mostrarPantalla('pantalla-resumen');
    Metrics.renderizarResumenPersonal(resultadoFinal);

    // Score final e insignias
    const scoreEl = document.getElementById('score-final-valor');
    if (scoreEl) scoreEl.textContent = `⭐ ${Gamification.score}`;
    Gamification.renderizarInsignias('insignias-contenedor');
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  INICIALIZACIÓN
// ══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  mostrarPantalla('pantalla-inicio');
  console.log('✅ SecureAware inicializado correctamente');
  console.log(`📋 Escenarios disponibles: ${PHISHING_SCENARIOS.length}`);
});