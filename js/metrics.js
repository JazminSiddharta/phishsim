// js/metrics.js
// Módulo de cálculo y renderizado del dashboard
// Procesa decisiones, tiempos e impulsividad

const Metrics = (() => {

  // Calcula porcentaje redondeado
  const pct = (parte, total) =>
    total === 0 ? 0 : Math.round((parte / total) * 100);

  // Perfil de riesgo expandido
  const calcularPerfil = (tasaCaida, tasaFalsoPositivo) => {
    if (tasaCaida === 0 && tasaFalsoPositivo === 0) return {
      nivel: '🛡️ Perfil Experto',
      clase: 'bajo',
      icono: '🛡️',
      descripcion: 'Excelente. Detectaste todos los ataques y no confundiste ningún correo legítimo. Tienes una cultura de seguridad sólida.'
    };
    if (tasaCaida === 0 && tasaFalsoPositivo > 0) return {
      nivel: '🔍 Perfil Precavido',
      clase: 'bajo',
      icono: '🔍',
      descripcion: 'No caíste en ningún phishing, aunque fuiste demasiado precavido con correos legítimos. Aprende a distinguir las señales de confianza.'
    };
    if (tasaCaida <= 33) return {
      nivel: '⚠️ Riesgo Medio',
      clase: 'medio',
      icono: '⚠️',
      descripcion: 'Detectaste la mayoría de los ataques, pero algunos lograron engañarte. Revisa las señales de alerta de cada categoría.'
    };
    return {
      nivel: '🚨 Riesgo Alto',
      clase: 'alto',
      icono: '🚨',
      descripcion: 'Varios ataques lograron engañarte. Es importante reforzar tus hábitos de verificación antes de hacer clic en cualquier enlace.'
    };
  };

  // Etiqueta de velocidad
  const etiquetaVelocidad = (segundos) => {
    if (segundos <= 5) return { label: '⚡ Impulsiva', color: '#e74c3c' };
    if (segundos <= 15) return { label: '👁️ Normal', color: '#e67e22' };
    return { label: '🧠 Reflexiva', color: '#27ae60' };
  };

  // Renderiza el dashboard completo
  const renderizar = () => {
    const todas = Tracker.obtenerTodas();
    const total = todas.length;
    const soloPhishing = todas.filter(d => d.esPhishing);
    const soloLegitimos = todas.filter(d => !d.esPhishing);

    const caidas = Tracker.contarResultado('caida');
    const verdaderos = Tracker.contarResultado('verdadero_positivo');
    const falsos = Tracker.contarResultado('falso_positivo');
    const tasaCaida = pct(caidas, soloPhishing.length);
    const tasaDeteccion = pct(verdaderos, soloPhishing.length);
    const tasaFalsoPos = pct(falsos, soloLegitimos.length);
    const promedio = Tracker.tiempoPromedio();
    const impulsivas = Tracker.caídasImpulsivas();

    // ── Métricas globales ──────────────────────────────────
    document.getElementById('tasa-clic').textContent = `${tasaCaida}%`;
    document.getElementById('tasa-deteccion').textContent = `${tasaDeteccion}%`;
    document.getElementById('tasa-ignorar').textContent = `${tasaFalsoPos}%`;

    // Actualizar label de falsos positivos
    const cardFalsos = document.getElementById('tasa-ignorar').closest('.metrica-card');
    cardFalsos.querySelector('.metrica-label').textContent = 'Falsos Positivos';
    cardFalsos.querySelector('.metrica-desc').textContent =
      'Correos legítimos reportados como phishing';

    // ── Métricas de tiempo ─────────────────────────────────
    const vel = etiquetaVelocidad(promedio);
    document.getElementById('tiempo-promedio').textContent = `${promedio}s`;
    document.getElementById('velocidad-label').textContent = vel.label;
    document.getElementById('velocidad-label').style.color = vel.color;
    document.getElementById('caidas-impulsivas').textContent =
      `${impulsivas} caída${impulsivas !== 1 ? 's' : ''} por decisión impulsiva`;

    // ── Perfil de riesgo ───────────────────────────────────
    const perfil = calcularPerfil(tasaCaida, tasaFalsoPos);
    const perfilEl = document.getElementById('perfil-riesgo');
    perfilEl.className = `perfil-riesgo ${perfil.clase}`;
    document.getElementById('riesgo-icono').textContent = perfil.icono;
    document.getElementById('riesgo-nivel').textContent = perfil.nivel;
    document.getElementById('riesgo-descripcion').textContent = perfil.descripcion;

    // ── Métricas por categoría ─────────────────────────────
    ['urgencia', 'autoridad', 'recompensa'].forEach(cat => {
      const catDec = Tracker.porCategoria(cat).filter(d => d.esPhishing);
      const catCaidas = catDec.filter(d => d.tipodecision === 'caida').length;
      const catTotal = catDec.length;
      const catPct = pct(catCaidas, catTotal);
      const catTiempo = catDec.length > 0
        ? Math.round(catDec.reduce((a, d) => a + d.tiempo, 0) / catDec.length)
        : 0;

      document.getElementById(`barra-${cat}`).style.width = `${catPct}%`;
      document.getElementById(`pct-${cat}`).textContent = `${catPct}%`;
      document.getElementById(`resultado-${cat}`).textContent =
        `${catCaidas} de ${catTotal} correos lograron engañarte · promedio ${catTiempo}s`;
    });

    // ── Tabla de decisiones ────────────────────────────────
    const iconos = {
      caida: '❌ Hiciste clic',
      verdadero_positivo: '✅ Reportaste',
      ignorado: '😐 Ignoraste',
      verdadero_negativo: '✅ Identificaste',
      falso_positivo: '⚠️ Falso positivo',
      ignorado_legitimo: '😐 Ignoraste'
    };

    const filas = todas.map(d => {
      const vel = etiquetaVelocidad(d.tiempo);
      return `
        <tr>
          <td>${d.id}</td>
          <td>${d.esPhishing ? '🎣 Phishing' : '📧 Legítimo'}</td>
          <td>${d.categoria}</td>
          <td>${d.nivel}</td>
          <td>${d.asunto.substring(0, 35)}...</td>
          <td>${iconos[d.tipodecision] || d.decision}</td>
          <td style="color:${vel.color};font-weight:600">${d.tiempo}s ${vel.label}</td>
        </tr>
      `;
    }).join('');

    document.getElementById('tabla-decisiones').innerHTML = `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Nivel</th>
            <th>Asunto</th>
            <th>Decisión</th>
            <th>Tiempo</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  };

  return { renderizar };

})();