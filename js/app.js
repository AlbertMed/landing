/**
 * App principal — orquesta renderizado dinámico e interacciones de la landing.
 */
import { projects } from "./data/projects.js";

let siteConfig = null;

const $ = (selector, parent = document) => parent.querySelector(selector);

/** Carga configuración pública desde el servidor (.env) */
async function loadSiteConfig() {
  const res = await fetch("/api/config");
  if (!res.ok) throw new Error("No se pudo cargar la configuración del sitio.");
  siteConfig = await res.json();
}

const serviceIcons = {
  website: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12h18M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zm0 0l-2 2m16-2l2 2"/></svg>`,
  programs: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17V7m6 10V3m-9 14h12M5 21h14"/></svg>`,
  chatbot: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`,
  menu: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h10"/></svg>`,
  support: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M9.09 9a3 3 0 115.82 0c0 2-3 2.5-3 5m0 0h.01m-6.85 3.44A9 9 0 1119.94 4.06a9 9 0 01-14.79 15.38z"/></svg>`,
};

/* ── SEO & meta tags ───────────────────────────────────────────── */
function initSEO() {
  const { seo } = siteConfig;
  document.title = seo.title;

  const metaMap = {
    description: seo.description,
    "og:title": seo.title,
    "og:description": seo.description,
    "og:url": seo.url,
    "og:image": seo.image,
    "og:type": "website",
    "twitter:card": "summary_large_image",
    "twitter:title": seo.title,
    "twitter:description": seo.description,
    "twitter:image": seo.image,
  };

  Object.entries(metaMap).forEach(([key, value]) => {
    const isOg = key.startsWith("og:") || key.startsWith("twitter:");
    const attr = isOg ? "property" : "name";
    let meta = document.querySelector(`meta[${attr}="${key}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attr, key);
      document.head.appendChild(meta);
    }
    meta.content = value;
  });
}

/* ── Render: Product metrics (hero) ────────────────────────────── */
function renderProductMetrics() {
  const container = $("#product-metrics");
  if (!container) return;

  container.innerHTML = siteConfig.productMetrics
    .map(
      ({ value, label }) => `
      <div class="metric-card rounded-lg p-4 text-center">
        <p class="text-lg font-bold text-indigo-400 mb-0.5">${value}</p>
        <p class="text-xs text-slate-500">${label}</p>
      </div>`
    )
    .join("");
}

/* ── Render: Services ───────────────────────────────────────────── */
function renderServices() {
  const container = $("#services-grid");
  if (!container) return;

  container.innerHTML = siteConfig.services
    .map(
      (service) => `
      <article class="service-card rounded-2xl p-6 lg:p-8 flex flex-col">
        <div class="flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500/15 text-indigo-400 mb-5">
          ${serviceIcons[service.icon] || ""}
        </div>
        <h3 class="text-xl font-bold text-slate-100 mb-3">${service.title}</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-5">${service.description}</p>
        <ul class="mt-auto space-y-2" role="list">
          ${service.examples.map((ex) => `<li class="flex items-start gap-2 text-sm text-slate-500"><span class="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true">✓</span>${ex}</li>`).join("")}
        </ul>
        <div class="mt-6">
          <a href="#contacto" class="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-colors" data-service="${service.title}">
            Solicitar info
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </article>`
    )
    .join("");
}

/* ── Render: Process steps ─────────────────────────────────────── */
function renderProcess() {
  const container = $("#process-steps");
  if (!container) return;

  container.innerHTML = siteConfig.process
    .map(
      (item) => `
      <div class="process-step text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/15 text-indigo-400 font-bold text-sm mb-4">${item.step}</div>
        <h3 class="text-lg font-semibold text-slate-100 mb-2">${item.title}</h3>
        <p class="text-sm text-slate-400 leading-relaxed">${item.description}</p>
      </div>`
    )
    .join("");
}

/* ── Render: Product detail (hidden until needed) ─────────────── */
function renderProjects() {
  const container = $("#projects-grid");
  const emptyState = $("#projects-empty");
  if (!container) return;

  if (!projects.length) {
    container.innerHTML = "";
    emptyState?.classList.remove("hidden");
    return;
  }

  emptyState?.classList.add("hidden");

  container.innerHTML = projects
    .map(
      (project) => `
      <article class="project-card rounded-xl p-6 lg:p-10 flex flex-col" id="${project.id}">
        <p class="text-slate-400 leading-relaxed mb-6">${project.description}</p>
        ${project.architecture?.length ? `
        <div class="flex flex-col sm:flex-row items-stretch gap-3 mb-8" role="list" aria-label="Arquitectura de la solución">
          ${project.architecture.map((item, i) => `
            <div class="flex-1 flex items-center gap-3" role="listitem">
              <div class="flex-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-4 text-center">
                <p class="text-sm font-bold text-indigo-300 mb-1">${item.label}</p>
                <p class="text-xs text-slate-400 leading-relaxed">${item.text}</p>
              </div>
              ${i < project.architecture.length - 1 ? `<span class="hidden sm:block text-slate-600 text-xl shrink-0" aria-hidden="true">→</span>` : ""}
            </div>`).join("")}
        </div>` : ""}
        ${project.features?.length ? `
        <div class="grid sm:grid-cols-2 gap-4 mb-6" role="list" aria-label="Módulos de la solución">
          ${project.features.map((f) => `
            <div class="rounded-lg bg-slate-800/50 border border-slate-700/50 p-4" role="listitem">
              <h4 class="text-sm font-semibold text-slate-200 mb-1">${f.title}</h4>
              <p class="text-xs text-slate-400 leading-relaxed">${f.text}</p>
            </div>`).join("")}
        </div>` : ""}
        ${project.result ? `<div class="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3"><p class="text-sm text-emerald-300"><span class="font-semibold">Beneficio:</span> ${project.result}</p></div>` : ""}
      </article>`
    )
    .join("");
}

/* ── Render: Contact links ─────────────────────────────────────── */
function renderContact() {
  const { contact } = siteConfig;

  const emailEl = $("#contact-email");
  if (emailEl) {
    emailEl.href = `mailto:${contact.email}`;
    const emailText = emailEl.querySelector("[data-email-text]");
    if (emailText) emailText.textContent = contact.email;
  }

  const whatsappEl = $("#contact-whatsapp");
  if (whatsappEl && contact.phone) {
    const msg = encodeURIComponent(contact.whatsappMessage || "Hola, me interesa contactarte.");
    whatsappEl.href = `https://wa.me/${contact.phone}?text=${msg}`;
    const whatsappText = whatsappEl.querySelector("[data-whatsapp-text]");
    if (whatsappText) whatsappText.textContent = `WhatsApp: ${contact.phoneDisplay || contact.phone}`;
  }

  
}

/* ── Render: Footer social links ───────────────────────────────── */
function renderFooter() {
  const container = $("#footer-social");
  if (!container) return;

  const icons = {
   
    whatsapp: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  };

  const { contact } = siteConfig;
  const socialLinks = { ...siteConfig.social };

  if (contact.phone) {
    const msg = encodeURIComponent(contact.whatsappMessage || "");
    socialLinks.whatsapp = `https://wa.me/${contact.phone}?text=${msg}`;
  }

  container.innerHTML = Object.entries(socialLinks)
    .filter(([, url]) => url)
    .map(
      ([network, url]) =>
        `<a href="${url}" class="text-slate-400 hover:text-indigo-400 transition-colors p-2" target="_blank" rel="noopener noreferrer" aria-label="${network}">${icons[network] || network}</a>`
    )
    .join("");
}

/* ── Navbar ──────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = $("#navbar");
  const toggle = $("#menu-toggle");
  const mobileMenu = $("#mobile-menu");
  const menuIcon = $("#menu-icon");
  const menuIconClose = $("#menu-icon-close");

  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("nav-scrolled", window.scrollY > 20);
  }, { passive: true });

  toggle?.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("mobile-menu-open", isOpen);
    menuIcon?.classList.toggle("hidden", isOpen);
    menuIconClose?.classList.toggle("hidden", !isOpen);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("mobile-menu-open");
      menuIcon?.classList.remove("hidden");
      menuIconClose?.classList.add("hidden");
    });
  });
}

/* ── Botón principal y solicitudes de información ─────────────── */
function initHeroActions() {
  const primaryBtn = $("#cta-primary");
  const secondaryBtn = $("#cta-secondary");
  const messageField = $("#message");
  const nameField = $("#name");

  primaryBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const chatbot = $("#typebot-container");
    chatbot?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      const iframe = $("#typebot-container iframe");
      iframe?.focus();
    }, 350);
  });

  secondaryBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const servicesSection = $("#servicios");
    servicesSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const serviceName = button.getAttribute("data-service");
      if (messageField) {
        messageField.value = `Quiero información sobre ${serviceName}.`;
      }
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => nameField?.focus(), 350);
    });
  });
}

