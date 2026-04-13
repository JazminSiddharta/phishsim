// js/metrics.js
// Módulo de cálculo y renderizado del dashboard
// Procesa las decisiones del tracker y genera el perfil de vulnerabilidad

const Metrics = (() => {

  // Calcula porcentaje redondeado
  const pct = (parte, total) =>
    total === 0 ? 0 : Math.round((parte / total) * 100);

  // Genera el perfil de riesgo según tasa de clic
  const calcularPerfil = (tasaClic) => {
    if (tasaClic === 0) return {
      nivel: '🛡️ Riesgo Bajo',
      clase: 'bajo',
      icono: '🛡️',
      descripcion: 'Excelente. No caíste en ningún intento de phishing. Tienes una buena cultura de seguridad.'
    };
    if (tasaClic <= 33) return {
      nivel: '⚠️ Riesgo Medio',
      clase: 'medio',
      icono: '⚠️',
      descripcion: 'Detectaste la mayoría de los ataques, pero algunos lograron engañarte. Revisa las señales de alerta.'
    };
    return {
      nivel: '🚨 Riesgo Alto',
      clase: 'alto',
      icono: '🚨',
      descripcion: 'Varios ataques lograron engañarte. Es importante reforzar tus hábitos de verificación antes de hacer clic.'
    };
  };

  // Renderiza el dashboard completo con los datos del tracker
  const renderizar = () => {
    const todas      = Tracker.obtenerTodas();
    const total      = todas.length;
    const clics      = Tracker.contarPor('clic');
    const reportados = Tracker.contarPor('reportar');
    const ignorados  = Tracker.contarPor('ignorar');

    // Métricas globales
    const tasaClic = pct(clics, total);
    document.getElementById('tasa-clic').textContent      = `${tasaClic}%`;
    document.getElementById('tasa-deteccion').textContent = `${pct(reportados, total)}%`;
    document.getElementById('tasa-ignorar').textContent   = `${pct(ignorados, total)}%`;

    // Perfil de riesgo
    const perfil = calcularPerfil(tasaClic);
    const perfilEl = document.getElementById('perfil-riesgo');
    perfilEl.className = `perfil-riesgo ${perfil.clase}`;
    document.getElementById('riesgo-icono').textContent       = perfil.icono;
    document.getElementById('riesgo-nivel').textContent       = perfil.nivel;
    document.getElementById('riesgo-descripcion').textContent = perfil.descripcion;

    // Métricas por categoría
    ['urgencia', 'autoridad', 'recompensa'].forEach(cat => {
      const catDecisiones = Tracker.porCategoria(cat);
      const catClics      = catDecisiones.filter(d => d.decision === 'clic').length;
      const catTotal      = catDecisiones.length;
      const catPct        = pct(catClics, catTotal);

      document.getElementById(`barra-${cat}`).style.width  = `${catPct}%`;
      document.getElementById(`pct-${cat}`).textContent    = `${catPct}%`;
      document.getElementById(`resultado-${cat}`).textContent =
        `${catClics} de ${catTotal} correos lograron engañarte`;
    });

    // Tabla de decisiones
    const iconos = { clic: '❌', ignorar: '😐', reportar: '✅' };
    const filas = todas.map(d => `
      <tr>
        <td>${d.id}</td>
        <td>${d.categoria}</td>
        <td>${d.nivel}</td>
        <td>${d.asunto.substring(0, 40)}...</td>
        <td>${iconos[d.decision]} ${d.decision}</td>
      </tr>
    `).join('');

    document.getElementById('tabla-decisiones').innerHTML = `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Categoría</th>
            <th>Nivel</th>
            <th>Asunto</th>
            <th>Tu decisión</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  };

  return { renderizar };

})();