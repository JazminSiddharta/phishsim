// js/tracker.js
// Módulo de registro de decisiones del usuario
// Almacena decisiones + tiempo + historial entre sesiones via localStorage

const Tracker = (() => {

  let decisiones = [];
  const STORAGE_KEY = 'phishsim_historial';

  // ── Clasificación de decisiones ────────────────────────
  const clasificar = (escenario, decision) => {
    let correcta     = false;
    let tipodecision = '';

    if (escenario.esPhishing) {
      correcta     = decision === 'reportar';
      tipodecision = decision === 'reportar' ? 'verdadero_positivo'
                   : decision === 'clic'     ? 'caida'
                   : 'ignorado';
    } else {
      correcta     = decision === 'clic';
      tipodecision = decision === 'clic'     ? 'verdadero_negativo'
                   : decision === 'reportar' ? 'falso_positivo'
                   : 'ignorado_legitimo';
    }

    return { correcta, tipodecision };
  };

  // ── Registrar decisión ─────────────────────────────────
  const registrar = (escenario, decision, tiempoSegundos) => {
    const { correcta, tipodecision } = clasificar(escenario, decision);

    const velocidad = tiempoSegundos <= 5  ? 'impulsiva'
                    : tiempoSegundos <= 15 ? 'normal'
                    : 'reflexiva';

    const entrada = {
      id:           escenario.id,
      categoria:    escenario.categoria,
      nivel:        escenario.nivel,
      asunto:       escenario.asunto,
      esPhishing:   escenario.esPhishing,
      decision:     decision,
      correcta:     correcta,
      tipodecision: tipodecision,
      tiempo:       tiempoSegundos,
      velocidad:    velocidad,
      timestamp:    Date.now()
    };

    decisiones.push(entrada);
    return entrada;
  };

  // ── Guardar sesión completa en localStorage ────────────
  const guardarSesion = () => {
    try {
      const historial = cargarHistorial();
      const sesion = {
        fecha:      new Date().toLocaleDateString('es-MX'),
        timestamp:  Date.now(),
        decisiones: [...decisiones],
        resumen: {
          total:      decisiones.length,
          correctas:  decisiones.filter(d => d.correcta).length,
          caidas:     decisiones.filter(d => d.tipodecision === 'caida').length,
          promedio:   tiempoPromedio()
        }
      };
      historial.push(sesion);
      // Guardar máximo 10 sesiones
      const ultimas = historial.slice(-10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ultimas));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  };

  // ── Cargar historial de sesiones previas ───────────────
  const cargarHistorial = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  // ── Limpiar historial ──────────────────────────────────
  const limpiarHistorial = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('No se pudo limpiar localStorage:', e);
    }
  };

  // ── Consultas ──────────────────────────────────────────
  const obtenerTodas      = () => [...decisiones];
  const porCategoria      = (cat) => decisiones.filter(d => d.categoria === cat);
  const contarPor         = (tipo) => decisiones.filter(d => d.decision === tipo).length;
  const contarResultado   = (tipo) => decisiones.filter(d => d.tipodecision === tipo).length;

  const tiempoPromedio = () => {
    if (decisiones.length === 0) return 0;
    const suma = decisiones.reduce((acc, d) => acc + d.tiempo, 0);
    return Math.round(suma / decisiones.length);
  };

  const caídasImpulsivas = () =>
    decisiones.filter(d => d.velocidad === 'impulsiva' && d.tipodecision === 'caida').length;

  const reiniciar = () => {
    decisiones = [];
  };

  return {
    registrar,
    guardarSesion,
    cargarHistorial,
    limpiarHistorial,
    obtenerTodas,
    porCategoria,
    contarPor,
    contarResultado,
    tiempoPromedio,
    caídasImpulsivas,
    reiniciar
  };

})();