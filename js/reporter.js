// js/reporter.js
// Módulo de generación de reporte PDF descargable
// Usa jsPDF para construir el reporte con el perfil de vulnerabilidad

const Reporter = (() => {

    // Colores corporativos
    const COLORES = {
        oscuro: [26, 26, 46],
        gris: [108, 117, 125],
        urgencia: [231, 76, 60],
        autoridad: [41, 128, 185],
        recompensa: [39, 174, 96],
        blanco: [255, 255, 255],
        fondo: [248, 249, 250]
    };

    // Dibuja un rectángulo con color de fondo
    const rect = (doc, x, y, w, h, color) => {
        doc.setFillColor(...color);
        doc.rect(x, y, w, h, 'F');
    };

    // Escribe texto con configuración
    const texto = (doc, txt, x, y, size, color, bold = false) => {
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.text(txt, x, y);
    };

    // Genera y descarga el PDF
    const generar = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const ancho = 210;
        const todas = Tracker.obtenerTodas();
        const total = todas.length;
        const phishing = todas.filter(d => d.esPhishing);
        const legitimos = todas.filter(d => !d.esPhishing);

        const caidas = Tracker.contarResultado('caida');
        const verdaderos = Tracker.contarResultado('verdadero_positivo');
        const falsos = Tracker.contarResultado('falso_positivo');
        const promedio = Tracker.tiempoPromedio();
        const impulsivas = Tracker.caídasImpulsivas();

        const pct = (p, t) => t === 0 ? 0 : Math.round((p / t) * 100);
        const tasaCaida = pct(caidas, phishing.length);
        const tasaDeteccion = pct(verdaderos, phishing.length);
        const tasaFalsos = pct(falsos, legitimos.length);

        // ── Encabezado ─────────────────────────────────────────
        rect(doc, 0, 0, ancho, 40, COLORES.oscuro);
        texto(doc, '🎣 PhishSim', 14, 14, 22, COLORES.blanco, true);
        texto(doc, 'Reporte de Perfil de Vulnerabilidad', 14, 22, 11, [180, 180, 200]);
        const fecha = new Date().toLocaleDateString('es-MX', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
        texto(doc, fecha, 14, 32, 9, [150, 150, 180]);

        // ── Perfil de riesgo ───────────────────────────────────
        let colorPerfil = COLORES.recompensa;
        let labelPerfil = '🛡️ Perfil Experto';
        if (tasaCaida > 33) {
            colorPerfil = COLORES.urgencia;
            labelPerfil = '🚨 Riesgo Alto';
        } else if (tasaCaida > 0) {
            colorPerfil = [230, 126, 34];
            labelPerfil = '⚠️ Riesgo Medio';
        } else if (tasaFalsos > 0) {
            colorPerfil = COLORES.autoridad;
            labelPerfil = '🔍 Perfil Precavido';
        }

        rect(doc, 14, 48, ancho - 28, 18, colorPerfil);
        texto(doc, labelPerfil, 20, 60, 13, COLORES.blanco, true);

        // ── Métricas globales ──────────────────────────────────
        let y = 76;
        texto(doc, 'Métricas Globales', 14, y, 13, COLORES.oscuro, true);
        y += 8;

        const metricas = [
            { label: 'Tasa de Caída', valor: `${tasaCaida}%`, desc: 'Phishing en los que hiciste clic' },
            { label: 'Tasa de Detección', valor: `${tasaDeteccion}%`, desc: 'Phishing que reportaste correctamente' },
            { label: 'Falsos Positivos', valor: `${tasaFalsos}%`, desc: 'Correos legítimos reportados como phishing' },
            { label: 'Tiempo Promedio', valor: `${promedio}s`, desc: 'Por correo evaluado' },
            { label: 'Caídas Impulsivas', valor: `${impulsivas}`, desc: 'Decisiones en menos de 5 segundos que resultaron en caída' }
        ];

        metricas.forEach((m, i) => {
            rect(doc, 14, y, ancho - 28, 14, i % 2 === 0 ? COLORES.fondo : COLORES.blanco);
            texto(doc, m.label, 20, y + 9, 10, COLORES.oscuro, true);
            texto(doc, m.valor, 110, y + 9, 10, COLORES.oscuro, true);
            texto(doc, m.desc, 130, y + 9, 8, COLORES.gris);
            y += 14;
        });

        // ── Susceptibilidad por categoría ──────────────────────
        y += 8;
        texto(doc, 'Susceptibilidad por Categoría', 14, y, 13, COLORES.oscuro, true);
        y += 8;

        const categorias = [
            { nombre: 'Urgencia', emoji: '⚡', color: COLORES.urgencia, id: 'urgencia' },
            { nombre: 'Autoridad', emoji: '🏛️', color: COLORES.autoridad, id: 'autoridad' },
            { nombre: 'Recompensa', emoji: '🎁', color: COLORES.recompensa, id: 'recompensa' }
        ];

        categorias.forEach(cat => {
            const dec = Tracker.porCategoria(cat.id).filter(d => d.esPhishing);
            const caidas = dec.filter(d => d.tipodecision === 'caida').length;
            const catPct = pct(caidas, dec.length);

            rect(doc, 14, y, ancho - 28, 16, COLORES.fondo);
            texto(doc, `${cat.nombre}`, 20, y + 10, 10, COLORES.oscuro, true);

            // Barra de progreso
            rect(doc, 70, y + 5, 80, 5, [220, 220, 220]);
            if (catPct > 0) rect(doc, 70, y + 5, 80 * (catPct / 100), 5, cat.color);

            texto(doc, `${catPct}%`, 158, y + 10, 10, cat.color, true);
            texto(doc, `${caidas} de ${dec.length} correos`, 170, y + 10, 8, COLORES.gris);
            y += 16;
        });

        // ── Tabla de decisiones ────────────────────────────────
        y += 10;
        texto(doc, 'Resumen de Decisiones', 14, y, 13, COLORES.oscuro, true);
        y += 8;

        // Header tabla
        rect(doc, 14, y, ancho - 28, 10, COLORES.oscuro);
        texto(doc, '#', 16, y + 7, 8, COLORES.blanco, true);
        texto(doc, 'Tipo', 22, y + 7, 8, COLORES.blanco, true);
        texto(doc, 'Categoría', 50, y + 7, 8, COLORES.blanco, true);
        texto(doc, 'Decisión', 90, y + 7, 8, COLORES.blanco, true);
        texto(doc, 'Tiempo', 140, y + 7, 8, COLORES.blanco, true);
        texto(doc, 'Resultado', 160, y + 7, 8, COLORES.blanco, true);
        y += 10;

        const iconosRes = {
            caida: 'Caída',
            verdadero_positivo: 'Detectado',
            ignorado: 'Ignorado',
            verdadero_negativo: 'Correcto',
            falso_positivo: 'Falso +',
            ignorado_legitimo: 'Ignorado'
        };

        todas.forEach((d, i) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            rect(doc, 14, y, ancho - 28, 10, i % 2 === 0 ? COLORES.fondo : COLORES.blanco);
            texto(doc, `${d.id}`, 16, y + 7, 8, COLORES.oscuro);
            texto(doc, d.esPhishing ? 'Phishing' : 'Real', 22, y + 7, 8, COLORES.oscuro);
            texto(doc, d.categoria, 50, y + 7, 8, COLORES.oscuro);
            texto(doc, d.decision, 90, y + 7, 8, COLORES.oscuro);
            texto(doc, `${d.tiempo}s`, 140, y + 7, 8, COLORES.oscuro);
            texto(doc, iconosRes[d.tipodecision] || '-', 160, y + 7, 8,
                d.correcta ? COLORES.recompensa : COLORES.urgencia, true);
            y += 10;
        });

        // ── Pie de página ──────────────────────────────────────
        rect(doc, 0, 282, ancho, 15, COLORES.oscuro);
        texto(doc, 'PhishSim — Plataforma de Simulación de Phishing · UAQ · Seguridad de la Información',
            14, 291, 7, [150, 150, 180]);

        // Descargar
        doc.save(`PhishSim_Reporte_${Date.now()}.pdf`);
    };

    return { generar };

})();