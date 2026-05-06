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

// ── MODO INSPECTOR ─────────────────────────────────────────
const toggleInspector = () => {
  const panel   = document.getElementById('inspector-panel');
  const visible = panel.style.display === 'block';
  if (visible) { panel.style.display = 'none'; return; }

  const e = Simulator.obtenerActual();

  const dominio           = e.remitente.split('@')[1] || '';
  const patronesMalos     = [/-mx\.|seguridad\.|alertas\.|soporte\.|corp\.|gobierno\./i];
  const dominioSospechoso = patronesMalos.some(p => p.test(dominio))
    || !dominio.match(/^[\w-]+\.(com|mx|gob\.mx|org|edu|net)$/i);

  const palabrasUrgencia  = /urgente|suspendida|bloqueada|inmediato|24 horas|30 minutos|acción requerida|SUSPENDIDA|GANADOR|GRATIS/i;
  const asuntoSospechoso  = palabrasUrgencia.test(e.asunto);

  const urlSimulada  = e.esPhishing
    ? `http://${dominio}/verificar?token=a8f3k2`
    : `https://${dominio}/cuenta`;
  const urlSospechosa = e.esPhishing && !urlSimulada.startsWith('https');

  const items = [
    {
      label:  'Dirección del remitente',
      valor:  e.remitente,
      estado: dominioSospechoso ? 'peligro' : 'seguro',
      alerta: dominioSospechoso
        ? '⚠️ El dominio no corresponde a una entidad oficial conocida'
        : '✅ El dominio parece legítimo'
    },
    {
      label:  'Asunto del correo',
      valor:  e.asunto,
      estado: asuntoSospechoso ? 'peligro' : 'seguro',
      alerta: asuntoSospechoso
        ? '⚠️ Contiene palabras de urgencia o presión psicológica'
        : '✅ El asunto no genera urgencia artificial'
    },
    {
      label:  'URL del enlace',
      valor:  urlSimulada,
      estado: urlSospechosa ? 'peligro' : e.esPhishing ? 'neutro' : 'seguro',
      alerta: urlSospechosa
        ? '⚠️ Usa HTTP sin cifrado — nunca ingreses datos aquí'
        : e.esPhishing
          ? '⚠️ Verifica que el dominio coincida exactamente con el oficial'
          : '✅ URL con HTTPS y dominio oficial'
    },
    {
      label:  'Técnica detectada',
      valor:  e.tecnica,
      estado: e.esPhishing ? 'peligro' : 'seguro',
      alerta: e.esPhishing
        ? '⚠️ Este correo usa ingeniería social — analízalo con calma'
        : '✅ No se detectaron técnicas de manipulación'
    }
  ];

  panel.innerHTML = `
    <div class="inspector-titulo">🔎 Modo Inspector — Analiza antes de decidir</div>
    <div class="inspector-fila">
      ${items.map(item => `
        <div class="inspector-item ${item.estado}">
          <div class="inspector-item-label">${item.label}</div>
          <div class="inspector-item-valor">${item.valor}</div>
          <div class="inspector-item-alerta">${item.alerta}</div>
        </div>
      `).join('')}
    </div>
  `;
  panel.style.display = 'block';
};

// ── PANTALLA 2 → 3: Registrar decisión y mostrar feedback ─
const registrarDecision = (decision) => {
  const escenario = Simulator.obtenerActual();
  const tiempo    = Simulator.obtenerTiempo();
  Tracker.registrar(escenario, decision, tiempo);
  mostrarFeedback(escenario, decision);
  mostrarPantalla('pantalla-feedback');
// Lanzar análisis de IA en paralelo
  ClaudeAI.generarFeedback(escenario, decision, Tracker.obtenerTodas().slice(-1)[0]?.tiempo || 0);};

