// js/app.js
// Módulo principal — conecta todos los módulos y controla la navegación

let resultadoFinal = null;
let categoriaAnterior = null;
let empleadoActivo = null;

// ══════════════════════════════════════════════════════════════════════════
//  NAVEGACIÓN ENTRE PANTALLAS
// ══════════════════════════════════════════════════════════════════════════

function mostrarPantalla(idPantalla) {
    document.querySelectorAll('.pantalla').forEach(p => {
        p.classList.remove('activa');
    });
    document.getElementById(idPantalla).classList.add('activa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════════════════════════════════════════
//  INICIALIZACIÓN
// ══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Siempre mostrar splash primero
    mostrarPantalla('pantalla-splash');

    // Si ya está configurado, actualizar nombre en pantalla inicio
    if (Config.estaConfigurada()) {
        document.getElementById('inicio-nombre-empresa').textContent =
            Config.obtenerNombreEmpresa();
    }

    console.log('✅ SecureAware inicializado correctamente');
});

// ══════════════════════════════════════════════════════════════════════════
//  SETUP INICIAL
// ══════════════════════════════════════════════════════════════════════════

function agregarDeptoSetup() {
    const nombre = document.getElementById('setup-depto-nombre').value.trim();
    const password = document.getElementById('setup-depto-password').value.trim();
    const errorEl = document.getElementById('setup-error-depto');

    if (!nombre || !password) {
        errorEl.textContent = '❌ Completa el nombre y contraseña del departamento.';
        errorEl.style.display = 'block';
        return;
    }

    const resultado = Config.agregarDepartamento(nombre, password);
    if (!resultado.ok) {
        errorEl.textContent = `❌ ${resultado.error}`;
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';
    document.getElementById('setup-depto-nombre').value = '';
    document.getElementById('setup-depto-password').value = '';
    renderizarListaDeptos();
}

function renderizarListaDeptos() {
    const lista = document.getElementById('setup-lista-deptos');
    const deptos = Config.obtenerDepartamentos();

    if (deptos.length === 0) {
        lista.innerHTML = '<p style="font-size:13px; color:var(--gris)">Aún no hay departamentos agregados.</p>';
        return;
    }

    lista.innerHTML = deptos.map(d => `
    <div class="setup-depto-item">
      <div class="setup-depto-info">
        <span class="setup-depto-nombre">🏢 ${d.nombre}</span>
        <span class="setup-depto-pass">Contraseña: ${d.password}</span>
      </div>
      <button class="btn-eliminar-depto" onclick="eliminarDeptoSetup('${d.nombre}')">
        Eliminar
      </button>
    </div>
  `).join('');
}

function eliminarDeptoSetup(nombre) {
    Config.eliminarDepartamento(nombre);
    renderizarListaDeptos();
}

function finalizarSetup() {
    const empresa = document.getElementById('setup-empresa').value.trim();
    const pass1 = document.getElementById('setup-admin-password').value;
    const pass2 = document.getElementById('setup-admin-password2').value;
    const errorEl = document.getElementById('setup-error-general');
    const deptos = Config.obtenerDepartamentos();

    if (!empresa) {
        errorEl.textContent = '❌ Ingresa el nombre de la empresa.';
        errorEl.style.display = 'block';
        return;
    }

    if (!pass1) {
        errorEl.textContent = '❌ Ingresa la contraseña de administrador.';
        errorEl.style.display = 'block';
        return;
    }

    if (pass1 !== pass2) {
        errorEl.textContent = '❌ Las contraseñas no coinciden.';
        errorEl.style.display = 'block';
        return;
    }

    if (deptos.length === 0) {
        errorEl.textContent = '❌ Agrega al menos un departamento.';
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';
    Config.finalizarSetup(empresa, pass1);

    document.getElementById('inicio-nombre-empresa').textContent = empresa;
    document.getElementById('inicio-nombre-empresa').textContent = empresa;
    mostrarPantalla('pantalla-splash');
}

// ══════════════════════════════════════════════════════════════════════════
//  LOGIN ADMINISTRADOR
// ══════════════════════════════════════════════════════════════════════════

function mostrarLoginAdmin() {
    document.getElementById('input-password').value = '';
    document.getElementById('error-login').style.display = 'none';
    mostrarPantalla('pantalla-login-admin');
}

function verificarAdmin() {
    const password = document.getElementById('input-password').value;
    if (Config.verificarAdminPassword(password)) {
        mostrarPantalla('pantalla-admin');
        Metrics.renderizarDashboardAdmin();
    } else {
        document.getElementById('error-login').style.display = 'block';
        document.getElementById('input-password').value = '';
        document.getElementById('input-password').focus();
    }
}

function cerrarSesionAdmin() {
    mostrarPantalla('pantalla-splash');
}

// ── Drill-down departamento ───────────────────────────────────────────────
function verDetalleDepartamento(nombreDepto) {
    Metrics.renderizarDetalleDepartamento(nombreDepto);
    mostrarPantalla('pantalla-depto');
}

function volverAlAdmin() {
    mostrarPantalla('pantalla-admin');
    Metrics.renderizarDashboardAdmin();
}

// ── Drill-down empleado ───────────────────────────────────────────────────
function verDetalleEmpleado(idEmpleado, departamento) {
    Metrics.deptoActual = departamento;
    Metrics.renderizarDetalleEmpleado(idEmpleado);
    mostrarPantalla('pantalla-empleado');
}

function volverAlDepto() {
    if (Metrics.deptoActual) {
        verDetalleDepartamento(Metrics.deptoActual);
    } else {
        volverAlAdmin();
    }
}

// ── Exportar CSV ──────────────────────────────────────────────────────────
function exportarCSV() {
    const historial = Tracker.obtenerHistorial();
    if (historial.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    const headers = [
        'Nombre', 'Num. Empleado', 'Departamento', 'Fecha',
        'Score', 'Tasa de Clic (%)', 'Tasa de Detección (%)',
        'Tasa de Ignorar (%)', 'Nivel de Riesgo', 'Categoría más vulnerable',
    ];

    const filas = historial.map(emp => [
        emp.nombre,
        emp.numEmpleado || 'N/A',
        emp.departamento,
        Metrics.formatearFecha(emp.fechaFin),
        emp.score || 0,
        emp.metricas.tasaClic,
        emp.metricas.tasaDeteccion,
        emp.metricas.tasaIgnorar,
        emp.metricas.nivelRiesgo,
        emp.metricas.catMasVulnerable || 'N/A',
    ]);

    const csv = [headers, ...filas]
        .map(fila => fila.map(c => `"${c}"`).join(','))
        .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SecureAware_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════════════════════════════════════
//  LOGIN EMPLEADO
// ══════════════════════════════════════════════════════════════════════════

// Cargar departamentos en el select al mostrar pantalla login
function mostrarLoginEmpleado() {
    const select = document.getElementById('login-departamento');
    const deptos = Config.obtenerDepartamentos();
    select.innerHTML = '<option value="">— Selecciona tu departamento —</option>';
    deptos.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.nombre;
        opt.textContent = d.nombre;
        select.appendChild(opt);
    });
    document.getElementById('login-num-empleado').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('error-login-empleado').style.display = 'none';
    mostrarPantalla('pantalla-login-empleado');
}

function procesarLoginEmpleado() {
    const numEmpleado = document.getElementById('login-num-empleado').value.trim();
    const departamento = document.getElementById('login-departamento').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('error-login-empleado');

    if (!numEmpleado || !departamento || !password) {
        errorEl.textContent = '❌ Completa todos los campos.';
        errorEl.style.display = 'block';
        return;
    }

    // Verificar contraseña del departamento
    const passCorrecta = Config.verificarPasswordDepartamento(departamento, password);
    if (!passCorrecta) {
        errorEl.textContent = '❌ Usuario o contraseña incorrectos.';
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';

    // Primera vez — ir a registro
    if (Auth.esPrimeraVez(numEmpleado)) {
        // Guardar temporalmente para usarlo en completarRegistro
        window._loginTemp = { numEmpleado, departamento };
        mostrarPantalla('pantalla-registro');
        return;
    }

    // Login normal
    const resultado = Auth.loginEmpleado(numEmpleado, password, departamento);
    if (!resultado.ok) {
        errorEl.textContent = `❌ ${resultado.error}`;
        errorEl.style.display = 'block';
        return;
    }

    empleadoActivo = resultado.empleado;
    mostrarMenuEmpleado();
}

function completarRegistro() {
    const nombre = document.getElementById('input-nombre').value.trim();
    const errorEl = document.getElementById('error-registro');

    if (!nombre) {
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';

    const { numEmpleado, departamento } = window._loginTemp;
    const resultado = Auth.registrarEmpleado(nombre, numEmpleado, departamento);

    if (!resultado.ok) {
        errorEl.textContent = `❌ ${resultado.error}`;
        errorEl.style.display = 'block';
        return;
    }

    empleadoActivo = resultado.empleado;
    mostrarMenuEmpleado();
}

function cerrarSesionEmpleado() {
    empleadoActivo = null;
    mostrarPantalla('pantalla-splash');
}

// ══════════════════════════════════════════════════════════════════════════
//  MENÚ DE CAPACITACIONES
// ══════════════════════════════════════════════════════════════════════════

const MODULOS = [
    {
        id: 'phishing',
        emoji: '🎣',
        titulo: 'Phishing',
        desc: 'Aprende a identificar correos fraudulentos y ataques de ingeniería social.',
    },
    {
        id: 'contrasenas',
        emoji: '🔐',
        titulo: 'Contraseñas Seguras',
        desc: 'Conoce las buenas prácticas para crear y gestionar contraseñas.',
    },
    {
        id: 'redes_sociales',
        emoji: '📱',
        titulo: 'Redes Sociales',
        desc: 'Descubre qué información es peligroso compartir en redes sociales.',
    },
    {
        id: 'malware',
        emoji: '🦠',
        titulo: 'Malware',
        desc: 'Identifica archivos y enlaces maliciosos antes de abrirlos.',
    },
];

function mostrarMenuEmpleado() {
    // Datos del empleado
    document.getElementById('menu-nombre-empleado').textContent =
        empleadoActivo.nombre;
    document.getElementById('menu-num-empleado').textContent =
        `#${empleadoActivo.numEmpleado}`;
    document.getElementById('menu-departamento').textContent =
        empleadoActivo.departamento;

    // Progreso general
    const progreso = Auth.calcularProgreso(empleadoActivo.numEmpleado);
    document.getElementById('progreso-pct').textContent = `${progreso.porcentaje}%`;
    document.getElementById('progreso-desc').textContent =
        `${progreso.completadas} de ${progreso.total} módulos completados`;

    setTimeout(() => {
        document.getElementById('progreso-barra').style.width = `${progreso.porcentaje}%`;
    }, 100);

    // Tarjetas de módulos
    const grid = document.getElementById('modulos-grid');
    const hechas = Auth.obtenerCapacitacionesHechas(empleadoActivo.numEmpleado);

    grid.innerHTML = MODULOS.map(m => {
        const completado = hechas.includes(m.id);
        return `
      <div class="modulo-card ${m.id} ${completado ? 'completado' : 'pendiente'}"
           onclick="iniciarModulo('${m.id}')">
        ${completado ? '<div class="modulo-check">✅</div>' : ''}
        <div class="modulo-emoji">${m.emoji}</div>
        <div class="modulo-titulo">${m.titulo}</div>
        <div class="modulo-desc">${m.desc}</div>
        <div class="modulo-estado ${completado ? 'hecho' : 'pendiente'}">
          ${completado ? '✅ Completado' : '▶ Comenzar'}
        </div>
      </div>
    `;
    }).join('');

    mostrarPantalla('pantalla-menu');
}

// ══════════════════════════════════════════════════════════════════════════
//  INICIAR MÓDULO DE CAPACITACIÓN
// ══════════════════════════════════════════════════════════════════════════

function iniciarModulo(categoriaId) {
    // Mostrar lección primero
    const leccionHeader = document.getElementById('leccion-header-modulo');
    if (leccionHeader) {
        const labels = {
            phishing: '🎣 Phishing',
            contrasenas: '🔐 Contraseñas Seguras',
            redes_sociales: '📱 Redes Sociales',
            malware: '🦠 Malware',
        };
        leccionHeader.textContent = labels[categoriaId] || categoriaId;
    }

    // Guardar el módulo actual para usarlo después
    window._moduloActual = categoriaId;

    // Renderizar lección
    Lessons.renderizar(categoriaId);
    mostrarPantalla('pantalla-leccion');
}

function iniciarEjerciciosDesdeLeccion() {
    const categoriaId = window._moduloActual;

    const escenariosFiltrados = categoriaId === 'phishing'
        ? PHISHING_SCENARIOS
        : PHISHING_SCENARIOS.filter(e => e.categoria === categoriaId);

    if (escenariosFiltrados.length === 0) {
        alert('Este módulo estará disponible próximamente. 🚧');
        mostrarMenuEmpleado();
        return;
    }

    Tracker.iniciarSesion(
        empleadoActivo.nombre,
        empleadoActivo.numEmpleado,
        empleadoActivo.departamento
    );
    Gamification.inicializar();
    Simulator.inicializar(escenariosFiltrados);
    categoriaAnterior = null;

    mostrarPantalla('pantalla-simulador');
    Simulator.renderizarEscenarioActual();
    Gamification.iniciarTimer();
}

// ══════════════════════════════════════════════════════════════════════════
//  FLUJO DE SIMULACIÓN
// ══════════════════════════════════════════════════════════════════════════

function registrarDecision(decision) {
    const escenario = Simulator.escenarioActual();
    Simulator.habilitarBotones(false);
    Gamification.registrarDecision(decision, escenario.nivel);
    Tracker.registrarDecision(escenario, decision);
    Simulator.renderizarFeedback(escenario, decision);
    mostrarPantalla('pantalla-feedback');
}

function siguienteEscenario() {
    if (Simulator.hayMas()) {
        Simulator.avanzar();
        const siguiente = Simulator.escenarioActual();

        if (categoriaAnterior && categoriaAnterior !== siguiente.categoria) {
            Gamification.mostrarTransicion(
                categoriaAnterior,
                siguiente.categoria,
                () => {
                    mostrarPantalla('pantalla-simulador');
                    Simulator.renderizarEscenarioActual();
                    Gamification.iniciarTimer();
                }
            );
        } else {
            mostrarPantalla('pantalla-simulador');
            Simulator.renderizarEscenarioActual();
            Gamification.iniciarTimer();
        }

        categoriaAnterior = siguiente.categoria;

    } else {
        // Finalizar módulo
        resultadoFinal = Tracker.finalizarSesion();
        resultadoFinal.score = Gamification.score;

        // Guardar score
        const historial = Tracker.obtenerHistorial();
        const entrada = historial.find(e => e.id === resultadoFinal.id);
        if (entrada) {
            entrada.score = Gamification.score;
            localStorage.setItem('secureaware_resultados', JSON.stringify(historial));
        }

        // ── Verificar aprobación mínima (70% de detección) ──────────────────
        const tasaDeteccion = resultadoFinal.metricas.tasaDeteccion;
        const MINIMO_APROBACION = 70;
        const aprobado = tasaDeteccion >= MINIMO_APROBACION;

        if (aprobado) {
            // Marcar capacitación como completada
            const categoriaModulo = Simulator.escenarios[0]?.categoria || 'phishing';
            const moduloId = ['urgencia', 'autoridad', 'recompensa'].includes(categoriaModulo)
                ? 'phishing' : categoriaModulo;
            Auth.marcarCapacitacion(empleadoActivo.numEmpleado, moduloId);
        }

        // Mostrar resumen con resultado de aprobación
        resultadoFinal.aprobado = aprobado;
        resultadoFinal.tasaDeteccion = tasaDeteccion;
        resultadoFinal.minimoAprobacion = MINIMO_APROBACION;

        mostrarPantalla('pantalla-resumen');
        Metrics.renderizarResumenPersonal(resultadoFinal);

        const scoreEl = document.getElementById('score-final-valor');
        if (scoreEl) scoreEl.textContent = `⭐ ${Gamification.score}`;
        Gamification.renderizarInsignias('insignias-contenedor');

        // Mostrar banner de aprobación o reprobación
        renderizarBannerAprobacion(aprobado, tasaDeteccion, MINIMO_APROBACION);
    }
}

function renderizarBannerAprobacion(aprobado, tasaDeteccion, minimo) {
    const btnVolverMenu = document.getElementById('btn-volver-menu');
    if (!btnVolverMenu) return;

    // Insertar banner antes del botón
    const bannerExistente = document.getElementById('banner-aprobacion');
    if (bannerExistente) bannerExistente.remove();

    const banner = document.createElement('div');
    banner.id = 'banner-aprobacion';

    if (aprobado) {
        banner.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #F0FFF4, #C6F6D5);
        border: 2px solid #38A169;
        border-radius: 14px;
        padding: 20px 24px;
        margin-bottom: 16px;
        text-align: center;
      ">
        <div style="font-size: 36px; margin-bottom: 8px">🎉</div>
        <div style="font-size: 18px; font-weight: 800; color: #276749; margin-bottom: 4px">
          ¡Módulo Aprobado!
        </div>
        <div style="font-size: 14px; color: #2F855A">
          Obtuviste una tasa de detección del <strong>${tasaDeteccion}%</strong> — 
          superaste el mínimo requerido del ${minimo}%.
        </div>
      </div>
    `;
        btnVolverMenu.textContent = '← Volver al menú';
        btnVolverMenu.style.display = 'block';

    } else {
        banner.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #FFF5F5, #FED7D7);
        border: 2px solid #E53E3E;
        border-radius: 14px;
        padding: 20px 24px;
        margin-bottom: 16px;
        text-align: center;
      ">
        <div style="font-size: 36px; margin-bottom: 8px">📚</div>
        <div style="font-size: 18px; font-weight: 800; color: #9B2C2C; margin-bottom: 4px">
          Módulo No Aprobado
        </div>
        <div style="font-size: 14px; color: #C53030; margin-bottom: 16px">
          Obtuviste una tasa de detección del <strong>${tasaDeteccion}%</strong>. 
          Necesitas al menos el <strong>${minimo}%</strong> para aprobar.
          Repasa el material e inténtalo de nuevo.
        </div>
      </div>
    `;
        btnVolverMenu.textContent = '🔄 Reintentar módulo';
        btnVolverMenu.style.display = 'block';
        btnVolverMenu.onclick = () => reiniciarModuloActual();
    }

    btnVolverMenu.parentNode.insertBefore(banner, btnVolverMenu);
}

function reiniciarModuloActual() {
    const categoriaModulo = Simulator.escenarios[0]?.categoria || 'phishing';
    const moduloId = ['urgencia', 'autoridad', 'recompensa'].includes(categoriaModulo)
        ? 'phishing' : categoriaModulo;
    iniciarModulo(moduloId);
}

function volverAlMenu() {
    mostrarMenuEmpleado();
}