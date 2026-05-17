// js/metrics.js
// Módulo de métricas y dashboard
// Renderiza resultados individuales y organizacionales

const Metrics = {

  // ── Labels legibles para categorías ───────────────────────────────────
  labelsCategoria: {
    urgencia: '⚡ Urgencia',
    autoridad: '🏛️ Autoridad',
    recompensa: '🎁 Recompensa',
    contrasenas: '🔐 Contraseñas',
    redes_sociales: '📱 Redes Sociales',
    malware: '🦠 Malware',
  },

  // ── Renderizar resumen personal del empleado ──────────────────────────
  renderizarResumenPersonal(resultado) {
    const m = resultado.metricas;

    // Encabezado
    document.getElementById('resumen-nombre-empleado').textContent =
      `${resultado.nombre} — ${resultado.departamento}`;

    // Perfil de riesgo
    const perfilEl = document.getElementById('perfil-riesgo');
    perfilEl.className = `perfil-riesgo ${m.nivelRiesgo}`;

    const { icono, titulo, descripcion } = this.datosPerfil(m.nivelRiesgo, m.tasaClic);
    document.getElementById('riesgo-icono').textContent = icono;
    document.getElementById('riesgo-nivel').textContent = titulo;
    document.getElementById('riesgo-descripcion').textContent = descripcion;

    // Métricas globales
    document.getElementById('tasa-clic').textContent = `${m.tasaClic}%`;
    document.getElementById('tasa-deteccion').textContent = `${m.tasaDeteccion}%`;
    document.getElementById('tasa-ignorar').textContent = `${m.tasaIgnorar}%`;

    // Métricas por categoría — solo las que existen en los escenarios
    this.renderizarBarraCategoria(
      'urgencia', m.porCategoria.urgencia
    );
    this.renderizarBarraCategoria(
      'autoridad', m.porCategoria.autoridad
    );
    this.renderizarBarraCategoria(
      'recompensa', m.porCategoria.recompensa
    );
    this.renderizarBarraCategoria(
      'contrasenas', m.porCategoria.contrasenas
    );
    this.renderizarBarraCategoria(
      'redes_sociales', m.porCategoria.redes_sociales
    );
    this.renderizarBarraCategoria(
      'malware', m.porCategoria.malware
    );

    // Mensaje de mejora principal
    const mejora = this.mensajeMejora(m);
    document.getElementById('mensaje-mejora').textContent = mejora;

    // Animar barras después de un frame
    setTimeout(() => this.animarBarras(m.porCategoria), 100);
  },

  // ── Renderizar una barra de categoría individual ──────────────────────
  renderizarBarraCategoria(categoria, datos) {
    const barraEl = document.getElementById(`barra-${categoria}`);
    const pctEl = document.getElementById(`pct-${categoria}`);
    const resultadoEl = document.getElementById(`resultado-${categoria}`);

    if (!barraEl || !datos) return;

    const pct = datos.tasaClic;
    pctEl.textContent = `${pct}%`;
    resultadoEl.textContent = this.labelResultadoCategoria(pct);
  },

  // ── Animar barras de progreso ──────────────────────────────────────────
  animarBarras(porCategoria) {
    Object.entries(porCategoria).forEach(([cat, datos]) => {
      const barraEl = document.getElementById(`barra-${cat}`);
      if (barraEl && datos) {
        barraEl.style.width = `${datos.tasaClic}%`;
      }
    });
  },

  // ── Mensaje personalizado de área de mejora ───────────────────────────
  mensajeMejora(m) {
    if (!m.catMasVulnerable) {
      return '¡Excelente desempeño! Mantén siempre esta actitud de precaución ante correos sospechosos.';
    }

    const mensajes = {
      urgencia:
        'Eres más susceptible a ataques que generan urgencia o miedo. Cuando un correo te presione a actuar rápido, detente y verifica antes de hacer clic.',
      autoridad:
        'Los ataques que suplantan figuras de autoridad (TI, directivos, gobierno) son tu punto débil. Recuerda: siempre verifica por otro canal antes de actuar.',
      recompensa:
        'Las ofertas atractivas o premios inesperados te generan vulnerabilidad. Si algo parece demasiado bueno para ser verdad, probablemente lo es.',
      contrasenas:
        'Necesitas reforzar tus conocimientos sobre contraseñas seguras. Una contraseña fuerte es tu primera línea de defensa.',
      redes_sociales:
        'Compartes demasiada información en redes sociales sin considerar los riesgos. Los atacantes usan esa información para personalizar sus ataques.',
      malware:
        'Tienes tendencia a abrir archivos o enlaces sin verificar su origen. Siempre confirma la fuente antes de descargar o ejecutar cualquier archivo.',
    };

    return mensajes[m.catMasVulnerable] ||
      'Continúa practicando para mejorar tu capacidad de detección.';
  },

  // ── Datos del perfil de riesgo ────────────────────────────────────────
  datosPerfil(nivel, tasaClic) {
    switch (nivel) {
      case 'alto':
        return {
          icono: '🔴',
          titulo: 'Perfil de Riesgo: ALTO',
          descripcion: `Hiciste clic en el ${tasaClic}% de los correos maliciosos. Necesitas reforzar tus hábitos de seguridad digital con urgencia.`,
        };
      case 'medio':
        return {
          icono: '🟡',
          titulo: 'Perfil de Riesgo: MEDIO',
          descripcion: `Hiciste clic en el ${tasaClic}% de los correos maliciosos. Vas bien, pero hay áreas específicas donde puedes mejorar.`,
        };
      case 'bajo':
        return {
          icono: '🟢',
          titulo: 'Perfil de Riesgo: BAJO',
          descripcion: `Hiciste clic en el ${tasaClic}% de los correos maliciosos. Tienes buenos hábitos de seguridad digital. ¡Sigue así!`,
        };
      default:
        return {
          icono: '⚪', titulo: 'Perfil calculado', descripcion: ''
        };
    }
  },

  // ── Label de resultado por categoría ─────────────────────────────────
  labelResultadoCategoria(tasaClic) {
    if (tasaClic === 0) return '✅ Sin vulnerabilidad detectada';
    if (tasaClic <= 33) return '🟡 Vulnerabilidad baja';
    if (tasaClic <= 66) return '🟠 Vulnerabilidad media';
    return '🔴 Alta vulnerabilidad';
  },

  // ══════════════════════════════════════════════════════════════════════
  //  DASHBOARD ADMINISTRADOR
  // ══════════════════════════════════════════════════════════════════════

  renderizarDashboardAdmin() {
    const datos = Tracker.calcularMetricasOrganizacionales();

    if (!datos || datos.total === 0) {
      document.getElementById('sin-datos').style.display = 'block';
      return;
    }

    document.getElementById('sin-datos').style.display = 'none';

    // Stats generales
    document.getElementById('total-participantes').textContent = datos.total;
    document.getElementById('admin-tasa-clic').textContent = `${datos.tasaClicGlobal}%`;
    document.getElementById('admin-tasa-deteccion').textContent = `${datos.tasaDeteccionGlobal}%`;
    document.getElementById('area-vulnerable').textContent =
      datos.areaMasVulnerable?.nombre || '—';

    // Insights automáticos
    this.renderizarInsights(datos);

    // Tabla por departamento
    this.renderizarTablaDepartamentos(datos.porDepartamento);

    // Tabla de participantes individuales
    this.renderizarTablaParticipantes(datos.historial);
  },

  // ── Insights automáticos ──────────────────────────────────────────────
  renderizarInsights(datos) {
    const contenedor = document.getElementById('admin-insights');
    const insights = [];

    // Insight 1: área más vulnerable
    if (datos.areaMasVulnerable) {
      insights.push({
        tipo: 'alerta',
        icono: '🚨',
        texto: `El departamento de <strong>${datos.areaMasVulnerable.nombre}</strong> 
                 es el más vulnerable con una tasa de clic del 
                 <strong>${datos.areaMasVulnerable.tasaClic}%</strong>. 
                 Se recomienda capacitación adicional.`,
      });
    }

    // Insight 2: categoría de ataque más efectiva
    if (datos.catMasEfectiva) {
      insights.push({
        tipo: 'info',
        icono: '📊',
        texto: `Los ataques de tipo <strong>${this.labelsCategoria[datos.catMasEfectiva]}</strong> 
                 son los más efectivos contra el equipo. 
                 Enfoca la capacitación en esta área.`,
      });
    }

    // Insight 3: tasa de detección global
    if (datos.tasaDeteccionGlobal >= 60) {
      insights.push({
        tipo: 'positivo',
        icono: '✅',
        texto: `El equipo tiene una tasa de detección del 
                 <strong>${datos.tasaDeteccionGlobal}%</strong>. 
                 El nivel de conciencia de seguridad es bueno.`,
      });
    } else {
      insights.push({
        tipo: 'alerta',
        icono: '⚠️',
        texto: `La tasa de detección global es del 
                 <strong>${datos.tasaDeteccionGlobal}%</strong>. 
                 Se recomienda reforzar la capacitación en toda la organización.`,
      });
    }

    contenedor.innerHTML = insights.map(i => `
      <div class="insight-card ${i.tipo}">
        <span class="insight-icono">${i.icono}</span>
        <span>${i.texto}</span>
      </div>
    `).join('');
  },

  // ── Tabla de resultados por departamento ──────────────────────────────
  renderizarTablaDepartamentos(deptos) {
    const contenedor = document.getElementById('tabla-departamentos');

    if (deptos.length === 0) {
      contenedor.innerHTML = '<p style="color:var(--gris)">Sin datos.</p>';
      return;
    }

    const filas = deptos
      .sort((a, b) => b.tasaClic - a.tasaClic)
      .map(d => `
        <tr>
          <td><strong>${d.nombre}</strong></td>
          <td>${d.participantes}</td>
          <td>${d.tasaClic}%</td>
          <td>${d.tasaDeteccion}%</td>
          <td>
            <span class="riesgo-badge ${d.nivelRiesgo}">
              ${d.nivelRiesgo.toUpperCase()}
            </span>
          </td>
        </tr>
      `).join('');

    contenedor.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Departamento</th>
            <th>Participantes</th>
            <th>Tasa de Clic</th>
            <th>Tasa de Detección</th>
            <th>Nivel de Riesgo</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  },

  // ── Tabla de participantes individuales ───────────────────────────────
  renderizarTablaParticipantes(historial) {
    const contenedor = document.getElementById('tabla-participantes');

    const filas = historial
      .sort((a, b) => new Date(b.fechaFin) - new Date(a.fechaFin))
      .map(emp => `
        <tr>
          <td><strong>${emp.nombre}</strong></td>
          <td>${emp.departamento}</td>
          <td>${emp.metricas.tasaClic}%</td>
          <td>${emp.metricas.tasaDeteccion}%</td>
          <td>
            <span class="riesgo-badge ${emp.metricas.nivelRiesgo}">
              ${emp.metricas.nivelRiesgo.toUpperCase()}
            </span>
          </td>
          <td>${this.formatearFecha(emp.fechaFin)}</td>
        </tr>
      `).join('');

    contenedor.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Tasa de Clic</th>
            <th>Tasa de Detección</th>
            <th>Riesgo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  },

  // ── Formatear fecha legible ────────────────────────────────────────────
  formatearFecha(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

console.log('✅ Metrics cargado correctamente');