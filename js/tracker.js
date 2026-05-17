// js/tracker.js
// Módulo de registro de interacciones y almacenamiento de resultados
// Guarda decisiones del empleado y persiste datos organizacionales

const Tracker = {

  // Datos del empleado actual
  empleadoActual: {
    nombre: '',
    departamento: '',
    decisiones: [],
    fechaInicio: null,
    fechaFin: null,
  },

  // ── Inicializar un nuevo empleado ──────────────────────────────────────
  iniciarSesion(nombre, departamento) {
    this.empleadoActual = {
      nombre,
      departamento,
      decisiones: [],
      fechaInicio: new Date().toISOString(),
      fechaFin: null,
    };
    console.log(`✅ Tracker: sesión iniciada para ${nombre} — ${departamento}`);
  },

  // ── Registrar una decisión del empleado ───────────────────────────────
  registrarDecision(escenario, decision) {
    const entrada = {
      escenarioId: escenario.id,
      categoria: escenario.categoria,
      nivel: escenario.nivel,
      decision,                          // 'clic' | 'ignorar' | 'reportar'
      esPhishing: escenario.esPhishing,
      correcta: decision === 'reportar',
      timestamp: new Date().toISOString(),
    };
    this.empleadoActual.decisiones.push(entrada);
    console.log(`📝 Decisión registrada: ${escenario.categoria} → ${decision}`);
    return entrada;
  },

  // ── Finalizar sesión y guardar en localStorage ─────────────────────────
  finalizarSesion() {
    this.empleadoActual.fechaFin = new Date().toISOString();

    // Calcular métricas individuales
    const metricas = this.calcularMetricasIndividuales();
    const resultado = {
      ...this.empleadoActual,
      metricas,
      id: Date.now(),
    };

    // Guardar en el historial organizacional
    const historial = this.obtenerHistorial();
    historial.push(resultado);
    localStorage.setItem('secureaware_resultados', JSON.stringify(historial));

    console.log(`✅ Sesión finalizada y guardada para ${this.empleadoActual.nombre}`);
    return resultado;
  },

  // ── Calcular métricas del empleado actual ─────────────────────────────
  calcularMetricasIndividuales() {
    const decisiones = this.empleadoActual.decisiones;
    const total = decisiones.length;

    if (total === 0) return {};

    const clics = decisiones.filter(d => d.decision === 'clic').length;
    const reportes = decisiones.filter(d => d.decision === 'reportar').length;
    const ignorados = decisiones.filter(d => d.decision === 'ignorar').length;

    // Métricas por categoría
    const categorias = ['urgencia', 'autoridad', 'recompensa', 'contrasenas', 'redes_sociales', 'malware'];
    const porCategoria = {};

    categorias.forEach(cat => {
      const delCat = decisiones.filter(d => d.categoria === cat);
      if (delCat.length === 0) return;
      const clicsCat = delCat.filter(d => d.decision === 'clic').length;
      porCategoria[cat] = {
        total: delCat.length,
        clics: clicsCat,
        reportes: delCat.filter(d => d.decision === 'reportar').length,
        ignorados: delCat.filter(d => d.decision === 'ignorar').length,
        tasaClic: Math.round((clicsCat / delCat.length) * 100),
      };
    });

    // Categoría más vulnerable
    let catMasVulnerable = null;
    let maxTasaClic = -1;
    Object.entries(porCategoria).forEach(([cat, datos]) => {
      if (datos.tasaClic > maxTasaClic) {
        maxTasaClic = datos.tasaClic;
        catMasVulnerable = cat;
      }
    });

    // Nivel de riesgo global
    const tasaClicGlobal = Math.round((clics / total) * 100);
    let nivelRiesgo = 'bajo';
    if (tasaClicGlobal >= 60) nivelRiesgo = 'alto';
    else if (tasaClicGlobal >= 30) nivelRiesgo = 'medio';

    return {
      total,
      clics,
      reportes,
      ignorados,
      tasaClic: tasaClicGlobal,
      tasaDeteccion: Math.round((reportes / total) * 100),
      tasaIgnorar: Math.round((ignorados / total) * 100),
      nivelRiesgo,
      porCategoria,
      catMasVulnerable,
    };
  },

  // ── Obtener historial completo organizacional ──────────────────────────
  obtenerHistorial() {
    try {
      const data = localStorage.getItem('secureaware_resultados');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // ── Calcular métricas organizacionales (para el admin) ─────────────────
  calcularMetricasOrganizacionales() {
    const historial = this.obtenerHistorial();
    if (historial.length === 0) return null;

    const total = historial.length;

    // Promedios globales
    const tasaClicGlobal = Math.round(historial.reduce((s, e) => s + e.metricas.tasaClic, 0) / total);
    const tasaDeteccionGlobal = Math.round(historial.reduce((s, e) => s + e.metricas.tasaDeteccion, 0) / total);
    const tasaIgnorarGlobal = Math.round(historial.reduce((s, e) => s + e.metricas.tasaIgnorar, 0) / total);

    // Métricas por departamento
    const deptos = {};
    historial.forEach(emp => {
      const d = emp.departamento;
      if (!deptos[d]) {
        deptos[d] = { nombre: d, participantes: 0, sumaClics: 0, sumaDeteccion: 0, nivelRiesgo: [] };
      }
      deptos[d].participantes++;
      deptos[d].sumaClics += emp.metricas.tasaClic;
      deptos[d].sumaDeteccion += emp.metricas.tasaDeteccion;
      deptos[d].nivelRiesgo.push(emp.metricas.nivelRiesgo);
    });

    const porDepartamento = Object.values(deptos).map(d => ({
      nombre: d.nombre,
      participantes: d.participantes,
      tasaClic: Math.round(d.sumaClics / d.participantes),
      tasaDeteccion: Math.round(d.sumaDeteccion / d.participantes),
      nivelRiesgo: this.nivelMasFrecuente(d.nivelRiesgo),
    }));

    // Área más vulnerable
    const areaMasVulnerable = porDepartamento.reduce(
      (max, d) => d.tasaClic > max.tasaClic ? d : max,
      porDepartamento[0]
    );

    // Categoría más efectiva globalmente
    const conteoVulnerabilidades = {};
    historial.forEach(emp => {
      const cat = emp.metricas.catMasVulnerable;
      if (cat) conteoVulnerabilidades[cat] = (conteoVulnerabilidades[cat] || 0) + 1;
    });

    const catMasEfectiva = Object.entries(conteoVulnerabilidades)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
      total,
      tasaClicGlobal,
      tasaDeteccionGlobal,
      tasaIgnorarGlobal,
      porDepartamento,
      areaMasVulnerable,
      catMasEfectiva,
      historial,
    };
  },

  // ── Helper: nivel de riesgo más frecuente en un array ─────────────────
  nivelMasFrecuente(niveles) {
    const conteo = {};
    niveles.forEach(n => conteo[n] = (conteo[n] || 0) + 1);
    return Object.entries(conteo).sort((a, b) => b[1] - a[1])[0][0];
  },

  // ── Limpiar todos los datos (para el admin) ────────────────────────────
  limpiarHistorial() {
    localStorage.removeItem('secureaware_resultados');
    console.log('🗑️ Historial organizacional limpiado');
  },
};

console.log('✅ Tracker cargado correctamente');