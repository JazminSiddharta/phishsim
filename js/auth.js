// js/auth.js
// Módulo de autenticación de empleados
// Maneja login, registro y validación de usuarios

const Auth = {

    // ── Clave en localStorage ─────────────────────────────────────────────
    STORAGE_KEY: 'secureaware_empleados',

    // ══════════════════════════════════════════════════════════════════════
    //  EMPLEADOS REGISTRADOS
    // ══════════════════════════════════════════════════════════════════════

    obtenerEmpleados() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    guardarEmpleados(empleados) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(empleados));
    },

    // ══════════════════════════════════════════════════════════════════════
    //  REGISTRO DE EMPLEADO
    // ══════════════════════════════════════════════════════════════════════

    registrarEmpleado(nombre, numEmpleado, departamento) {
        const empleados = this.obtenerEmpleados();

        // Verificar que el número de empleado no exista
        const existe = empleados.find(
            e => e.numEmpleado.toLowerCase() === numEmpleado.toLowerCase()
        );
        if (existe) {
            return { ok: false, error: 'Ya existe un empleado con ese número. Contacta al administrador.' };
        }

        // Registrar empleado
        const nuevoEmpleado = {
            nombre,
            numEmpleado,
            departamento,
            fechaRegistro: new Date().toISOString(),
            capacitacionesHechas: [],
        };

        empleados.push(nuevoEmpleado);
        this.guardarEmpleados(empleados);
        return { ok: true, empleado: nuevoEmpleado };
    },

    // ══════════════════════════════════════════════════════════════════════
    //  LOGIN DE EMPLEADO
    // ══════════════════════════════════════════════════════════════════════

    loginEmpleado(numEmpleado, password, departamento) {
        // Verificar contraseña del departamento
        const passwordCorrecta = Config.verificarPasswordDepartamento(departamento, password);
        if (!passwordCorrecta) {
            return { ok: false, error: 'Usuario o contraseña incorrectos.' };
        }

        // Buscar empleado registrado
        const empleados = this.obtenerEmpleados();
        const empleado = empleados.find(
            e => e.numEmpleado.toLowerCase() === numEmpleado.toLowerCase()
                && e.departamento === departamento
        );

        if (!empleado) {
            return { ok: false, error: 'Usuario o contraseña incorrectos.' };
        }

        return { ok: true, empleado };
    },

    // ══════════════════════════════════════════════════════════════════════
    //  VERIFICAR SI ES PRIMERA VEZ
    // ══════════════════════════════════════════════════════════════════════

    esPrimeraVez(numEmpleado) {
        const empleados = this.obtenerEmpleados();
        return !empleados.find(e => e.numEmpleado.toLowerCase() === numEmpleado.toLowerCase());
    },

    // ══════════════════════════════════════════════════════════════════════
    //  MARCAR CAPACITACIÓN COMPLETADA
    // ══════════════════════════════════════════════════════════════════════

    marcarCapacitacion(numEmpleado, categoria) {
        const empleados = this.obtenerEmpleados();
        const empleado = empleados.find(
            e => e.numEmpleado.toLowerCase() === numEmpleado.toLowerCase()
        );

        if (!empleado) return;

        if (!empleado.capacitacionesHechas.includes(categoria)) {
            empleado.capacitacionesHechas.push(categoria);
            this.guardarEmpleados(empleados);
        }
    },

    obtenerCapacitacionesHechas(numEmpleado) {
        const empleados = this.obtenerEmpleados();
        const empleado = empleados.find(
            e => e.numEmpleado.toLowerCase() === numEmpleado.toLowerCase()
        );
        return empleado ? empleado.capacitacionesHechas : [];
    },

    // ══════════════════════════════════════════════════════════════════════
    //  PROGRESO GENERAL DEL EMPLEADO
    // ══════════════════════════════════════════════════════════════════════

    calcularProgreso(numEmpleado) {
        const categorias = ['phishing', 'contrasenas', 'redes_sociales', 'malware'];
        const hechas = this.obtenerCapacitacionesHechas(numEmpleado);
        return {
            total: categorias.length,
            completadas: hechas.length,
            porcentaje: Math.round((hechas.length / categorias.length) * 100),
            categorias: categorias.map(cat => ({
                id: cat,
                completada: hechas.includes(cat),
            })),
        };
    },
};

console.log('✅ Auth cargado correctamente');