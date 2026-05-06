// js/app.js
// Controlador principal de PhishSim
// Conecta todos los módulos y gestiona el flujo entre pantallas

// ── Utilidad: cambiar de pantalla ──────────────────────────
const mostrarPantalla = (id) => {
  document.querySelectorAll('.pantalla').forEach(p => {
    p.classList.remove('activa');
  });
  document.getElementById(id).classList.add('activa');

  // Renderizar org al entrar a esa pantalla
  if (id === 'pantalla-org') OrgMode.renderizar();
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

  const palabrasUrgencia = /urgente|suspendida|bloqueada|inmediato|24 horas|30 minutos|acción requerida|SUSPENDIDA|GANADOR|GRATIS/i;
  const asuntoSospechoso = palabrasUrgencia.test(e.asunto);

  const urlSimulada   = e.esPhishing
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
  mostrarFeedback(escenario, decision, tiempo);
  mostrarPantalla('pantalla-feedback');
};

// ── Renderiza el feedback educativo ───────────────────────
const mostrarFeedback = (escenario, decision, tiempo) => {
  const header = document.getElementById('feedback-header');
  let cfg = {};

  if (escenario.esPhishing) {
    const configs = {
      reportar: { clase: 'correcto',    icono: '🎯', titulo: '¡Correcto! Lo detectaste',         subtitulo: 'Reportaste este correo como phishing. Esa es siempre la mejor decisión.' },
      ignorar:  { clase: 'advertencia', icono: '😐', titulo: 'Ignoraste el correo',               subtitulo: 'Ignorar es mejor que hacer clic, pero lo correcto es reportarlo a tu equipo de seguridad.' },
      clic:     { clase: 'peligro',     icono: '⚠️', titulo: 'Hiciste clic en el enlace',         subtitulo: 'En un ataque real, esto podría haber comprometido tus datos o dispositivo.' }
    };
    cfg = configs[decision];
  } else {
    const configs = {
      clic:     { clase: 'correcto',    icono: '✅', titulo: '¡Correcto! Era un correo legítimo', subtitulo: 'Identificaste correctamente que este correo era real y seguro.' },
      ignorar:  { clase: 'advertencia', icono: '😐', titulo: 'Ignoraste un correo legítimo',      subtitulo: 'Este correo era real. Ignorarlo no causa daño, pero podrías perder información importante.' },
      reportar: { clase: 'peligro',     icono: '❌', titulo: 'Falso positivo — era legítimo',      subtitulo: 'Reportaste un correo real como phishing. Ser precavido es bueno, pero aprender a distinguir es mejor.' }
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

  // Mensaje demo para análisis de IA
  const claudeEl = document.getElementById('feedback-claude');
  const spinner  = document.getElementById('claude-spinner');
  spinner.style.display  = 'none';
  claudeEl.style.display = 'block';
  claudeEl.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border-radius: 10px;
      padding: 20px 24px;
    ">
      <div style="
        font-size: 11px;
        color: rgba(255,255,255,0.4);
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 10px;
      ">✨ Análisis personalizado por IA</div>
      <p style="
        color: rgba(255,255,255,0.9);
        font-size: 14px;
        line-height: 1.8;
        margin: 0 0 12px 0;
      ">
        ${generarMensajeDemo(escenario, decision, tiempo)}
      </p>
      <div style="
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        padding: 10px 14px;
        font-size: 12px;
        color: rgba(255,255,255,0.35);
      ">
        💡 En una implementación con backend propio, este análisis sería generado 
        en tiempo real por inteligencia artificial considerando tu patrón completo 
        de decisiones.
      </div>
    </div>
  `;

  const btnSiguiente = document.getElementById('btn-siguiente');
  const esUltimo     = Tracker.obtenerTodas().length === PHISHING_SCENARIOS.length;
  btnSiguiente.textContent = esUltimo ? '📊 Ver mis resultados →' : 'Siguiente correo →';
};

// ── Genera mensaje demo contextualizado ───────────────────
const generarMensajeDemo = (escenario, decision, tiempo) => {
  const velocidad = tiempo <= 5  ? 'en menos de 5 segundos — una decisión muy rápida'
                  : tiempo <= 15 ? `en ${tiempo} segundos`
                  : `en ${tiempo} segundos, tomándote el tiempo necesario`;

  if (escenario.esPhishing) {
    if (decision === 'reportar') {
      return `Tomaste la decisión correcta ${velocidad}. Identificar un correo de tipo 
      <em>${escenario.tecnica}</em> y reportarlo es exactamente lo que protege a una organización 
      completa. Tu capacidad de detección en esta categoría es una fortaleza.`;
    }
    if (decision === 'clic') {
      return `Hiciste clic ${velocidad}. Los ataques de tipo <em>${escenario.tecnica}</em> 
      están diseñados para provocar exactamente esa reacción. En un entorno real, 
      este clic podría haber iniciado una cadena de compromiso de credenciales. 
      La próxima vez, detente un momento a verificar el dominio del remitente.`;
    }
    return `Ignoraste el correo ${velocidad}. Aunque evitaste el daño inmediato, 
    reportarlo hubiera alertado al equipo de seguridad sobre este intento de 
    <em>${escenario.tecnica}</em>, protegiendo también a otros usuarios.`;
  } else {
    if (decision === 'clic') {
      return `Bien hecho — reconociste ${velocidad} que este era un correo legítimo. 
      Distinguir comunicaciones reales de ataques es tan importante como detectar el phishing. 
      Los falsos positivos generan desconfianza innecesaria en canales oficiales.`;
    }
    if (decision === 'reportar') {
      return `Reportaste un correo legítimo ${velocidad}. Ser precavido es valioso, 
      pero identificar las señales de confianza — como el dominio oficial verificable 
      y la ausencia de urgencia artificial — te ayudará a reducir falsos positivos 
      en el futuro.`;
    }
    return `Ignoraste un correo legítimo ${velocidad}. No representa un riesgo de seguridad, 
    pero en un contexto laboral real podrías perder comunicaciones importantes. 
    Practica identificar las señales de confianza para distinguirlos con seguridad.`;
  }
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
  const historial  = Tracker.cargarHistorial();
  const contenedor = document.getElementById('historial-sesiones');
  if (!contenedor) return;

  const previas = historial.slice(0, -1);

  if (previas.length === 0) {
    contenedor.innerHTML = `
      <div style="
        background: var(--gris-claro);
        border-radius: var(--radio);
        padding: 24px;
        text-align: center;
      ">
        <div style="font-size:32px; margin-bottom:8px">📊</div>
        <div style="font-size:14px; color:var(--gris); line-height:1.6">
          Esta es tu primera simulación.<br>
          Repítela para ver tu progreso aquí.
        </div>
      </div>`;
    return;
  }

  const mejor     = previas.reduce((a, b) => a.resumen.caidas < b.resumen.caidas ? a : b);
  const tendencia = previas.length >= 2
    ? previas[previas.length - 1].resumen.caidas <= previas[previas.length - 2].resumen.caidas
      ? '📈 Mejorando'
      : '📉 Empeorando'
    : '—';

  const filas = previas.slice().reverse().map((s, i) => {
    const esReciente = i === 0;
    return `
      <div style="
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 16px;
        border-radius: 10px;
        background: ${esReciente ? '#eaf4fb' : 'var(--gris-claro)'};
        border: ${esReciente ? '2px solid var(--autoridad)' : '2px solid transparent'};
        margin-bottom: 8px;
      ">
        <div style="
          font-size: 22px;
          font-weight: 800;
          color: ${s.resumen.caidas <= 20 ? 'var(--recompensa)'
                : s.resumen.caidas <= 50 ? '#e67e22'
                : 'var(--urgencia)'};
          min-width: 48px;
          text-align: center;
        ">${s.resumen.caidas}%</div>
        <div style="flex:1">
          <div style="font-size:13px; font-weight:700; color:var(--oscuro)">
            ${esReciente ? '🕐 Sesión más reciente' : s.fecha}
          </div>
          <div style="font-size:12px; color:var(--gris); margin-top:2px">
            ${s.resumen.correctas} de ${s.resumen.total} correctas · 
            ${s.resumen.promedio}s promedio
          </div>
        </div>
        <div style="
          font-size:11px; font-weight:700; padding:4px 10px;
          border-radius:50px;
          background: ${s.resumen.caidas <= 20 ? 'var(--recompensa-claro)'
                      : s.resumen.caidas <= 50 ? '#fff9e6'
                      : 'var(--urgencia-claro)'};
          color: ${s.resumen.caidas <= 20 ? 'var(--recompensa)'
                : s.resumen.caidas <= 50 ? '#e67e22'
                : 'var(--urgencia)'};
        ">
          ${s.resumen.caidas <= 20 ? 'Experto'
          : s.resumen.caidas <= 50 ? 'Medio'
          : 'Alto riesgo'}
        </div>
      </div>
    `;
  }).join('');

  contenedor.innerHTML = `
    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    ">
      <div style="background:var(--recompensa-claro); border-radius:var(--radio);
                  padding:16px; text-align:center; border:2px solid var(--recompensa)">
        <div style="font-size:11px; color:var(--gris); text-transform:uppercase;
                    letter-spacing:1px; margin-bottom:4px">Mejor sesión</div>
        <div style="font-size:24px; font-weight:800; color:var(--recompensa)">
          ${mejor.resumen.caidas}%
        </div>
        <div style="font-size:11px; color:var(--gris)">${mejor.fecha}</div>
      </div>
      <div style="background:var(--autoridad-claro); border-radius:var(--radio);
                  padding:16px; text-align:center; border:2px solid var(--autoridad)">
        <div style="font-size:11px; color:var(--gris); text-transform:uppercase;
                    letter-spacing:1px; margin-bottom:4px">Tendencia</div>
        <div style="font-size:20px; font-weight:800; color:var(--autoridad)">
          ${tendencia}
        </div>
        <div style="font-size:11px; color:var(--gris)">${previas.length} sesión(es) previas</div>
      </div>
    </div>
    ${filas}
    <button onclick="limpiarHistorial()"
      style="margin-top:8px; background:none; border:1px solid #ddd;
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

// ── PANTALLA 4 → 1: Reiniciar todo ────────────────────────
const reiniciarSimulacion = () => {
  Tracker.reiniciar();
  mostrarPantalla('pantalla-bienvenida');
}; 