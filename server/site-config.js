import { marketingDefaults } from "./defaults.js";

/**
 * Construye la configuración pública del sitio desde variables de entorno.
 */
export function buildSiteConfig() {
  const linkedin = process.env.LINKEDIN_URL || "";

  return {
    name: process.env.SITE_NAME || "localmx.online",

    product: { ...marketingDefaults.product },
    productMetrics: [...marketingDefaults.productMetrics],
    customProject: { ...marketingDefaults.customProject },
    services: [...marketingDefaults.services],
    process: [...marketingDefaults.process],

    contact: {
      ...marketingDefaults.contact,
      email: process.env.CONTACT_EMAIL || "",
      phone: process.env.CONTACT_PHONE || "",
      phoneDisplay: process.env.CONTACT_PHONE_DISPLAY || "",
      whatsappMessage: process.env.WHATSAPP_MESSAGE || "Hola, me interesa contactarte.",
      
    },

    social: {
     
    },

    seo: {
      title: process.env.SEO_TITLE || "Ing. Alberto | Desarrollo de Software y Automatización",
      description:
        process.env.SEO_DESCRIPTION ||
        "Desarrollo de software, automatización con IA y herramientas web para negocios que quieren ahorrar tiempo y crecer.",
      url: process.env.SEO_URL || "",
      image: process.env.SEO_IMAGE || "",
    },
  };
}

export function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    fromName: process.env.SMTP_FROM_NAME || process.env.SITE_NAME || "Landing Page",
    to: process.env.SMTP_TO || process.env.CONTACT_EMAIL || "",
  };
}
