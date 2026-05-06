// js/org.js
// Módulo de modo organizacional
// Permite que múltiples usuarios hagan la simulación
// y genera un dashboard grupal con perfil de vulnerabilidad del equipo

const OrgMode = (() => {

  const STORAGE_KEY = 'phishsim_org_sesiones';

  // ── Guardar resultado de un participante ───────────────
  const guardarParticipante = (nombre) => {
    try {
      const todas      = Tracker.obtenerTodas();
      const phishing   = todas.filter(d => d.esPhishing);
      const legitimos  = todas.filter(d => !d.esPhishing);
      const pct        = (p, t) => t === 0 ? 0 : Math.round((p / t) * 100);

      const participante = {
        nombre,
        fecha:       new Date().toLocaleDateString('es-MX'),
        timestamp:   Date.now(),
        total:       todas.length,
        caidas:      pct(Tracker.contarResultado('caida'), phishing.length),
        deteccion:   pct(Tracker.contarResultado('verdadero_positivo'), phishing.length),
        falsoPos:    pct(Tracker.contarResultado('falso_positivo'), legitimos.length),
        promedio:    Tracker.tiempoPromedio(),
        impulsivas:  Tracker.caídasImpulsivas(),
        porCategoria: {
          urgencia:   pct(
            Tracker.porCategoria('urgencia').filter(d => d.tipodecision === 'caida').length,
            Tracker.porCategoria('urgencia').filter(d => d.esPhishing).length
          ),
          autoridad:  pct(
            Tracker.porCategoria('autoridad').filter(d => d.tipodecision === 'caida').length,
            Tracker.porCategoria('autoridad').filter(d => d.esPhishing).length
          ),
          recompensa: pct(
            Tracker.porCategoria('recompensa').filter(d => d.tipodecision === 'caida').length,
            Tracker.porCategoria('recompensa').filter(d => d.esPhishing).length
          )
        }
      };

      const sesiones = cargarSesiones();
      sesiones.push(participante);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sesiones));
      return participante;
    } catch (e) {
      console.warn('OrgMode: no se pudo guardar participante', e);
      return null;
    }
  };

  // ── Cargar todas las sesiones del equipo ───────────────
  const cargarSesiones = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  };

  // ── Limpiar sesiones del equipo ────────────────────────
  const limpiarSesiones = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  };

  // ── Calcular promedio de equipo ────────────────────────
  const promedioEquipo = (sesiones, campo) => {
    if (sesiones.length === 0) return 0;
    return Math.round(
      sesiones.reduce((acc, s) => acc + (s[campo] || 0), 0) / sesiones.length
    );
  };

  // ── Renderizar dashboard organizacional ────────────────
  const renderizar = () => {
    const sesiones   = cargarSesiones();
    const contenedor = document.getElementById('org-dashboard');
    if (!contenedor) return;

    if (sesiones.length === 0) {
      contenedor.innerHTML = `
        <div style="
          background: var(--gris-claro);
          border-radius: var(--radio);
          padding: 30px;
          text-align: center;
          color: var(--gris);
          font-size: 14px;
        ">
          Aún no hay participantes registrados.<br>
          Completa la simulación y registra tu nombre para aparecer aquí.
        </div>`;
      return;
    }

    // Métricas globales del equipo
    const avgCaidas    = promedioEquipo(sesiones, 'caidas');
    const avgDeteccion = promedioEquipo(sesiones, 'deteccion');
    const avgPromedio  = promedioEquipo(sesiones, 'promedio');
    const avgUrgencia  = Math.round(sesiones.reduce((a, s) => a + s.porCategoria.urgencia, 0)  / sesiones.length);
    const avgAutoridad = Math.round(sesiones.reduce((a, s) => a + s.porCategoria.autoridad, 0) / sesiones.length);
    const avgRecompensa= Math.round(sesiones.reduce((a, s) => a + s.porCategoria.recompensa, 0)/ sesiones.length);

    // Vulnerabilidad más alta del equipo
    const catMasVulnerable = [
      { nombre: 'Urgencia',   val: avgUrgencia   },
      { nombre: 'Autoridad',  val: avgAutoridad  },
      { nombre: 'Recompensa', val: avgRecompensa }
    ].sort((a, b) => b.val - a.val)[0];

    // Tabla de participantes
    const filas = sesiones
      .slice()
      .sort((a, b) => a.caidas - b.caidas)
      .map((s, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${s.nombre}</strong></td>
          <td>${s.fecha}</td>
          <td style="color:${s.caidas <= 20 ? '#27ae60' : s.caidas <= 50 ? '#e67e22' : '#e74c3c'};
                     font-weight:700">${s.caidas}%</td>
          <td style="color:#27ae60; font-weight:700">${s.deteccion}%</td>
          <td>${s.promedio}s</td>
          <td>${s.impulsivas}</td>
        </tr>
      `).join('');

    contenedor.innerHTML = `

      <!-- Resumen del equipo -->
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
      ">
        <div style="background:var(--urgencia-claro); border-radius:var(--radio);
                    padding:20px; text-align:center; border:2px solid var(--urgencia)">
          <div style="font-size:32px; font-weight:800; color:var(--urgencia)">${avgCaidas}%</div>
          <div style="font-size:13px; color:#555; font-weight:600">Tasa de Caída Promedio</div>
          <div style="font-size:12px; color:var(--gris)">${sesiones.length} participante(s)</div>
        </div>
        <div style="background:var(--recompensa-claro); border-radius:var(--radio);
                    padding:20px; text-align:center; border:2px solid var(--recompensa)">
          <div style="font-size:32px; font-weight:800; color:var(--recompensa)">${avgDeteccion}%</div>
          <div style="font-size:13px; color:#555; font-weight:600">Tasa de Detección Promedio</div>
        </div>
        <div style="background:var(--autoridad-claro); border-radius:var(--radio);
                    padding:20px; text-align:center; border:2px solid var(--autoridad)">
          <div style="font-size:32px; font-weight:800; color:var(--autoridad)">${avgPromedio}s</div>
          <div style="font-size:13px; color:#555; font-weight:600">Tiempo Promedio de Decisión</div>
        </div>
      </div>

      <!-- Vulnerabilidad más alta -->
      <div style="
        background: #fdecea;
        border: 2px solid var(--urgencia);
        border-radius: var(--radio);
        padding: 16px 20px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 14px;
      ">
        <span style="font-size:32px">🎯</span>
        <div>
          <div style="font-weight:700; color:var(--urgencia); font-size:15px">
            Vector más vulnerable del equipo: ${catMasVulnerable.nombre}
          </div>
          <div style="font-size:13px; color:#555">
            El equipo cae en ataques de ${catMasVulnerable.nombre.toLowerCase()} 
            un ${catMasVulnerable.val}% de las veces. 
            Prioriza capacitación en esta categoría.
          </div>
        </div>
      </div>

      <!-- Susceptibilidad por categoría -->
      <div style="margin-bottom:24px;">
        <div style="font-size:15px; font-weight:700; color:var(--oscuro);
                    margin-bottom:12px;">Susceptibilidad promedio por categoría</div>
        ${[
          { nombre: 'Urgencia',   val: avgUrgencia,   color: 'var(--urgencia)',   emoji: '⚡' },
          { nombre: 'Autoridad',  val: avgAutoridad,  color: 'var(--autoridad)',  emoji: '🏛️' },
          { nombre: 'Recompensa', val: avgRecompensa, color: 'var(--recompensa)', emoji: '🎁' }
        ].map(cat => `
          <div style="margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between;
                        font-size:13px; margin-bottom:4px;">
              <span>${cat.emoji} ${cat.nombre}</span>
              <strong style="color:${cat.color}">${cat.val}%</strong>
            </div>
            <div style="background:#eee; border-radius:50px; height:8px;">
              <div style="background:${cat.color}; width:${cat.val}%;
                          height:100%; border-radius:50px; transition:width 1s;"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Tabla de participantes -->
      <div style="font-size:15px; font-weight:700; color:var(--oscuro); margin-bottom:12px;">
        Ranking de participantes
      </div>
      <div style="overflow-x:auto; margin-bottom:16px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="background:var(--oscuro); color:white;">
              <th style="padding:10px 12px; text-align:left">#</th>
              <th style="padding:10px 12px; text-align:left">Nombre</th>
              <th style="padding:10px 12px; text-align:left">Fecha</th>
              <th style="padding:10px 12px; text-align:left">Caídas</th>
              <th style="padding:10px 12px; text-align:left">Detección</th>
              <th style="padding:10px 12px; text-align:left">T. Prom.</th>
              <th style="padding:10px 12px; text-align:left">Impulsivas</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>

      <!-- Botón limpiar -->
      <button onclick="OrgMode.limpiarYRenderizar()"
        style="background:none; border:1px solid #ddd; color:var(--gris);
               padding:8px 16px; border-radius:8px; cursor:pointer; font-size:13px;">
        🗑️ Limpiar participantes
      </button>
    `;
  };

  const limpiarYRenderizar = () => {
    if (confirm('¿Segura que quieres borrar todos los participantes del equipo?')) {
      limpiarSesiones();
      renderizar();
    }
  };

  return {
    guardarParticipante,
    cargarSesiones,
    limpiarSesiones,
    limpiarYRenderizar,
    renderizar
  };

})();