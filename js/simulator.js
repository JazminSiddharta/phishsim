// js/simulator.js
// Módulo que controla la presentación de escenarios
// Renderiza cada correo simulado en pantalla + temporizador por correo

const Simulator = (() => {

  let escenarios    = [];
  let indiceActual  = 0;
  let timerInterval = null;
  let segundos      = 0;

  // ── Timer ────────────────────────────────────────────────
  const iniciarTimer = () => {
    segundos = 0;
    actualizarDisplayTimer();
    timerInterval = setInterval(() => {
      segundos++;
      actualizarDisplayTimer();
    }, 1000);
  };

  const detenerTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    return segundos;
  };

  const actualizarDisplayTimer = () => {
    const el = document.getElementById('timer-display');
    if (el) el.textContent = `⏱️ ${segundos}s`;
  };

  // ── Inicializar ──────────────────────────────────────────
  const iniciar = (datos) => {
    escenarios    = [...datos];
    indiceActual  = 0;
    renderizar();
    iniciarTimer();
  };

  // ── Renderizar escenario actual ──────────────────────────
  const renderizar = () => {
    const e = escenarios[indiceActual];
    if (!e) return;

    // Barra de progreso
    const pct = (indiceActual / escenarios.length) * 100;
    document.getElementById('barra-relleno').style.width = `${pct}%`;
    document.getElementById('correo-actual').textContent = `Correo ${indiceActual + 1}`;
    document.getElementById('total-correos').textContent = escenarios.length;
    document.getElementById('categoria-actual').textContent =
      `Categoría: ${e.categoria.charAt(0).toUpperCase() + e.categoria.slice(1)} — ${e.tecnica}`;

    // Avatar con inicial del remitente
    document.getElementById('email-avatar').textContent =
      e.remitenteNombre.charAt(0).toUpperCase();

    // Datos del remitente
    document.getElementById('email-remitente').textContent = e.remitenteNombre;
    document.getElementById('email-direccion').textContent = e.remitente;

    // Nivel de dificultad con color
    const nivelEl = document.getElementById('email-nivel');
    nivelEl.textContent = e.nivelLabel;
    nivelEl.className   = 'email-nivel';
    const colores = {
      basico:     { bg: '#eafaf1', color: '#27ae60' },
      intermedio: { bg: '#fff9e6', color: '#e67e22' },
      avanzado:   { bg: '#fdecea', color: '#e74c3c' }
    };
    const c = colores[e.nivel] || colores.basico;
    nivelEl.style.background = c.bg;
    nivelEl.style.color      = c.color;

    // Asunto y cuerpo
    document.getElementById('email-asunto').textContent  = e.asunto;
    document.getElementById('email-cuerpo').innerHTML    = e.cuerpo;
  };

  // ── API pública ──────────────────────────────────────────
  const obtenerActual  = () => escenarios[indiceActual];
  const obtenerTiempo  = () => detenerTimer();

  const siguiente = () => {
    indiceActual++;
    if (indiceActual < escenarios.length) {
      renderizar();
      iniciarTimer();
      return true;
    }
    return false;
  };

  const termino = () => indiceActual >= escenarios.length;

  return { iniciar, siguiente, obtenerActual, obtenerTiempo, termino };

})();