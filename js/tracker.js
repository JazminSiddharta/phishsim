// js/tracker.js
// Módulo de registro de decisiones del usuario
// Almacena y consulta cada interacción durante la simulación

const Tracker = (() => {

  // Historial de decisiones: una entrada por escenario
  let decisiones = [];

  // Registra la decisión del usuario para un escenario
  const registrar = (escenario, decision) => {
    const entrada = {
      id:         escenario.id,
      categoria:  escenario.categoria,
      nivel:      escenario.nivel,
      asunto:     escenario.asunto,
      decision:   decision,          // 'clic' | 'ignorar' | 'reportar'
      correcta:   decision === 'reportar',
      timestamp:  Date.now()
    };
    decisiones.push(entrada);
    return entrada;
  };

  // Devuelve todas las decisiones registradas
  const obtenerTodas = () => [...decisiones];

  // Devuelve decisiones filtradas por categoría
  const porCategoria = (cat) =>
    decisiones.filter(d => d.categoria === cat);

  // Cuenta decisiones por tipo
  const contarPor = (tipo) =>
    decisiones.filter(d => d.decision === tipo).length;

  // Reinicia el historial para nueva simulación
  const reiniciar = () => {
    decisiones = [];
  };

  return { registrar, obtenerTodas, porCategoria, contarPor, reiniciar };

})();