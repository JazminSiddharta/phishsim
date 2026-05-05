// js/claude.js
// Módulo de feedback dinámico con la API de Claude
// Genera retroalimentación personalizada según las decisiones del usuario

const ClaudeAI = (() => {

  // ── Genera feedback personalizado ──────────────────────
  const generarFeedback = async (escenario, decision, tiempo) => {
    const contenedor = document.getElementById('feedback-claude');
    const spinner    = document.getElementById('claude-spinner');
    if (!contenedor || !spinner) return;

    spinner.style.display  = 'block';
    contenedor.style.display = 'none';

    const velocidad = tiempo <= 5  ? 'muy rápida (posiblemente impulsiva)'
                    : tiempo <= 15 ? 'normal'
                    : 'reflexiva y cuidadosa';

    const contextoDecision = escenario.esPhishing
      ? decision === 'reportar' ? 'detectó correctamente el phishing y lo reportó'
      : decision === 'clic'     ? 'cayó en el ataque haciendo clic en el enlace malicioso'
      : 'ignoró el correo sin reportarlo'
      : decision === 'clic'     ? 'identificó correctamente que era un correo legítimo'
      : decision === 'reportar' ? 'cometió un falso positivo reportando un correo legítimo'
      : 'ignoró un correo legítimo';

    const prompt = `Eres un experto en ciberseguridad y psicología del comportamiento. 
Un usuario acaba de completar una simulación de phishing con estos resultados:

- Correo: "${escenario.asunto}"
- Remitente: ${escenario.remitente}
- Tipo: ${escenario.esPhishing ? 'Phishing real' : 'Correo legítimo'}
- Técnica usada: ${escenario.tecnica}
- Decisión del usuario: ${contextoDecision}
- Tiempo de decisión: ${tiempo} segundos (velocidad ${velocidad})

Genera un párrafo de retroalimentación personalizada de máximo 4 oraciones que:
1. Reconozca específicamente lo que hizo bien o mal
2. Explique brevemente por qué esta decisión importa en la vida real
3. Dé un consejo concreto y accionable basado en su velocidad de decisión
4. Use un tono empático, directo y educativo — no condescendiente

Responde SOLO con el párrafo, sin títulos ni listas.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages:   [{ role: 'user', content: prompt }]
        })
      });

      const data  = await response.json();
      const texto = data.content?.[0]?.text || '';

      spinner.style.display   = 'none';
      contenedor.style.display = 'block';
      contenedor.innerHTML     = `
        <div style="
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-radius: 10px;
          padding: 20px 24px;
          margin-top: 4px;
        ">
          <div style="
            font-size: 11px;
            color: rgba(255,255,255,0.4);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 10px;
          ">✨ Análisis personalizado por IA</div>
          <p style="
            color: rgba(255,255,255,0.9);
            font-size: 14px;
            line-height: 1.8;
            margin: 0;
          ">${texto}</p>
        </div>
      `;
    } catch (err) {
      spinner.style.display   = 'none';
      contenedor.style.display = 'block';
      contenedor.innerHTML     = `
        <p style="color:var(--gris); font-size:13px;">
          No se pudo conectar con el análisis de IA en este momento.
        </p>`;
      console.warn('Claude API error:', err);
    }
  };

  return { generarFeedback };

})();