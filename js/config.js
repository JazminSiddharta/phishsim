// js/config.js
// Módulo de configuración organizacional
// Maneja departamentos, contraseñas y setup inicial de la empresa

const Config = {

    // ── Clave en localStorage ─────────────────────────────────────────────
    STORAGE_KEY: 'secureaware_config',

    // ── Configuración por defecto ─────────────────────────────────────────
    DEFAULT: {
        empresa: '',
        configurada: false,
        departamentos: [],
        adminPassword: 'admin123',
    },

    // ══════════════════════════════════════════════════════════════════════
    //  LEER Y GUARDAR CONFIG
    // ══════════════════════════════════════════════════════════════════════

    obtener() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : { ...this.DEFAULT };
        } catch {
            return { ...this.DEFAULT };
        }
    },

    guardar(config) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    },

    estaConfigurada() {
        return this.obtener().configurada === true;
    },

    // ══════════════════════════════════════════════════════════════════════
    //  DEPARTAMENTOS
    // ══════════════════════════════════════════════════════════════════════

    obtenerDepartamentos() {
        return this.obtener().departamentos || [];
    },

    agregarDepartamento(nombre, password) {
        const config = this.obtener();

        // Verificar que no exista ya
        const existe = config.departamentos.find(
            d => d.nombre.toLowerCase() === nombre.toLowerCase()
        );
        if (existe) return { ok: false, error: 'Ya existe un departamento con ese nombre.' };

        config.departamentos.push({ nombre, password });
        this.guardar(config);
        return { ok: true };
    },

    eliminarDepartamento(nombre) {
        const config = this.obtener();
        config.departamentos = config.departamentos.filter(d => d.nombre !== nombre);
        this.guardar(config);
    },

    verificarPasswordDepartamento(nombreDepto, password) {
        const deptos = this.obtenerDepartamentos();
        const depto = deptos.find(d => d.nombre === nombreDepto);
        if (!depto) return false;
        return depto.password === password;
    },

    // ══════════════════════════════════════════════════════════════════════
    //  EMPRESA
    // ══════════════════════════════════════════════════════════════════════

    obtenerNombreEmpresa() {
        return this.obtener().empresa || 'Mi Empresa';
    },

    // ══════════════════════════════════════════════════════════════════════
    //  ADMIN PASSWORD
    // ══════════════════════════════════════════════════════════════════════

    verificarAdminPassword(password) {
        return this.obtener().adminPassword === password;
    },

    // ══════════════════════════════════════════════════════════════════════
    //  FINALIZAR SETUP INICIAL
    // ══════════════════════════════════════════════════════════════════════

    finalizarSetup(nombreEmpresa, adminPassword) {
        const config = this.obtener();
        config.empresa = nombreEmpresa;
        config.adminPassword = adminPassword;
        config.configurada = true;
        this.guardar(config);
    },

    // ══════════════════════════════════════════════════════════════════════
    //  RESET TOTAL (para demos)
    // ══════════════════════════════════════════════════════════════════════

    resetTotal() {
  localStorage.removeItem(this.STORAGE_KEY);
  localStorage.removeItem('secureaware_resultados');
  localStorage.removeItem('secureaware_empleados');
  console.log('🗑️ Sistema reseteado completamente');
},
};

console.log('✅ Config cargado correctamente');