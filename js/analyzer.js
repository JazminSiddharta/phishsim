// js/analyzer.js
// Módulo de análisis de headers de correo real
// El usuario pega un header y PhishSim lo analiza automáticamente

const Analyzer = (() => {

    // ── Indicadores de riesgo ──────────────────────────────
    const INDICADORES = [
        {
            id: 'spf',
            nombre: 'SPF (Sender Policy Framework)',
            descripcion: 'Verifica que el servidor que envió el correo está autorizado por el dominio.',
            detectar: (header) => {
                const spf = header.match(/spf=(\w+)/i);
                if (!spf) return { estado: 'desconocido', mensaje: 'No se encontró registro SPF.' };
                if (spf[1].toLowerCase() === 'pass') return { estado: 'seguro', mensaje: 'SPF válido — el servidor está autorizado.' };
                return { estado: 'peligro', mensaje: `SPF falló (${spf[1]}) — el servidor NO está autorizado.` };
            }
        },
        {
            id: 'dkim',
            nombre: 'DKIM (DomainKeys Identified Mail)',
            descripcion: 'Firma criptográfica que verifica que el correo no fue alterado en tránsito.',
            detectar: (header) => {
                const dkim = header.match(/dkim=(\w+)/i);
                if (!dkim) return { estado: 'desconocido', mensaje: 'No se encontró firma DKIM.' };
                if (dkim[1].toLowerCase() === 'pass') return { estado: 'seguro', mensaje: 'DKIM válido — el correo no fue alterado.' };
                return { estado: 'peligro', mensaje: `DKIM falló (${dkim[1]}) — el correo pudo ser modificado.` };
            }
        },
        {
            id: 'dmarc',
            nombre: 'DMARC (Domain-based Message Authentication)',
            descripcion: 'Política que combina SPF y DKIM para proteger el dominio del remitente.',
            detectar: (header) => {
                const dmarc = header.match(/dmarc=(\w+)/i);
                if (!dmarc) return { estado: 'desconocido', mensaje: 'No se encontró política DMARC.' };
                if (dmarc[1].toLowerCase() === 'pass') return { estado: 'seguro', mensaje: 'DMARC válido — el dominio está protegido.' };
                return { estado: 'peligro', mensaje: `DMARC falló (${dmarc[1]}) — posible suplantación de dominio.` };
            }
        },
        {
            id: 'reply_to',
            nombre: 'Reply-To sospechoso',
            descripcion: 'Si el Reply-To es diferente al From, las respuestas van a un dominio distinto.',
            detectar: (header) => {
                const from = header.match(/^From:.*?<?([\w.\-+]+@[\w.\-]+)>?/im);
                const replyTo = header.match(/^Reply-To:.*?<?([\w.\-+]+@[\w.\-]+)>?/im);
                if (!replyTo) return { estado: 'seguro', mensaje: 'No hay Reply-To — las respuestas van al remitente original.' };
                if (!from) return { estado: 'desconocido', mensaje: 'No se pudo extraer el remitente.' };
                const domFrom = from[1].split('@')[1]?.toLowerCase();
                const domReply = replyTo[1].split('@')[1]?.toLowerCase();
                if (domFrom === domReply) return { estado: 'seguro', mensaje: `Reply-To coincide con el dominio del remitente (${domFrom}).` };
                return { estado: 'peligro', mensaje: `Reply-To apunta a un dominio diferente: ${domReply} vs ${domFrom}.` };
            }
        },
        {
            id: 'received',
            nombre: 'Ruta de servidores (Received)',
            descripcion: 'Muestra los servidores por los que pasó el correo. Rutas largas o inusuales son sospechosas.',
            detectar: (header) => {
                const received = header.match(/^Received:/gim);
                if (!received) return { estado: 'desconocido', mensaje: 'No se encontraron registros Received.' };
                if (received.length <= 3) return { estado: 'seguro', mensaje: `Ruta normal — pasó por ${received.length} servidor(es).` };
                return { estado: 'advertencia', mensaje: `Ruta larga — pasó por ${received.length} servidores. Puede ser normal en empresas grandes.` };
            }
        },
        {
            id: 'dominio',
            nombre: 'Dominio del remitente',
            descripcion: 'Analiza si el dominio del remitente parece legítimo o usa trucos de typosquatting.',
            detectar: (header) => {
                const from = header.match(/^From:.*?<?([\w.\-+]+@[\w.\-]+\.\w+)>?/im);
                if (!from) return { estado: 'desconocido', mensaje: 'No se pudo extraer el dominio del remitente.' };
                const dominio = from[1].split('@')[1]?.toLowerCase();

                // Patrones sospechosos
                const patronesSospechosos = [
                    { regex: /-(mx|mexico|seguridad|alerta|soporte|noreply)\./i, msg: 'El dominio contiene palabras añadidas sospechosas.' },
                    { regex: /\d{3,}/, msg: 'El dominio contiene números inusuales.' },
                    { regex: /\.xyz$|\.top$|\.click$|\.loan$/i, msg: 'TLD de alto riesgo detectado.' },
                    { regex: /gob\.mx/i, msg: null }
                ];

                for (const p of patronesSospechosos) {
                    if (p.regex.test(dominio) && p.msg) {
                        return { estado: 'peligro', mensaje: `Dominio sospechoso (${dominio}): ${p.msg}` };
                    }
                }
                return { estado: 'seguro', mensaje: `Dominio aparentemente legítimo: ${dominio}` };
            }
        }
    ];

    // ── Calcular puntuación de riesgo ──────────────────────
    const calcularRiesgo = (resultados) => {
        const peligros = resultados.filter(r => r.estado === 'peligro').length;
        const advertencias = resultados.filter(r => r.estado === 'advertencia').length;
        const score = peligros * 2 + advertencias;

        if (score === 0) return { nivel: 'Bajo', clase: 'seguro', emoji: '🛡️', descripcion: 'No se detectaron señales de phishing en este header.' };
        if (score <= 2) return { nivel: 'Medio', clase: 'advertencia', emoji: '⚠️', descripcion: 'Se detectaron algunas señales sospechosas. Procede con precaución.' };
        return { nivel: 'Alto', clase: 'peligro', emoji: '🚨', descripcion: 'Múltiples señales de phishing detectadas. Este correo es probablemente malicioso.' };
    };

    // ── Analizar header ────────────────────────────────────
    const analizar = () => {
        const header = document.getElementById('analyzer-input').value.trim();
        if (!header) {
            alert('Por favor pega el header de un correo para analizar.');
            return;
        }

        const resultados = INDICADORES.map(ind => ({
            ...ind,
            ...ind.detectar(header)
        }));

        const riesgo = calcularRiesgo(resultados);
        renderizarResultados(resultados, riesgo);
    };

    // ── Renderizar resultados ──────────────────────────────
    const renderizarResultados = (resultados, riesgo) => {
        const contenedor = document.getElementById('analyzer-resultados');

        const colores = {
            seguro: { bg: '#eafaf1', color: '#27ae60', emoji: '✅' },
            peligro: { bg: '#fdecea', color: '#e74c3c', emoji: '🚨' },
            advertencia: { bg: '#fff9e6', color: '#e67e22', emoji: '⚠️' },
            desconocido: { bg: '#f8f9fa', color: '#6c757d', emoji: '❓' }
        };

        const tarjetas = resultados.map(r => {
            const c = colores[r.estado] || colores.desconocido;
            return `
        <div style="
          background: ${c.bg};
          border-left: 4px solid ${c.color};
          border-radius: 8px;
          padding: 14px 18px;
          margin-bottom: 10px;
        ">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span style="font-size:18px">${c.emoji}</span>
            <strong style="color:${c.color}; font-size:14px">${r.nombre}</strong>
          </div>
          <p style="font-size:13px; color:#555; margin:4px 0">${r.descripcion}</p>
          <p style="font-size:13px; color:${c.color}; font-weight:600; margin:0">${r.mensaje}</p>
        </div>
      `;
        }).join('');

        const riesgoColores = {
            seguro: '#27ae60',
            advertencia: '#e67e22',
            peligro: '#e74c3c'
        };

        contenedor.innerHTML = `
      <div style="
        background: ${riesgoColores[riesgo.clase]};
        color: white;
        border-radius: 10px;
        padding: 20px 24px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
      ">
        <span style="font-size:36px">${riesgo.emoji}</span>
        <div>
          <div style="font-size:18px; font-weight:800">Riesgo ${riesgo.nivel}</div>
          <div style="font-size:13px; opacity:0.9">${riesgo.descripcion}</div>
        </div>
      </div>
      ${tarjetas}
    `;

        contenedor.style.display = 'block';
    };

    // ── Header de ejemplo para demo ────────────────────────
    const cargarEjemplo = () => {
        document.getElementById('analyzer-input').value =
            `Delivered-To: usuario@gmail.com
Received: from mail-sor-f41.google.com by mx.google.com
Received: from mx1.bancoseguro-mx.com by mail-sor-f41.google.com
Received: from smtp.bancoseguro-mx.com by mx1.bancoseguro-mx.com
Authentication-Results: mx.google.com;
  dkim=fail (signature verification failed) header.d=bancoseguro-mx.com;
  spf=fail (domain of noreply@bancoseguro-mx.com does not designate) smtp.mailfrom=noreply@bancoseguro-mx.com;
  dmarc=fail p=none header.from=bancoseguro-mx.com
From: Banco Seguro México <noreply@bancoseguro-mx.com>
Reply-To: soporte@help-bancoseguro.net
To: usuario@gmail.com
Subject: Tu cuenta ha sido suspendida`;
    };

    return { analizar, cargarEjemplo };

})();