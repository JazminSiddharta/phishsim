// js/gamification.js
// Módulo de gamificación
// Maneja score, temporizador, racha e insignias

const Gamification = {

    // ── Estado ────────────────────────────────────────────────────────────
    score: 0,
    racha: 0,
    tiempoLimite: 60,
    timerInterval: null,
    tiempoRestante: 60,
    bonusTiempo: false,

    // ── Puntaje por decisión ──────────────────────────────────────────────
    PUNTOS: {
        reportar: {
            basico: 100,
            intermedio: 150,
            avanzado: 200,
        },
        ignorar: {
            basico: 20,
            intermedio: 20,
            avanzado: 20,
        },
        clic: 0,
    },

    // ── Insignias disponibles ─────────────────────────────────────────────
    INSIGNIAS: [
        {
            id: 'ojo_aguila',
            emoji: '🦅',
            nombre: 'Ojo de Águila',
            desc: 'Detectaste correctamente todos los correos',
            condicion: (stats) => stats.reportes === stats.total,
        },
        {
            id: 'guardian',
            emoji: '🛡️',
            nombre: 'Guardián Digital',
            desc: 'Detectaste correctamente más del 75% de los correos',
            condicion: (stats) => stats.reportes / stats.total >= 0.75,
        },
        {
            id: 'racha_fuego',
            emoji: '🔥',
            nombre: 'En Llamas',
            desc: 'Tuviste una racha de 5 o más aciertos consecutivos',
            condicion: (stats) => stats.rachaMax >= 5,
        },
        {
            id: 'rapido',
            emoji: '⚡',
            nombre: 'Reacción Rápida',
            desc: 'Respondiste correctamente en menos de 10 segundos en al menos 3 ocasiones',
            condicion: (stats) => stats.respuestasRapidas >= 3,
        },
        {
            id: 'entrenamiento',
            emoji: '📚',
            nombre: 'En Entrenamiento',
            desc: 'Completaste la capacitación — ¡el primer paso es el más importante!',
            condicion: (stats) => stats.total > 0,
        },
    ],

    // ── Estado interno para calcular insignias ────────────────────────────
    stats: {
        total: 0,
        reportes: 0,
        rachaMax: 0,
        rachaActual: 0,
        respuestasRapidas: 0,
    },

    // ══════════════════════════════════════════════════════════════════════
    //  INICIALIZAR
    // ══════════════════════════════════════════════════════════════════════

    inicializar() {
        this.score = 0;
        this.racha = 0;
        this.tiempoRestante = this.tiempoLimite;
        this.stats = {
            total: 0, reportes: 0,
            rachaMax: 0, rachaActual: 0,
            respuestasRapidas: 0,
        };
        this.actualizarHUD();
        console.log('✅ Gamification inicializado');
    },

    // ══════════════════════════════════════════════════════════════════════
    //  TEMPORIZADOR
    // ══════════════════════════════════════════════════════════════════════

    iniciarTimer() {
        this.detenerTimer();
        this.tiempoRestante = this.tiempoLimite;
        this.actualizarTimer();

        this.timerInterval = setInterval(() => {
            this.tiempoRestante--;
            this.actualizarTimer();

            if (this.tiempoRestante <= 0) {
                this.detenerTimer();
                // Tiempo agotado — forzar decisión de ignorar
                registrarDecision('ignorar');
            }
        }, 1000);
    },

    detenerTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    actualizarTimer() {
        const el = document.getElementById('timer-display');
        if (!el) return;

        el.textContent = `⏱️ ${this.tiempoRestante}s`;

        // Color según tiempo restante
        if (this.tiempoRestante <= 10) {
            el.className = 'timer-display timer-urgente';
        } else if (this.tiempoRestante <= 20) {
            el.className = 'timer-display timer-advertencia';
        } else {
            el.className = 'timer-display timer-normal';
        }
    },

    // ══════════════════════════════════════════════════════════════════════
    //  SCORE Y RACHA
    // ══════════════════════════════════════════════════════════════════════

    registrarDecision(decision, nivel) {
        const tiempoUsado = this.tiempoLimite - this.tiempoRestante;
        this.detenerTimer();
        this.stats.total++;

        // Calcular puntos
        let puntos = 0;
        if (decision === 'reportar') {
            puntos = this.PUNTOS.reportar[nivel] || 100;

            // Bonus por velocidad — respondió en menos de 10 segundos
            if (tiempoUsado < 10) {
                puntos += 50;
                this.stats.respuestasRapidas++;
                this.mostrarBonus('+50 ⚡ Bonus velocidad');
            }

            this.stats.reportes++;
            this.stats.rachaActual++;
            if (this.stats.rachaActual > this.stats.rachaMax) {
                this.stats.rachaMax = this.stats.rachaActual;
            }
            this.racha = this.stats.rachaActual;

        } else {
            puntos = decision === 'ignorar' ? 20 : 0;
            this.stats.rachaActual = 0;
            this.racha = 0;
        }

        this.score += puntos;
        this.actualizarHUD();

        // Mostrar puntos ganados
        if (puntos > 0) this.mostrarPuntosGanados(puntos, decision);

        return puntos;
    },

    // ══════════════════════════════════════════════════════════════════════
    //  HUD (Score + Racha en pantalla)
    // ══════════════════════════════════════════════════════════════════════

    actualizarHUD() {
        const scoreEl = document.getElementById('hud-score');
        const rachaEl = document.getElementById('hud-racha');
        if (scoreEl) scoreEl.textContent = `⭐ ${this.score} pts`;
        if (rachaEl) {
            rachaEl.textContent = this.racha >= 2 ? `🔥 Racha x${this.racha}` : '';
            rachaEl.style.display = this.racha >= 2 ? 'block' : 'none';
        }
    },

    // ── Animación de puntos ganados ───────────────────────────────────────
    mostrarPuntosGanados(puntos, decision) {
        const hud = document.getElementById('hud-contenedor');
        if (!hud) return;

        const el = document.createElement('div');
        el.className = `puntos-flotantes ${decision === 'reportar' ? 'puntos-verde' : 'puntos-amarillo'}`;
        el.textContent = `+${puntos}`;
        hud.appendChild(el);

        setTimeout(() => el.remove(), 1500);
    },

    mostrarBonus(texto) {
        const hud = document.getElementById('hud-contenedor');
        if (!hud) return;

        const el = document.createElement('div');
        el.className = 'bonus-flotante';
        el.textContent = texto;
        hud.appendChild(el);

        setTimeout(() => el.remove(), 2000);
    },

    // ══════════════════════════════════════════════════════════════════════
    //  INSIGNIAS
    // ══════════════════════════════════════════════════════════════════════

    calcularInsignias() {
        return this.INSIGNIAS.filter(i => i.condicion(this.stats));
    },

    renderizarInsignias(contenedorId) {
        const insignias = this.calcularInsignias();
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return;

        if (insignias.length === 0) {
            contenedor.innerHTML = '<p style="color:var(--gris); font-size:14px">No obtuviste insignias esta vez. ¡Inténtalo de nuevo!</p>';
            return;
        }

        contenedor.innerHTML = insignias.map(i => `
      <div class="insignia-card">
        <div class="insignia-emoji">${i.emoji}</div>
        <div class="insignia-info">
          <div class="insignia-nombre">${i.nombre}</div>
          <div class="insignia-desc">${i.desc}</div>
        </div>
      </div>
    `).join('');
    },

    // ══════════════════════════════════════════════════════════════════════
    //  PANTALLA DE TRANSICIÓN ENTRE CATEGORÍAS
    // ══════════════════════════════════════════════════════════════════════

    mostrarTransicion(categoriaAnterior, categoriaSiguiente, callback) {
        const mensajes = {
            autoridad: '¡Bien hecho! Ahora vienen ataques de Autoridad — más difíciles de detectar.',
            recompensa: '¡Excelente! Ahora vienen ataques de Recompensa — cuidado con las ofertas tentadoras.',
            contrasenas: '¡Vas muy bien! Ahora evaluamos tus conocimientos sobre Contraseñas.',
            redes_sociales: '¡Sigue así! Ahora vienen escenarios de Redes Sociales.',
            malware: '¡Casi terminas! La última categoría: Malware. ¡Mucho ánimo!',
        };

        const mensaje = mensajes[categoriaSiguiente];
        if (!mensaje) {
            callback();
            return;
        }

        const overlay = document.getElementById('transicion-overlay');
        if (!overlay) {
            callback();
            return;
        }

        document.getElementById('transicion-mensaje').textContent = mensaje;
        document.getElementById('transicion-score').textContent =
            `Tu score actual: ⭐ ${this.score} pts`;
        overlay.style.display = 'flex';

        setTimeout(() => {
            overlay.style.display = 'none';
            callback();
        }, 2500);
    },
};

console.log('✅ Gamification cargado correctamente');