// ── Renderiza el feedback educativo ───────────────────────
const mostrarFeedback = (escenario, decision) => {
  const header = document.getElementById('feedback-header');
  let cfg = {};

  if (escenario.esPhishing) {
    const configs = {
      reportar: { clase: 'correcto',    icono: '🎯', titulo: '¡Correcto! Lo detectaste',        subtitulo: 'Reportaste este correo como phishing. Esa es siempre la mejor decisión.' },
      ignorar:  { clase: 'advertencia', icono: '😐', titulo: 'Ignoraste el correo',              subtitulo: 'Ignorar es mejor que hacer clic, pero lo correcto es reportarlo a tu equipo de seguridad.' },
      clic:     { clase: 'peligro',     icono: '⚠️', titulo: 'Hiciste clic en el enlace',        subtitulo: 'En un ataque real, esto podría haber comprometido tus datos o dispositivo.' }
    };
    cfg = configs[decision];
  } else {
    const configs = {
      clic:     { clase: 'correcto',    icono: '✅', titulo: '¡Correcto! Era un correo legítimo', subtitulo: 'Identificaste correctamente que este correo era real y seguro.' },
      ignorar:  { clase: 'advertencia', icono: '😐', titulo: 'Ignoraste un correo legítimo',      subtitulo: 'Este correo era real. Ignorarlo no causa daño, pero podrías perder información importante.' },
      reportar: { clase: 'peligro',     icono: '❌', titulo: 'Falso positivo — era legítimo',     subtitulo: 'Reportaste un correo real como phishing. Ser precavido es bueno, pero aprender a distinguir es mejor.' }
    };
    cfg = configs[decision];
  }

  header.className = `feedback-header ${cfg.clase}`;
  document.getElementById('feedback-icono').textContent     = cfg.icono;
  document.getElementById('feedback-titulo').textContent    = cfg.titulo;
  document.getElementById('feedback-subtitulo').textContent = cfg.subtitulo;
  document.getElementById('feedback-explicacion').textContent = escenario.explicacion;

  const senalesEl     = document.getElementById('feedback-senales');
  const tituloSenales = document.getElementById('titulo-senales');

  if (escenario.esPhishing) {
    tituloSenales.textContent = '🚩 Señales de alerta que debiste notar:';
    senalesEl.innerHTML = escenario.senalesAlerta.map(s => `<li>${s}</li>`).join('');
  } else {
    tituloSenales.textContent = '✅ Señales de confianza en este correo:';
    senalesEl.innerHTML = escenario.senalesConfianza.map(s => `<li>${s}</li>`).join('');
  }

  document.getElementById('feedback-consejos').innerHTML =
    escenario.consejos.map(c => `<li>${c}</li>`).join('');

  const btnSiguiente = document.getElementById('btn-siguiente');
  const esUltimo     = Tracker.obtenerTodas().length === PHISHING_SCENARIOS.length;
  btnSiguiente.textContent = esUltimo ? '📊 Ver mis resultados →' : 'Siguiente correo →';
};

// ── PANTALLA 3 → 2 o 4: Siguiente escenario o dashboard ──
const siguienteEscenario = () => {
  const hayMas = Simulator.siguiente();
  if (hayMas) {
    mostrarPantalla('pantalla-simulador');
  } else {
    Tracker.guardarSesion();
    Metrics.renderizar();
    renderizarHistorial();
    mostrarPantalla('pantalla-dashboard');
  }
};

// ── Historial de sesiones previas ─────────────────────────
const renderizarHistorial = () => {
  const historial   = Tracker.cargarHistorial();
  const contenedor  = document.getElementById('historial-sesiones');
  if (!contenedor) return;

  // Excluir la sesión actual (última guardada)
  const previas = historial.slice(0, -1);

  if (previas.length === 0) {
    contenedor.innerHTML = `
      <p style="color:var(--gris); font-size:14px;">
        Esta es tu primera simulación. Aquí verás tu progreso en futuras sesiones.
      </p>`;
    return;
  }

  const filas = previas.reverse().map(s => `
    <tr>
      <td>${s.fecha}</td>
      <td>${s.resumen.total}</td>
      <td>${s.resumen.correctas} / ${s.resumen.total}</td>
      <td>${s.resumen.caidas}</td>
      <td>${s.resumen.promedio}s</td>
    </tr>
  `).join('');

  contenedor.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Correos</th>
          <th>Correctas</th>
          <th>Caídas</th>
          <th>T. Promedio</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>
    <button onclick="limpiarHistorial()"
      style="margin-top:12px; background:none; border:1px solid #ddd;
             color:var(--gris); padding:8px 16px; border-radius:8px;
             cursor:pointer; font-size:13px;">
      🗑️ Limpiar historial
    </button>
  `;
};

const limpiarHistorial = () => {
  if (confirm('¿Segura que quieres borrar todo el historial de sesiones?')) {
    Tracker.limpiarHistorial();
    renderizarHistorial();
  }
};

// ── PANTALLA 4 → 1: Reiniciar todo ────────────────────────
const reiniciarSimulacion = () => {
  Tracker.reiniciar();
  mostrarPantalla('pantalla-bienvenida');
};

// ── Modo organizacional ────────────────────────────────────
const mostrarRegistroOrg = () => {
  document.getElementById('modal-org').style.display = 'block';
  document.getElementById('org-nombre-input').focus();
};

const registrarEnOrg = () => {
  const nombre = document.getElementById('org-nombre-input').value.trim();
  if (!nombre) { alert('Por favor escribe tu nombre.'); return; }
  OrgMode.guardarParticipante(nombre);
  document.getElementById('modal-org').style.display = 'none';
  document.getElementById('org-nombre-input').value  = '';
  alert(`✅ "${nombre}" registrado en el dashboard del equipo.`);
};

// Renderizar org al entrar a la pantalla
document.addEventListener('DOMContentLoaded', () => {
  OrgMode.renderizar();
});