/* ── Contact form ──────────────────────────────────────────────── */
function initContactForm() {
  const form = $("#contact-form");
  const feedback = $("#form-feedback");
  if (!form) return;

  const formLoadedAt = Date.now();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    feedback.textContent = "Enviando...";
    feedback.className = "text-sm text-slate-400 mt-3";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          message: form.message.value.trim(),
          website: form.website?.value ?? "",
          formLoadedAt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Error al enviar");
      }

      feedback.textContent = data.message || "¡Mensaje enviado! Te responderé pronto.";
      feedback.className = "text-sm text-emerald-400 mt-3";
      form.reset();
    } catch (err) {
      feedback.textContent = err.message || "No se pudo enviar. Intenta por WhatsApp o email directo.";
      feedback.className = "text-sm text-red-400 mt-3";
    }
  });
}

/* ── Populate static text from config ──────────────────────────── */
function populateStaticContent() {
  const { name, product, customProject, contact } = siteConfig;

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText("site-name", name);
  setText("site-name-footer", name);
  setText("product-label", product.label);
  setText("product-name", product.name);
  setText("product-tagline", product.tagline);
  setText("product-description", product.description);
  setText("cta-primary-text", product.ctaPrimary);
  setText("cta-secondary-text", product.ctaSecondary);
  setText("custom-project-heading", customProject.title);
  setText("custom-project-intro", customProject.intro);
  setText("services-intro", customProject.servicesIntro);
  setText("contact-label", contact.title);
  setText("contact-heading", contact.heading);
  setText("contact-description", contact.description);

  const ctaPrimary = $("#cta-primary");
  if (ctaPrimary) ctaPrimary.href = product.ctaPrimaryTarget;

  const ctaSecondary = $("#cta-secondary");
  if (ctaSecondary) ctaSecondary.href = product.ctaSecondaryTarget;
}

/* ── Init ──────────────────────────────────────────────────────── */
async function init() {
  try {
    await loadSiteConfig();
  } catch (err) {
    console.error(err);
    const main = $("#main-content");
    if (main) {
      main.innerHTML = `<div class="max-w-xl mx-auto px-4 py-32 text-center text-slate-400">
        <p class="text-lg mb-2">No se pudo cargar el sitio.</p>
        <p class="text-sm">Ejecuta <code class="text-indigo-400">npm start</code> para iniciar el servidor con la configuración del archivo <code class="text-indigo-400">.env</code>.</p>
      </div>`;
    }
    return;
  }

  initSEO();
  populateStaticContent();
  renderProductMetrics();
  renderProjects();
  renderServices();
  renderProcess();
  renderContact();
  renderFooter();
  initNavbar();
  initHeroActions();
  initContactForm();
}

document.addEventListener("DOMContentLoaded", init);
