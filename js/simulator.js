// js/simulator.js
// Módulo de simulación de correos
// Controla la presentación de cada escenario al usuario

const Simulator = {

  escenarios: [],
  indiceActual: 0,
  totalEscenarios: 0,

  // ── Inicializar el simulador ───────────────────────────────────────────
  inicializar(escenarios) {
    this.escenarios = escenarios;
    this.indiceActual = 0;
    this.totalEscenarios = escenarios.length;
    console.log(`✅ Simulator: ${this.totalEscenarios} escenarios listos`);
  },

  // ── Obtener escenario actual ───────────────────────────────────────────
  escenarioActual() {
    return this.escenarios[this.indiceActual];
  },

  // ── ¿Hay más escenarios? ──────────────────────────────────────────────
  hayMas() {
    return this.indiceActual < this.totalEscenarios - 1;
  },

  // ── Avanzar al siguiente escenario ────────────────────────────────────
  avanzar() {
    if (this.hayMas()) {
      this.indiceActual++;
      return true;
    }
    return false;
  },

  // ── Renderizar el escenario actual en el DOM ──────────────────────────
  renderizarEscenarioActual() {
    const escenario = this.escenarioActual();
    const numero = this.indiceActual + 1;

    // Barra de progreso
    const pct = Math.round((numero / this.totalEscenarios) * 100);
    document.getElementById('barra-relleno').style.width = `${pct}%`;
    document.getElementById('correo-actual').textContent = numero;
    document.getElementById('total-correos').textContent = this.totalEscenarios;

    // Categoría y nivel en barra superior
    document.getElementById('categoria-actual').textContent =
      this.labelCategoria(escenario.categoria);
    document.getElementById('nivel-actual').textContent =
      `Dificultad: ${escenario.nivelLabel}`;

    // Avatar con inicial del remitente
    document.getElementById('email-avatar').textContent =
      escenario.remitenteNombre.charAt(0).toUpperCase();

    // Datos del correo
    document.getElementById('email-remitente').textContent = escenario.remitenteNombre;
    document.getElementById('email-direccion').textContent = escenario.remitente;
    document.getElementById('email-asunto').textContent = escenario.asunto;
    document.getElementById('email-cuerpo').innerHTML = escenario.cuerpo;

    // Badge de nivel
    const badge = document.getElementById('email-nivel');
    badge.textContent = escenario.nivelLabel;
    badge.className = `email-nivel-badge badge-${escenario.nivel}`;

    // Nombre del empleado en barra
    document.getElementById('empleado-nombre-barra').textContent =
      Tracker.empleadoActual.nombre;

    // Habilitar botones de acción
    this.habilitarBotones(true);
  },

  // ── Renderizar pantalla de feedback educativo ─────────────────────────
  renderizarFeedback(escenario, decision) {
    const { tipo, icono, titulo, subtitulo, claseHeader } =
      this.datosFeedback(decision);

    // Header con color según decisión
    const header = document.getElementById('feedback-header');
    header.className = `feedback-header ${claseHeader}`;

    document.getElementById('feedback-icono').textContent = icono;
    document.getElementById('feedback-titulo').textContent = titulo;
    document.getElementById('feedback-subtitulo').textContent = subtitulo;

    // Explicación
    document.getElementById('feedback-explicacion').textContent =
      escenario.explicacion;

    // Señales de alerta
    const listaSeñales = document.getElementById('feedback-senales');
    listaSeñales.innerHTML = escenario.senalesAlerta
      .map(s => `<li>${s}</li>`)
      .join('');

    // Consejos
    const listaConsejos = document.getElementById('feedback-consejos');
    listaConsejos.innerHTML = escenario.consejos
      .map(c => `<li>${c}</li>`)
      .join('');

    // Texto del botón siguiente
    const btnSiguiente = document.getElementById('btn-siguiente');
    btnSiguiente.textContent = this.hayMas()
      ? 'Siguiente ejercicio →'
      : 'Ver mis resultados →';
  },

  // ── Datos del feedback según la decisión tomada ───────────────────────
  datosFeedback(decision) {
    switch (decision) {
      case 'reportar':
        return {
          icono: '🎉',
          titulo: '¡Excelente! Lo detectaste correctamente',
          subtitulo: 'Reportaste este correo como phishing — esa es siempre la respuesta correcta.',
          claseHeader: 'correcto',
        };
      case 'ignorar':
        return {
          icono: '⚠️',
          titulo: 'Casi... pero no fue suficiente',
          subtitulo: 'Ignorar el correo evita el daño inmediato, pero reportarlo ayuda a proteger a toda la organización.',
          claseHeader: 'advertencia',
        };
      case 'clic':
        return {
          icono: '🚨',
          titulo: 'Caíste en el ataque',
          subtitulo: 'Hiciste clic en el enlace. En un ataque real, esto podría haber comprometido tus credenciales o tu dispositivo.',
          claseHeader: 'peligro',
        };
      default:
        return {
          icono: 'ℹ️',
          titulo: 'Resultado',
          subtitulo: '',
          claseHeader: 'advertencia',
        };
    }
  },

  // ── Label legible para cada categoría ────────────────────────────────
  labelCategoria(categoria) {
    const labels = {
      urgencia: '⚡ Categoría: Urgencia',
      autoridad: '🏛️ Categoría: Autoridad',
      recompensa: '🎁 Categoría: Recompensa',
      contrasenas: '🔐 Categoría: Contraseñas',
      redes_sociales: '📱 Categoría: Redes Sociales',
      malware: '🦠 Categoría: Malware',
    };
    return labels[categoria] || categoria;
  },

  // ── Habilitar o deshabilitar botones de acción ────────────────────────
  habilitarBotones(estado) {
    document.querySelectorAll('.btn-accion').forEach(btn => {
      btn.disabled = !estado;
      btn.style.opacity = estado ? '1' : '0.5';
      btn.style.cursor = estado ? 'pointer' : 'not-allowed';
    });
  },
};

console.log('✅ Simulator cargado correctamente');