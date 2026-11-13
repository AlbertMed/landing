import { marketingDefaults } from "./defaults.js";

function getRuntimeEnv(env) {
  return env && typeof env === "object" ? env : process.env ?? {};
}

/**
 * Construye la configuración pública del sitio desde variables de entorno.
 */
export function buildSiteConfig(env = process.env) {
  const runtimeEnv = getRuntimeEnv(env);

  return {
    name: runtimeEnv.SITE_NAME || "localmx.online",

    product: { ...marketingDefaults.product },
    productMetrics: [...marketingDefaults.productMetrics],
    customProject: { ...marketingDefaults.customProject },
    services: [...marketingDefaults.services],
    process: [...marketingDefaults.process],

    contact: {
      ...marketingDefaults.contact,
      email: runtimeEnv.CONTACT_EMAIL || "",
      phone: runtimeEnv.CONTACT_PHONE || "",
      phoneDisplay: runtimeEnv.CONTACT_PHONE_DISPLAY || "",
      whatsappMessage: runtimeEnv.WHATSAPP_MESSAGE || "Hola, me interesa contactarte.",
    },

    social: {
      linkedin: runtimeEnv.LINKEDIN_URL || "",
    },

    seo: {
      title: runtimeEnv.SEO_TITLE || "Ing. Alberto | Desarrollo de Software y Automatización",
      description:
        runtimeEnv.SEO_DESCRIPTION ||
        "Desarrollo de software, automatización con IA y herramientas web para negocios que quieren ahorrar tiempo y crecer.",
      url: runtimeEnv.SEO_URL || "",
      image: runtimeEnv.SEO_IMAGE || "",
    },
  };
}

export function getSmtpConfig(env = process.env) {
  const runtimeEnv = getRuntimeEnv(env);

  return {
    host: runtimeEnv.SMTP_HOST || "smtp.gmail.com",
    port: Number(runtimeEnv.SMTP_PORT || 587),
    secure: String(runtimeEnv.SMTP_SECURE ?? "false") === "true",
    user: runtimeEnv.SMTP_USER || "",
    pass: runtimeEnv.SMTP_PASS || "",
    fromName: runtimeEnv.SMTP_FROM_NAME || runtimeEnv.SITE_NAME || "Landing Page",
    to: runtimeEnv.SMTP_TO || runtimeEnv.CONTACT_EMAIL || "",
    fromEmail: runtimeEnv.SMTP_FROM_EMAIL || runtimeEnv.CONTACT_EMAIL || "",
  };
}
