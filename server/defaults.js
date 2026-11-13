/**
 * Contenido de marketing (no sensible).
 * Los datos personales se cargan desde .env en site-config.js
 */
export const marketingDefaults = {
  product: {
    label: "Desarrollo de software y automatización",
    name: "localmx.online",
    tagline: "Transformo las ideas de tu negocio en soluciones digitales a medida.",
    description:
      "Desarrollo de software, automatización con inteligencia artificial y herramientas web diseñadas para ahorrar tiempo y escalar tu negocio o empresa.",
    ctaPrimary: "Hablar con el Asistente Virtual",
    ctaSecondary: "Ver servicios",
    ctaPrimaryTarget: "#chatbot",
    ctaSecondaryTarget: "#servicios",
    demoMessage: "Necesito información sobre un proyecto digital para mi negocio.",
  },

  productMetrics: [
    { value: "Directo", label: "Atención personalizada con el responsable del proyecto" },
    { value: "Escalable", label: "Soluciones pensadas para crecer con tu operación" },
    { value: "IA", label: "Automatización inteligente para ahorrar tiempo y errores" },
    { value: "Soporte", label: "Acompañamiento real antes, durante y después" },
  ],

  customProject: {
    title: "¿Por qué trabajar conmigo?",
    intro:
      "Te acompaño desde el diagnóstico hasta la puesta en marcha con soluciones prácticas, claras y pensadas para negocios reales.",
    servicesIntro:
      "Cada proyecto se diseña con foco en tiempos, procesos y resultados medibles para tu operación.",
  },

  services: [
    {
      icon: "website",
      title: "Sitios Web Profesionales",
      description:
        "Páginas rápidas, responsivas y optimizadas para convertir visitantes en clientes.",
      examples: [
        "Diseño moderno y enfoque comercial",
        "Experiencia de usuario optimizada",
        "Preparadas para escalar contenido y ventas",
      ],
    },
    {
      icon: "programs",
      title: "Programas a Medida",
      description:
        "Sistemas administrativos, paneles de control e integraciones adaptadas al flujo exacto de tu empresa.",
      examples: [
        "Herramientas internas para operaciones",
        "Tableros y seguimiento en tiempo real",
        "Soluciones diseñadas para tu proceso real",
      ],
    },
    {
      icon: "chatbot",
      title: "Creación de ChatBots",
      description:
        "Asistentes virtuales 24/7 para WhatsApp y web que atienden clientes, califican prospectos y automatizan respuestas.",
      examples: [
        "Atención automática y profesional",
        "Captura y calificación de leads",
        "Respuestas rápidas sin bajar la calidad",
      ],
    },
    {
      icon: "menu",
      title: "Menú Digital para Negocios",
      description:
        "Catálogos y menús interactivos con QR para restaurantes y comercios, fáciles de actualizar sin costos de impresión.",
      examples: [
        "Experiencia digital para clientes",
        "Actualización rápida en cualquier momento",
        "Más orden y ahorro para tu negocio",
      ],
    },
    {
      icon: "support",
      title: "Soporte Técnico Remoto",
      description:
        "Diagnóstico, mantenimiento y solución rápida de incidencias en sistemas.",
      examples: [
        "Soporte ágil y sin gastos excesivos",
        "Mantenimiento preventivo y correctivo",
        "Revisión de sistemas y optimización en procesos",
      ],
    },
  ],

  process: [
    { step: "01", title: "Diagnóstico inicial", description: "Analizamos el proceso, la necesidad y las oportunidades de mejora antes de definir una solución." },
    { step: "02", title: "Propuesta clara", description: "Te entrego una propuesta con alcance, tiempos y beneficios para tu negocio sin rodeos." },
    { step: "03", title: "Desarrollo y validación", description: "Construimos la solución con avances reales, ajustes y seguimiento constante." },
    { step: "04", title: "Implementación y soporte", description: "Ponemos la herramienta en marcha y te acompañamos para que funcione de verdad en tu operación." },
  ],

  contact: {
    title: "Hablemos de tu proyecto",
    heading: "Contacto",
    description:
      "Si quieres llevar tu negocio a un siguiente nivel con tecnología, automatización o una herramienta a medida, escríbeme y te respondemos con claridad.",
  },
};
