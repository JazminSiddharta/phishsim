// js/tracker.js
// Módulo de registro de decisiones del usuario
// Almacena y consulta cada interacción + tiempo de decisión

const Tracker = (() => {

  let decisiones = [];

  // Registra la decisión del usuario para un escenario
  const registrar = (escenario, decision, tiempoSegundos) => {

    // Evalúa si la decisión fue correcta según el tipo de correo
    let correcta = false;
    let tipodecision = '';

    if (escenario.esPhishing) {
      correcta = decision === 'reportar';
      tipodecision = decision === 'reportar' ? 'verdadero_positivo'
        : decision === 'clic' ? 'caida'
          : 'ignorado';
    } else {
      correcta = decision === 'clic';
      tipodecision = decision === 'clic' ? 'verdadero_negativo'
        : decision === 'reportar' ? 'falso_positivo'
          : 'ignorado_legitimo';
    }

    // Clasifica la velocidad de decisión
    const velocidad = tiempoSegundos <= 5 ? 'impulsiva'
      : tiempoSegundos <= 15 ? 'normal'
        : 'reflexiva';

    const entrada = {
      id: escenario.id,
      categoria: escenario.categoria,
      nivel: escenario.nivel,
      asunto: escenario.asunto,
      esPhishing: escenario.esPhishing,
      decision: decision,
      correcta: correcta,
      tipodecision: tipodecision,
      tiempo: tiempoSegundos,
      velocidad: velocidad,
      timestamp: Date.now()
    };

    decisiones.push(entrada);
    return entrada;
  };

  // Devuelve todas las decisiones
  const obtenerTodas = () => [...decisiones];

  // Devuelve decisiones filtradas por categoría
  const porCategoria = (cat) =>
    decisiones.filter(d => d.categoria === cat);

  // Cuenta por tipo de decisión
  const contarPor = (tipo) =>
    decisiones.filter(d => d.decision === tipo).length;

  // Cuenta por tipo de resultado
  const contarResultado = (tipo) =>
    decisiones.filter(d => d.tipodecision === tipo).length;

  // Tiempo promedio de decisión en segundos
  const tiempoPromedio = () => {
    if (decisiones.length === 0) return 0;
    const suma = decisiones.reduce((acc, d) => acc + d.tiempo, 0);
    return Math.round(suma / decisiones.length);
  };

  // Decisiones impulsivas que resultaron en caída
  const caídasImpulsivas = () =>
    decisiones.filter(d => d.velocidad === 'impulsiva' && d.tipodecision === 'caida').length;

  // Reinicia para nueva simulación
  const reiniciar = () => {
    decisiones = [];
  };

  return {
    registrar,
    obtenerTodas,
    porCategoria,
    contarPor,
    contarResultado,
    tiempoPromedio,
    caídasImpulsivas,
    reiniciar
  };

})();