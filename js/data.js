// js/data.js
// Base de datos de escenarios de phishing simulados
// Cada escenario representa un ataque real documentado

const PHISHING_SCENARIOS = [

  // ════════════════════════════════════════
  //  CATEGORÍA 1: URGENCIA
  // ════════════════════════════════════════

  {
    id: 1,
    categoria: "urgencia",
    nivel: "basico",
    nivelLabel: "Básico",
    asunto: "⚠️ Tu cuenta bancaria ha sido SUSPENDIDA",
    remitente: "seguridad@bancoseguro-mx.com",
    remitenteNombre: "Banco Seguro México",
    cuerpo: `
      <p>Estimado cliente,</p>
      <p>Hemos detectado <strong>actividad inusual</strong> en tu cuenta. Por tu seguridad, 
      hemos <strong>suspendido temporalmente</strong> el acceso a tus fondos.</p>
      <p>Para reactivar tu cuenta debes verificar tu identidad 
      <strong>antes de las próximas 24 horas</strong>, de lo contrario tu cuenta 
      será cancelada permanentemente.</p>
      <p>Haz clic en el botón de abajo para verificar tu identidad:</p>
    `,
    tecnica: "Miedo + Urgencia temporal",
    esPhishing: true,
    dificultad: 1,
    senalesAlerta: [
      "El dominio del remitente es 'bancoseguro-mx.com' — los bancos reales usan sus dominios oficiales conocidos",
      "Los bancos NUNCA suspenden cuentas por correo electrónico sin contacto previo",
      "El plazo de 24 horas es una táctica de presión para que no pienses con calma",
      "Amenaza de consecuencias graves (cancelación permanente) para provocar pánico",
      "Uso excesivo de negritas y mayúsculas para generar urgencia visual"
    ],
    explicacion: "Este correo usa la técnica de urgencia combinada con miedo. Al amenazar con cancelar tu cuenta, el atacante busca que actúes sin pensar. Los bancos reales nunca te piden verificar tu identidad por correo con plazos tan cortos.",
    consejos: [
      "Ante cualquier correo de tu banco, llama directamente al número oficial de tu tarjeta",
      "Nunca hagas clic en enlaces de correos que generen urgencia o miedo",
      "Verifica siempre el dominio completo del remitente"
    ]
  },

  {
    id: 2,
    categoria: "urgencia",
    nivel: "intermedio",
    nivelLabel: "Intermedio",
    asunto: "Alerta: Inicio de sesión sospechoso detectado en tu cuenta",
    remitente: "no-reply@seguridad.banamex-alertas.com",
    remitenteNombre: "Banamex Seguridad",
    cuerpo: `
      <p>Hola,</p>
      <p>Detectamos un intento de inicio de sesión desde un dispositivo no reconocido:</p>
      <ul>
        <li><strong>Ubicación:</strong> Moscú, Rusia</li>
        <li><strong>Dispositivo:</strong> Windows 11 — Chrome</li>
        <li><strong>Hora:</strong> Hoy, 03:14 AM</li>
      </ul>
      <p>Si NO fuiste tú, debes asegurar tu cuenta <strong>inmediatamente</strong>. 
      Tu acceso será bloqueado en <strong>30 minutos</strong> si no confirmas tu identidad.</p>
    `,
    tecnica: "Miedo + Autoridad bancaria + Urgencia extrema",
    esPhishing: true,
    dificultad: 2,
    senalesAlerta: [
      "El dominio es 'banamex-alertas.com' — Banamex real usa banamex.com únicamente",
      "Los detalles técnicos específicos (Moscú, hora exacta) son para dar falsa credibilidad",
      "30 minutos de plazo es manipulación psicológica extrema",
      "Las alertas reales de seguridad no piden que hagas clic — te piden llamar"
    ],
    explicacion: "Este correo es más sofisticado porque incluye detalles técnicos que parecen legítimos (ubicación, dispositivo, hora). Estos datos son inventados pero generan credibilidad. La urgencia extrema de 30 minutos impide que la víctima verifique la información.",
    consejos: [
      "Los detalles técnicos específicos en un correo NO garantizan que sea legítimo",
      "Ante alertas de seguridad, entra directamente a la app oficial de tu banco",
      "Busca en Google el número oficial de tu banco y llama"
    ]
  },

  {
    id: 3,
    categoria: "urgencia",
    nivel: "avanzado",
    nivelLabel: "Avanzado",
    asunto: "Acción requerida: Verificación obligatoria de cuenta — SAT México",
    remitente: "notificaciones@sat-gobierno.mx",
    remitenteNombre: "Servicio de Administración Tributaria",
    cuerpo: `
      <p>Contribuyente,</p>
      <p>De acuerdo con el <strong>Artículo 17-D del Código Fiscal de la Federación</strong>, 
      su e.firma y contraseña del portal del SAT requieren verificación obligatoria 
      antes del <strong>fin del mes en curso</strong>.</p>
      <p>La no verificación resultará en la <strong>suspensión de su RFC</strong> y posibles 
      sanciones económicas de hasta <strong>$87,000 MXN</strong>.</p>
      <p>Este proceso toma menos de 3 minutos y es completamente seguro.</p>
    `,
    tecnica: "Autoridad gubernamental + Urgencia + Miedo a sanciones legales",
    esPhishing: true,
    dificultad: 3,
    senalesAlerta: [
      "El SAT usa sat.gob.mx — el dominio sat-gobierno.mx es falso",
      "Cita artículos legales reales para dar falsa legitimidad",
      "Las multas específicas ($87,000) son inventadas para intimidar",
      "El SAT NUNCA solicita credenciales por correo electrónico",
      "Pide tu e.firma, que es la credencial más sensible que existe"
    ],
    explicacion: "Este es el escenario más peligroso porque combina autoridad gubernamental, lenguaje legal real y amenazas económicas específicas. Muchas personas caen porque citar el Código Fiscal genera una percepción de legitimidad muy fuerte.",
    consejos: [
      "El SAT solo se comunica por sat.gob.mx — cualquier otro dominio es falso",
      "Nunca entregues tu e.firma a nadie, ni siquiera al SAT por correo",
      "Ante dudas fiscales, llama al SAT al 55 627 22 728"
    ]
  },

  // ════════════════════════════════════════
  //  CATEGORÍA 2: AUTORIDAD
  // ════════════════════════════════════════

  {
    id: 4,
    categoria: "autoridad",
    nivel: "basico",
    nivelLabel: "Básico",
    asunto: "TI Corporativo: Actualización obligatoria de contraseña",
    remitente: "it-soporte@empresa-sistemas.net",
    remitenteNombre: "Soporte TI Corporativo",
    cuerpo: `
      <p>Estimado usuario,</p>
      <p>El departamento de <strong>Tecnologías de la Información</strong> le informa que 
      su contraseña corporativa ha <strong>expirado</strong>.</p>
      <p>Para mantener el acceso a los sistemas de la empresa, debe actualizarla 
      en las próximas <strong>48 horas</strong>.</p>
      <p>Haga clic en el siguiente enlace para actualizar su contraseña de forma segura:</p>
    `,
    tecnica: "Autoridad institucional interna",
    esPhishing: true,
    dificultad: 1,
    senalesAlerta: [
      "El dominio 'empresa-sistemas.net' no corresponde al dominio real de tu organización",
      "TI real nunca pide cambiar contraseñas por correo — usa sistemas internos",
      "El enlace lleva a un sitio externo, no al portal interno de la empresa",
      "No menciona el nombre de la empresa ni del empleado específicamente"
    ],
    explicacion: "Este ataque explota la autoridad del departamento de TI, a quien los empleados están acostumbrados a obedecer sin cuestionar. Es uno de los ataques más efectivos en entornos corporativos.",
    consejos: [
      "Los cambios de contraseña corporativos siempre ocurren a través de sistemas internos conocidos",
      "Ante cualquier solicitud de TI por correo, verifica llamando directamente al equipo",
      "Nunca ingreses credenciales corporativas en sitios externos"
    ]
  },

  {
    id: 5,
    categoria: "autoridad",
    nivel: "intermedio",
    nivelLabel: "Intermedio",
    asunto: "Recursos Humanos: Documento urgente pendiente de firma",
    remitente: "rrhh@corporativo-documentos.com",
    remitenteNombre: "Recursos Humanos — RRHH",
    cuerpo: `
      <p>Hola,</p>
      <p>El área de <strong>Recursos Humanos</strong> ha generado un documento importante 
      que requiere tu firma digital para procesar tu <strong>nómina del mes</strong>.</p>
      <p>Este documento incluye actualizaciones a tu contrato relacionadas con 
      los nuevos <strong>beneficios corporativos 2025</strong>.</p>
      <p>Si no firmas antes del <strong>viernes</strong>, el procesamiento de tu 
      pago podría retrasarse.</p>
    `,
    tecnica: "Autoridad + Compromiso + Amenaza económica personal",
    esPhishing: true,
    dificultad: 2,
    senalesAlerta: [
      "Dominio 'corporativo-documentos.com' es genérico, no el de tu empresa",
      "Amenaza con retrasar tu nómina — toca directamente tu estabilidad económica",
      "RRHH real usa sistemas de firma digital internos como DocuSign con acceso verificado",
      "No especifica tu nombre, empresa ni los detalles del supuesto documento"
    ],
    explicacion: "Este ataque es muy efectivo porque toca algo personal: tu sueldo. La combinación de autoridad de RRHH más la amenaza de retraso en nómina genera una presión muy difícil de ignorar.",
    consejos: [
      "Ante documentos de RRHH, siempre verifica directamente con tu área de recursos humanos",
      "Los sistemas de firma digital legítimos llegan con acceso verificable desde portales conocidos",
      "Tu empresa nunca retrasará tu nómina sin comunicación oficial previa"
    ]
  },

  {
    id: 6,
    categoria: "autoridad",
    nivel: "avanzado",
    nivelLabel: "Avanzado",
    asunto: "Re: Transferencia pendiente — aprobación requerida del Director General",
    remitente: "direccion.general@tuempresa-corp.com",
    remitenteNombre: "Lic. Roberto Mendoza — Director General",
    cuerpo: `
      <p>Buen día,</p>
      <p>Te escribo directamente porque necesito que proceses con urgencia una 
      transferencia que quedó pendiente de la junta de ayer.</p>
      <p>Son <strong>$45,000 MXN</strong> al proveedor Innovatech Solutions. 
      El contrato ya fue firmado pero el área de finanzas necesita tu autorización 
      para liberar el pago hoy mismo.</p>
      <p>Estoy en reunión hasta las 6pm, por favor confírmame por este medio 
      cuando esté listo. Es importante que esto quede hoy.</p>
      <p>Gracias,<br><strong>Roberto</strong></p>
    `,
    tecnica: "Suplantación de ejecutivo (CEO Fraud) + Urgencia + Presión social",
    esPhishing: true,
    dificultad: 3,
    senalesAlerta: [
      "El dominio 'tuempresa-corp.com' tiene un guión extra — diferente al dominio real",
      "Los directores generales no solicitan transferencias por correo directamente",
      "La excusa de 'estar en reunión' impide que lo contactes para verificar",
      "Monto específico y proveedor desconocido para generar urgencia",
      "Este ataque se llama CEO Fraud y genera millones en pérdidas globalmente"
    ],
    explicacion: "Este es el ataque más sofisticado — el CEO Fraud. Suplanta al directivo de más alto nivel para que un empleado procese una transferencia sin verificar. Es tan efectivo porque nadie quiere cuestionar al Director General.",
    consejos: [
      "SIEMPRE verifica transferencias de dinero por un canal diferente al correo (llamada, en persona)",
      "Los directivos reales entienden que debes verificar — si alguien se molesta por verificar, es sospechoso",
      "Establece protocolos de doble verificación para cualquier transferencia bancaria"
    ]
  },

  // ════════════════════════════════════════
  //  CATEGORÍA 3: RECOMPENSA
  // ════════════════════════════════════════

  {
    id: 7,
    categoria: "recompensa",
    nivel: "basico",
    nivelLabel: "Básico",
    asunto: "🎉 ¡FELICIDADES! Has sido seleccionado como ganador",
    remitente: "premios@sorteos-ganadores-mx.com",
    remitenteNombre: "Sorteos Ganadores México",
    cuerpo: `
      <p>¡Estimado participante!</p>
      <p>Nos complace informarte que has sido seleccionado como 
      <strong>GANADOR</strong> de nuestro sorteo mensual.</p>
      <p>Tu premio: <strong>$15,000 MXN en efectivo</strong> 🎊</p>
      <p>Para reclamar tu premio solo necesitas verificar tu identidad 
      y pagar el <strong>seguro de envío de $250 MXN</strong> para 
      procesar la transferencia a tu cuenta.</p>
    `,
    tecnica: "Recompensa + Reciprocidad (pagar para recibir)",
    esPhishing: true,
    dificultad: 1,
    senalesAlerta: [
      "Nunca participaste en ningún sorteo de esta empresa",
      "Pedir dinero para recibir un premio es la señal más clara de estafa",
      "Emojis excesivos y mayúsculas son señales de correos no profesionales",
      "El dominio 'sorteos-ganadores-mx.com' es claramente genérico y sospechoso",
      "Los concursos legítimos nunca cobran para entregar premios"
    ],
    explicacion: "Este es el clásico 'paga para ganar'. La víctima paga los $250 de 'seguro' y nunca recibe nada. Es el ataque más fácil de identificar, pero sigue siendo efectivo porque la promesa de dinero fácil nubla el juicio.",
    consejos: [
      "Ningún concurso legítimo te pide pagar para recibir tu premio",
      "Si no participaste en un sorteo, no puedes haber ganado",
      "Ante cualquier premio inesperado, la respuesta correcta es ignorar"
    ]
  },

  {
    id: 8,
    categoria: "recompensa",
    nivel: "intermedio",
    nivelLabel: "Intermedio",
    asunto: "Tu acceso PREMIUM gratuito está listo — solo para usuarios seleccionados",
    remitente: "beneficios@netflix-usuarios-vip.com",
    remitenteNombre: "Netflix Beneficios VIP",
    cuerpo: `
      <p>Hola,</p>
      <p>Como parte de nuestro programa de fidelidad, has sido seleccionado 
      para recibir <strong>6 meses de Netflix Premium GRATIS</strong>.</p>
      <p>Solo <strong>500 usuarios</strong> han sido elegidos este mes. 
      Tu lugar está reservado por las próximas <strong>2 horas</strong>.</p>
      <p>Para activar tu beneficio, confirma tu cuenta actual de Netflix 
      e ingresa un método de pago de respaldo (no se realizará ningún cargo).</p>
    `,
    tecnica: "Recompensa + Escasez + Urgencia + Marca conocida",
    esPhishing: true,
    dificultad: 2,
    senalesAlerta: [
      "Netflix nunca ofrece meses gratis por correo no solicitado",
      "El dominio 'netflix-usuarios-vip.com' no es el dominio oficial netflix.com",
      "'Solo 500 usuarios' y '2 horas' son tácticas de escasez artificial",
      "Pedir método de pago 'de respaldo' es el objetivo real del ataque",
      "Netflix nunca te pedirá confirmar tu cuenta por correo"
    ],
    explicacion: "Este ataque es más sofisticado porque usa una marca reconocida (Netflix) y combina múltiples técnicas: la recompensa atractiva, la escasez (solo 500 usuarios) y la urgencia (2 horas). El objetivo real es robar tu método de pago.",
    consejos: [
      "Cualquier beneficio de Netflix aparece directamente en tu cuenta oficial",
      "Nunca ingreses datos de pago desde un link de correo — ve directo a netflix.com",
      "Las marcas reales no crean urgencia artificial para que no pienses"
    ]
  },

  {
    id: 9,
    categoria: "recompensa",
    nivel: "avanzado",
    nivelLabel: "Avanzado",
    asunto: "Oferta de empleo: Analista de Datos — $35,000 MXN mensuales",
    remitente: "reclutamiento@talent-hunt-careers.com",
    remitenteNombre: "TalentHunt — Reclutamiento Ejecutivo",
    cuerpo: `
      <p>Estimada candidata,</p>
      <p>Tu perfil en LinkedIn fue revisado por nuestro equipo de reclutamiento 
      y consideramos que eres una candidata <strong>ideal</strong> para una posición 
      de <strong>Analista de Datos Senior</strong> en una empresa multinacional.</p>
      <p>Sueldo: <strong>$35,000 MXN mensuales + prestaciones superiores a la ley</strong></p>
      <p>Para avanzar en el proceso necesitamos que completes tu perfil profesional 
      en nuestra plataforma y adjuntes una copia de tu <strong>INE y CURP</strong> 
      para verificación de antecedentes.</p>
      <p>Tenemos entrevistas esta semana — los lugares son limitados.</p>
    `,
    tecnica: "Recompensa laboral + Autoridad profesional + Robo de identidad",
    esPhishing: true,
    dificultad: 3,
    senalesAlerta: [
      "Reclutadores legítimos nunca piden INE y CURP antes de una entrevista",
      "El dominio 'talent-hunt-careers.com' no corresponde a ninguna empresa verificable",
      "Ofertas no solicitadas con sueldos muy atractivos son una señal de alerta",
      "Solicitar documentos de identidad por correo es robo de identidad",
      "La presión de 'lugares limitados esta semana' es urgencia artificial"
    ],
    explicacion: "Este es el ataque más peligroso de la categoría porque no busca dinero inmediato, sino tus documentos de identidad (INE, CURP). Con esos datos pueden abrir créditos, cuentas bancarias o cometer delitos en tu nombre. El robo de identidad puede afectarte por años.",
    consejos: [
      "Ningún proceso de reclutamiento serio pide documentos de identidad antes de una entrevista",
      "Verifica siempre que la empresa exista en LinkedIn y tenga presencia real",
      "Ante ofertas no solicitadas muy atractivas, investiga primero a fondo la empresa"
    ]
  }
];

// Exportar para uso en otros módulos
// (Se usa como variable global en el navegador)
console.log(`✅ PhishSim: ${PHISHING_SCENARIOS.length} escenarios cargados correctamente.`);