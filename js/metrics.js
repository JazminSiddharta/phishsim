// js/metrics.js
// Módulo de métricas y dashboard
// Renderiza resultados individuales, por departamento y organizacionales

const Metrics = {

  // Estado del drill-down
  deptoActual: null,
  empleadoActual: null,

  // ── Labels legibles para categorías ───────────────────────────────────
  labelsCategoria: {
    urgencia: '⚡ Urgencia',
    autoridad: '🏛️ Autoridad',
    recompensa: '🎁 Recompensa',
    contrasenas: '🔐 Contraseñas',
    redes_sociales: '📱 Redes Sociales',
    malware: '🦠 Malware',
  },

  coloresCategoria: {
    urgencia: '#e74c3c',
    autoridad: '#2980b9',
    recompensa: '#27ae60',
    contrasenas: '#8e44ad',
    redes_sociales: '#e67e22',
    malware: '#c0392b',
  },

  // ══════════════════════════════════════════════════════════════════════
  //  RESUMEN PERSONAL DEL EMPLEADO
  // ══════════════════════════════════════════════════════════════════════

  renderizarResumenPersonal(resultado) {
    const m = resultado.metricas;

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

    // Barras por categoría
    const cats = ['urgencia', 'autoridad', 'recompensa', 'contrasenas', 'redes_sociales', 'malware'];
    cats.forEach(cat => this.renderizarBarraCategoria(cat, m.porCategoria[cat]));

    // Mensaje de mejora
    document.getElementById('mensaje-mejora').textContent = this.mensajeMejora(m);

    // Animar barras
    setTimeout(() => this.animarBarras(m.porCategoria), 100);
  },

  renderizarBarraCategoria(categoria, datos) {
    const barraEl = document.getElementById(`barra-${categoria}`);
    const pctEl = document.getElementById(`pct-${categoria}`);
    const resultadoEl = document.getElementById(`resultado-${categoria}`);
    if (!barraEl || !datos) return;
    pctEl.textContent = `${datos.tasaClic}%`;
    resultadoEl.textContent = this.labelResultadoCategoria(datos.tasaClic);
  },

  animarBarras(porCategoria) {
    Object.entries(porCategoria).forEach(([cat, datos]) => {
      const barraEl = document.getElementById(`barra-${cat}`);
      if (barraEl && datos) barraEl.style.width = `${datos.tasaClic}%`;
    });
  },

  // ══════════════════════════════════════════════════════════════════════
  //  DASHBOARD ADMINISTRADOR — NIVEL 1
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

    // Semáforo organizacional global
    this.renderizarSemaforo(
      'semaforo-global',
      datos.tasaClicGlobal,
      'Estado General de la Organización'
    );

    // Insights
    this.renderizarInsights(datos);

    // Gráfica de barras por departamento
    this.renderizarGraficaDepartamentos(datos.porDepartamento, datos.tasaClicGlobal);

    // Tabla departamentos clickeable
    this.renderizarTablaDepartamentos(datos.porDepartamento);

    // Tabla participantes
    this.renderizarTablaParticipantes(datos.historial);

    // Botón exportar CSV
    this.renderizarBotonExportar();
  },

  // ── Semáforo ──────────────────────────────────────────────────────────
  renderizarSemaforo(idContenedor, tasaClic, titulo) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    let nivel, descripcion, claseActiva;
    if (tasaClic >= 60) {
      nivel = '🔴 Riesgo Alto';
      descripcion = `La tasa de clic del ${tasaClic}% indica que el equipo es altamente susceptible. Se requiere capacitación inmediata.`;
      claseActiva = 'activa-rojo';
    } else if (tasaClic >= 30) {
      nivel = '🟡 Riesgo Medio';
      descripcion = `La tasa de clic del ${tasaClic}% indica vulnerabilidades moderadas. Se recomienda reforzar la capacitación en áreas específicas.`;
      claseActiva = 'activa-amarillo';
    } else {
      nivel = '🟢 Riesgo Bajo';
      descripcion = `La tasa de clic del ${tasaClic}% indica buenos hábitos de seguridad. Mantener capacitaciones periódicas.`;
      claseActiva = 'activa-verde';
    }

    contenedor.innerHTML = `
      <div class="semaforo-contenedor">
        <div class="semaforo-luces">
          <div class="semaforo-luz ${claseActiva === 'activa-rojo' ? 'activa-rojo' : ''}"></div>
          <div class="semaforo-luz ${claseActiva === 'activa-amarillo' ? 'activa-amarillo' : ''}"></div>
          <div class="semaforo-luz ${claseActiva === 'activa-verde' ? 'activa-verde' : ''}"></div>
        </div>
        <div class="semaforo-info">
          <h3>${titulo}: ${nivel}</h3>
          <p>${descripcion}</p>
        </div>
      </div>
    `;
  },

  // ── Insights automáticos ──────────────────────────────────────────────
  renderizarInsights(datos) {
    const contenedor = document.getElementById('admin-insights');
    if (!contenedor) return;
    const insights = [];

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

    if (datos.catMasEfectiva) {
      insights.push({
        tipo: 'info',
        icono: '📊',
        texto: `Los ataques de tipo <strong>${this.labelsCategoria[datos.catMasEfectiva]}</strong> 
                son los más efectivos contra el equipo. 
                Enfoca la capacitación en esta área.`,
      });
    }

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

  // ── Gráfica de barras por departamento ───────────────────────────────
  renderizarGraficaDepartamentos(deptos, promedioGlobal) {
    const contenedor = document.getElementById('grafica-deptos');
    if (!contenedor) return;

    const max = Math.max(...deptos.map(d => d.tasaClic), 1);

    const filas = deptos
      .sort((a, b) => b.tasaClic - a.tasaClic)
      .map(d => {
        const color = d.tasaClic >= 60 ? '#e74c3c'
          : d.tasaClic >= 30 ? '#e67e22'
            : '#27ae60';
        const pct = Math.round((d.tasaClic / max) * 100);
        return `
          <div class="grafica-fila">
            <div class="grafica-label">${d.nombre}</div>
            <div class="grafica-barra-contenedor">
              <div class="grafica-barra-relleno" 
                   style="width:0%; background:${color}"
                   data-width="${pct}">
              </div>
            </div>
            <div class="grafica-valor">${d.tasaClic}%</div>
          </div>
        `;
      }).join('');

    contenedor.innerHTML = `
      <div class="grafica-barras">${filas}</div>
      <p style="font-size:12px; color:var(--gris); margin-top:8px">
        📏 Promedio global: <strong>${promedioGlobal}%</strong> de tasa de clic
      </p>
    `;

    // Animar barras
    setTimeout(() => {
      contenedor.querySelectorAll('.grafica-barra-relleno').forEach(el => {
        el.style.transition = 'width 1s ease';
        el.style.width = `${el.dataset.width}%`;
      });
    }, 100);
  },

  // ── Tabla de departamentos clickeable ─────────────────────────────────
  renderizarTablaDepartamentos(deptos) {
    const contenedor = document.getElementById('tabla-departamentos');
    if (!contenedor) return;

    const filas = deptos
      .sort((a, b) => b.tasaClic - a.tasaClic)
      .map(d => `
        <tr class="fila-clickeable" onclick="verDetalleDepartamento('${d.nombre}')">
          <td><strong>${d.nombre}</strong></td>
          <td>${d.participantes}</td>
          <td>${d.tasaClic}%</td>
          <td>${d.tasaDeteccion}%</td>
          <td>
            <span class="riesgo-badge ${d.nivelRiesgo}">
              ${d.nivelRiesgo.toUpperCase()}
            </span>
          </td>
          <td>Ver detalle →</td>
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
            <th></th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  },

  // ── Tabla de participantes individuales ───────────────────────────────
  renderizarTablaParticipantes(historial) {
    const contenedor = document.getElementById('tabla-participantes');
    if (!contenedor) return;

    const filas = historial
      .sort((a, b) => new Date(b.fechaFin) - new Date(a.fechaFin))
      .map(emp => `
        <tr class="fila-clickeable" 
            onclick="verDetalleEmpleado('${emp.id}', '${emp.departamento}')">
          <td><strong>${emp.nombre}</strong>
            <span class="num-empleado-badge">#${emp.numEmpleado || 'N/A'}</span>
          </td>
          <td>${emp.departamento}</td>
          <td>${emp.metricas.tasaClic}%</td>
          <td>${emp.metricas.tasaDeteccion}%</td>
          <td>
            <span class="riesgo-badge ${emp.metricas.nivelRiesgo}">
              ${emp.metricas.nivelRiesgo.toUpperCase()}
            </span>
          </td>
          <td>${this.formatearFecha(emp.fechaFin)}</td>
          <td>Ver →</td>
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
            <th></th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  },

  // ── Botón exportar CSV ────────────────────────────────────────────────
  renderizarBotonExportar() {
    const contenedor = document.getElementById('admin-acciones');
    if (!contenedor) return;
    contenedor.innerHTML = `
      <button class="btn-exportar" onclick="exportarCSV()">
        📥 Exportar datos a CSV
      </button>
    `;
  },

  // ══════════════════════════════════════════════════════════════════════
  //  DRILL-DOWN NIVEL 2 — DETALLE DEPARTAMENTO
  // ══════════════════════════════════════════════════════════════════════

  renderizarDetalleDepartamento(nombreDepto) {
    this.deptoActual = nombreDepto;
    const datos = Tracker.calcularMetricasOrganizacionales();
    const depto = datos.porDepartamento.find(d => d.nombre === nombreDepto);
    const histDepto = datos.historial.filter(e => e.departamento === nombreDepto);

    // Título
    document.getElementById('depto-titulo').textContent = nombreDepto;
    document.getElementById('depto-subtitulo').textContent =
      `${depto.participantes} participante(s) — Tasa de clic: ${depto.tasaClic}%`;

    // Comparativa vs empresa
    const diff = depto.tasaClic - datos.tasaClicGlobal;
    const compEl = document.getElementById('depto-comparativa');
    if (diff < -5) {
      compEl.className = 'comparativa-banner mejor';
      compEl.innerHTML = `<span class="comparativa-icono">✅</span>
        <span>Este departamento está <strong>${Math.abs(diff)}% por debajo</strong> 
        del promedio de la empresa (${datos.tasaClicGlobal}%). ¡Buen desempeño!</span>`;
    } else if (diff > 5) {
      compEl.className = 'comparativa-banner peor';
      compEl.innerHTML = `<span class="comparativa-icono">⚠️</span>
        <span>Este departamento está <strong>${diff}% por encima</strong> 
        del promedio de la empresa (${datos.tasaClicGlobal}%). 
        Se recomienda capacitación adicional.</span>`;
    } else {
      compEl.className = 'comparativa-banner igual';
      compEl.innerHTML = `<span class="comparativa-icono">📊</span>
        <span>Este departamento está <strong>en el promedio</strong> 
        de la empresa (${datos.tasaClicGlobal}%).</span>`;
    }

    // Semáforo del departamento
    document.getElementById('depto-semaforo').innerHTML = '';
    const semaforoId = 'semaforo-depto-inner';
    document.getElementById('depto-semaforo').innerHTML =
      `<div id="${semaforoId}"></div>`;
    this.renderizarSemaforo(semaforoId, depto.tasaClic, nombreDepto);

    // Métricas del departamento
    document.getElementById('depto-metricas').innerHTML = `
      <div class="admin-stat">
        <div class="admin-stat-valor">${depto.participantes}</div>
        <div class="admin-stat-label">Participantes</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat-valor">${depto.tasaClic}%</div>
        <div class="admin-stat-label">Tasa de Clic</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat-valor">${depto.tasaDeteccion}%</div>
        <div class="admin-stat-label">Tasa de Detección</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat-valor">${depto.nivelRiesgo.toUpperCase()}</div>
        <div class="admin-stat-label">Nivel de Riesgo</div>
      </div>
    `;

    // Categorías del departamento
    this.renderizarCategoriasDepto(histDepto);

    // Tabla de empleados del departamento
    this.renderizarTablaEmpleadosDepto(histDepto);
  },

  renderizarCategoriasDepto(histDepto) {
    const contenedor = document.getElementById('depto-categorias');
    if (!contenedor) return;

    const cats = ['urgencia', 'autoridad', 'recompensa', 'contrasenas', 'redes_sociales', 'malware'];
    const catLabels = {
      urgencia: '⚡ Urgencia', autoridad: '🏛️ Autoridad',
      recompensa: '🎁 Recompensa', contrasenas: '🔐 Contraseñas',
      redes_sociales: '📱 Redes Sociales', malware: '🦠 Malware',
    };

    const html = cats.map(cat => {
      const datos = histDepto
        .map(e => e.metricas.porCategoria[cat])
        .filter(Boolean);
      if (datos.length === 0) return '';

      const promClic = Math.round(
        datos.reduce((s, d) => s + d.tasaClic, 0) / datos.length
      );
      const color = this.coloresCategoria[cat];

      return `
        <div class="categoria-card" style="background:#f8f9fa; border-left: 4px solid ${color}">
          <div class="categoria-header">
            <span class="categoria-nombre">${catLabels[cat]}</span>
          </div>
          <div class="categoria-barra-contenedor">
            <div class="categoria-barra" 
                 style="background:${color}; width:0%"
                 data-width="${promClic}">
            </div>
          </div>
          <div class="categoria-stats">
            <span class="categoria-porcentaje">${promClic}%</span>
            <span class="categoria-resultado">${this.labelResultadoCategoria(promClic)}</span>
          </div>
        </div>
      `;
    }).join('');

    contenedor.innerHTML = html;

    setTimeout(() => {
      contenedor.querySelectorAll('.categoria-barra').forEach(el => {
        el.style.transition = 'width 1s ease';
        el.style.width = `${el.dataset.width}%`;
      });
    }, 100);
  },

  renderizarTablaEmpleadosDepto(histDepto) {
    const contenedor = document.getElementById('tabla-empleados-depto');
    if (!contenedor) return;

    const filas = histDepto
      .sort((a, b) => b.metricas.tasaClic - a.metricas.tasaClic)
      .map(emp => `
        <tr class="fila-clickeable"
            onclick="verDetalleEmpleado('${emp.id}', '${emp.departamento}')">
          <td><strong>${emp.nombre}</strong>
            <span class="num-empleado-badge">#${emp.numEmpleado || 'N/A'}</span>
          </td>
          <td>${emp.metricas.tasaClic}%</td>
          <td>${emp.metricas.tasaDeteccion}%</td>
          <td>
            <span class="riesgo-badge ${emp.metricas.nivelRiesgo}">
              ${emp.metricas.nivelRiesgo.toUpperCase()}
            </span>
          </td>
          <td>${this.formatearFecha(emp.fechaFin)}</td>
          <td>Ver →</td>
        </tr>
      `).join('');

    contenedor.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Tasa de Clic</th>
            <th>Tasa de Detección</th>
            <th>Riesgo</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  },

  // ══════════════════════════════════════════════════════════════════════
  //  DRILL-DOWN NIVEL 3 — DETALLE EMPLEADO
  // ══════════════════════════════════════════════════════════════════════

  renderizarDetalleEmpleado(idEmpleado) {
    const historial = Tracker.obtenerHistorial();
    const emp = historial.find(e => e.id === parseInt(idEmpleado));
    if (!emp) return;

    this.empleadoActual = emp;

    // Título
    document.getElementById('empleado-titulo').textContent = emp.nombre;
    document.getElementById('empleado-subtitulo').textContent =
      `#${emp.numEmpleado || 'N/A'} — ${emp.departamento} — ${this.formatearFecha(emp.fechaFin)}`;

    // Perfil de riesgo
    const { icono, titulo, descripcion } =
      this.datosPerfil(emp.metricas.nivelRiesgo, emp.metricas.tasaClic);
    const perfilEl = document.getElementById('empleado-perfil');
    perfilEl.className = `perfil-riesgo ${emp.metricas.nivelRiesgo}`;
    perfilEl.innerHTML = `
      <div class="riesgo-icono">${icono}</div>
      <div class="riesgo-info">
        <h2>${titulo}</h2>
        <p>${descripcion}</p>
      </div>
    `;

    // Métricas del empleado
    document.getElementById('empleado-metricas').innerHTML = `
      <div class="admin-stat">
        <div class="admin-stat-valor">${emp.metricas.tasaClic}%</div>
        <div class="admin-stat-label">Tasa de Clic</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat-valor">${emp.metricas.tasaDeteccion}%</div>
        <div class="admin-stat-label">Tasa de Detección</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat-valor">${emp.metricas.tasaIgnorar}%</div>
        <div class="admin-stat-label">Tasa de Ignorar</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat-valor">${emp.decisiones.length}</div>
        <div class="admin-stat-label">Ejercicios completados</div>
      </div>
    `;

    // Tabla de decisiones
    this.renderizarDecisionesEmpleado(emp);

    // Recomendaciones
    this.renderizarRecomendacionesEmpleado(emp);
  },

  renderizarDecisionesEmpleado(emp) {
    const contenedor = document.getElementById('tabla-decisiones-empleado');
    if (!contenedor) return;

    const iconosDecision = { clic: '🖱️', ignorar: '🙈', reportar: '🚨' };
    const clasesDecision = { clic: 'decision-clic', ignorar: 'decision-ignorar', reportar: 'decision-correcta' };

    const filas = emp.decisiones.map((d, i) => {
      const escenario = PHISHING_SCENARIOS.find(e => e.id === d.escenarioId);
      return `
        <tr class="${clasesDecision[d.decision]}">
          <td>${i + 1}</td>
          <td>${escenario ? escenario.asunto : '—'}</td>
          <td>${this.labelsCategoria[d.categoria] || d.categoria}</td>
          <td>${d.nivel}</td>
          <td>
            <span class="decision-badge ${d.decision}">
              ${iconosDecision[d.decision]} ${d.decision.toUpperCase()}
            </span>
          </td>
          <td>${d.correcta ? '✅' : '❌'}</td>
        </tr>
      `;
    }).join('');

    contenedor.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Correo</th>
            <th>Categoría</th>
            <th>Nivel</th>
            <th>Decisión</th>
            <th>Correcto</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  },

  renderizarRecomendacionesEmpleado(emp) {
    const contenedor = document.getElementById('empleado-recomendaciones');
    if (!contenedor) return;

    const recomendaciones = [];
    const cats = emp.metricas.porCategoria;

    Object.entries(cats).forEach(([cat, datos]) => {
      if (datos && datos.tasaClic > 50) {
        const msgs = {
          urgencia: 'Practicar la pausa ante correos urgentes — nunca actuar sin verificar.',
          autoridad: 'Verificar siempre por un canal alternativo cuando alguien con autoridad pide algo inusual.',
          recompensa: 'Recordar que ofertas demasiado buenas para ser verdad generalmente no lo son.',
          contrasenas: 'Usar un gestor de contraseñas y activar autenticación de dos factores.',
          redes_sociales: 'Revisar la configuración de privacidad en todas sus redes sociales.',
          malware: 'Nunca abrir archivos adjuntos de remitentes desconocidos.',
        };
        if (msgs[cat]) recomendaciones.push(msgs[cat]);
      }
    });

    if (recomendaciones.length === 0) {
      recomendaciones.push('Mantener los buenos hábitos de seguridad digital actuales.');
      recomendaciones.push('Compartir buenas prácticas con otros compañeros del equipo.');
    }

    contenedor.innerHTML = `
      <h3>💡 Recomendaciones Personalizadas</h3>
      <ul>
        ${recomendaciones.map(r => `<li>${r}</li>`).join('')}
      </ul>
    `;
  },

  // ══════════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════════

  datosPerfil(nivel, tasaClic) {
    switch (nivel) {
      case 'alto':
        return {
          icono: '🔴',
          titulo: 'Perfil de Riesgo: ALTO',
          descripcion: `Hizo clic en el ${tasaClic}% de los correos maliciosos. Requiere capacitación urgente.`,
        };
      case 'medio':
        return {
          icono: '🟡',
          titulo: 'Perfil de Riesgo: MEDIO',
          descripcion: `Hizo clic en el ${tasaClic}% de los correos maliciosos. Hay áreas de mejora específicas.`,
        };
      default:
        return {
          icono: '🟢',
          titulo: 'Perfil de Riesgo: BAJO',
          descripcion: `Hizo clic en el ${tasaClic}% de los correos maliciosos. Buenos hábitos de seguridad.`,
        };
    }
  },

  mensajeMejora(m) {
    if (!m.catMasVulnerable) return '¡Excelente desempeño! Mantén siempre esta actitud de precaución.';
    const mensajes = {
      urgencia: 'Eres más susceptible a ataques de urgencia. Cuando un correo te presione a actuar rápido, detente y verifica.',
      autoridad: 'Los ataques de autoridad son tu punto débil. Siempre verifica por otro canal antes de actuar.',
      recompensa: 'Las ofertas atractivas te generan vulnerabilidad. Si algo parece demasiado bueno, probablemente lo es.',
      contrasenas: 'Refuerza tus conocimientos sobre contraseñas seguras. Es tu primera línea de defensa.',
      redes_sociales: 'Cuida la información que compartes en redes. Los atacantes la usan para personalizar ataques.',
      malware: 'Verifica siempre el origen antes de abrir archivos o enlaces.',
    };
    return mensajes[m.catMasVulnerable] || 'Continúa practicando para mejorar tu detección.';
  },

  labelResultadoCategoria(tasaClic) {
    if (tasaClic === 0) return '✅ Sin vulnerabilidad';
    if (tasaClic <= 33) return '🟡 Vulnerabilidad baja';
    if (tasaClic <= 66) return '🟠 Vulnerabilidad media';
    return '🔴 Alta vulnerabilidad';
  },

  formatearFecha(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  },
};

console.log('✅ Metrics cargado correctamente');