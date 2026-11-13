import { buildSiteConfig } from "./server/site-config.js";
import { isHoneypotTriggered, validateContactPayload } from "./server/spam-guard.js";
import { sendContactEmail } from "./server/mail.js";

const rateLimitStore = new Map();

function getClientIp(request) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return "unknown";
}

function checkRateLimit(ip, env) {
  const max = Number(env.RATE_LIMIT_MAX ?? 5);
  const windowMs = Number(env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
  const now = Date.now();
  const key = `contact:${ip}`;
  const record = rateLimitStore.get(key);

  if (!record || now - record.start > windowMs) {
    rateLimitStore.set(key, { start: now, count: 1 });
    return true;
  }

  if (record.count >= max) {
    return false;
  }

  record.count += 1;
  return true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/config" && request.method === "GET") {
      return Response.json(buildSiteConfig(env));
    }

    if (url.pathname === "/api/contact" && request.method === "POST") {
      const ip = getClientIp(request);
      if (!checkRateLimit(ip, env)) {
        return Response.json(
          {
            ok: false,
            error: "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
          },
          { status: 429 }
        );
      }

      let body;
      try {
        body = await request.json();
      } catch {
        body = {};
      }

      if (isHoneypotTriggered(body)) {
        return Response.json({ ok: true, message: "¡Mensaje enviado! Te responderé pronto." });
      }

      const validation = validateContactPayload(body, env);
      if (!validation.valid) {
        return Response.json({ ok: false, error: validation.error }, { status: 400 });
      }

      try {
        await sendContactEmail(validation.data, env);
        return Response.json({ ok: true, message: "¡Mensaje enviado! Te responderé pronto." });
      } catch (error) {
        return Response.json(
          {
            ok: false,
            error: "No se pudo enviar el mensaje. Intenta por WhatsApp o email directo.",
          },
          { status: 500 }
        );
      }
    }

    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
