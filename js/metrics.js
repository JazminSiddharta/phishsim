// js/metrics.js
// Módulo de cálculo y renderizado del dashboard
// Procesa las decisiones del tracker y genera el perfil de vulnerabilidad

const Metrics = (() => {

  // Calcula porcentaje redondeado
  const pct = (parte, total) =>
    total === 0 ? 0 : Math.round((parte / total) * 100);

  // Genera el perfil de riesgo según tasa de clic en phishing y falsos positivos
  const calcularPerfil = (tasaCaida, tasaFalsoPositivo) => {
    if (tasaCaida === 0 && tasaFalsoPositivo === 0) return {
      nivel:       '🛡️ Perfil Experto',
      clase:       'bajo',
      icono:       '🛡️',
      descripcion: 'Excelente. Detectaste todos los ataques y no confundiste ningún correo legítimo. Tienes una cultura de seguridad sólida.'
    };
    if (tasaCaida === 0 && tasaFalsoPositivo > 0) return {
      nivel:       '🔍 Perfil Precavido',
      clase:       'bajo',
      icono:       '🔍',
      descripcion: 'No caíste en ningún phishing, aunque fuiste demasiado precavido con correos legítimos. Aprende a distinguir las señales de confianza.'
    };
    if (tasaCaida <= 33) return {
      nivel:       '⚠️ Riesgo Medio',
      clase:       'medio',
      icono:       '⚠️',
      descripcion: 'Detectaste la mayoría de los ataques, pero algunos lograron engañarte. Revisa las señales de alerta de cada categoría.'
    };
    return {
      nivel:       '🚨 Riesgo Alto',
      clase:       'alto',
      icono:       '🚨',
      descripcion: 'Varios ataques lograron engañarte. Es importante reforzar tus hábitos de verificación antes de hacer clic en cualquier enlace.'
    };
  };

  // Renderiza el dashboard completo
  const renderizar = () => {
    const todas          = Tracker.obtenerTodas();
    const total          = todas.length;
    const soloPhishing   = todas.filter(d => d.esPhishing);
    const soloLegitimos  = todas.filter(d => !d.esPhishing);

    // Conteos principales
    const caidas         = Tracker.contarResultado('caida');
    const verdaderos_pos = Tracker.contarResultado('verdadero_positivo');
    const falsos_pos     = Tracker.contarResultado('falso_positivo');

    const tasaCaida      = pct(caidas, soloPhishing.length);
    const tasaDeteccion  = pct(verdaderos_pos, soloPhishing.length);
    const tasaFalsoPos   = pct(falsos_pos, soloLegitimos.length);

    // Métricas globales
    document.getElementById('tasa-clic').textContent      = `${tasaCaida}%`;
    document.getElementById('tasa-deteccion').textContent = `${tasaDeteccion}%`;
    document.getElementById('tasa-ignorar').textContent   = `${tasaFalsoPos}%`;

    // Actualizar labels del dashboard
    document.querySelector('#tasa-ignorar')
      .closest('.metrica-card')
      .querySelector('.metrica-label').textContent = 'Falsos Positivos';
    document.querySelector('#tasa-ignorar')
      .closest('.metrica-card')
      .querySelector('.metrica-desc').textContent =
        'Correos legítimos que reportaste como phishing';

    // Perfil de riesgo
    const perfil  = calcularPerfil(tasaCaida, tasaFalsoPos);
    const perfilEl = document.getElementById('perfil-riesgo');
    perfilEl.className = `perfil-riesgo ${perfil.clase}`;
    document.getElementById('riesgo-icono').textContent       = perfil.icono;
    document.getElementById('riesgo-nivel').textContent       = perfil.nivel;
    document.getElementById('riesgo-descripcion').textContent = perfil.descripcion;

    // Métricas por categoría (solo phishing)
    ['urgencia', 'autoridad', 'recompensa'].forEach(cat => {
      const catDecisiones = Tracker.porCategoria(cat).filter(d => d.esPhishing);
      const catCaidas     = catDecisiones.filter(d => d.tipodecision === 'caida').length;
      const catTotal      = catDecisiones.length;
      const catPct        = pct(catCaidas, catTotal);

      document.getElementById(`barra-${cat}`).style.width =`${catPct}%`;
      document.getElementById(`pct-${cat}`).textContent   = `${catPct}%`;
      document.getElementById(`resultado-${cat}`).textContent =
        `${catCaidas} de ${catTotal} correos de phishing lograron engañarte`;
    });

    // Iconos por tipo de resultado
    const iconos = {
      caida:              '❌ Hiciste clic',
      verdadero_positivo: '✅ Reportaste',
      ignorado:           '😐 Ignoraste',
      verdadero_negativo: '✅ Identificaste',
      falso_positivo:     '⚠️ Falso positivo',
      ignorado_legitimo:  '😐 Ignoraste'
    };

    // Tabla de decisiones
    const filas = todas.map(d => `
      <tr>
        <td>${d.id}</td>
        <td>${d.esPhishing ? '🎣 Phishing' : '📧 Legítimo'}</td>
        <td>${d.categoria}</td>
        <td>${d.nivel}</td>
        <td>${d.asunto.substring(0, 35)}...</td>
        <td>${iconos[d.tipodecision] || d.decision}</td>
      </tr>
    `).join('');

    document.getElementById('tabla-decisiones').innerHTML = `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
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