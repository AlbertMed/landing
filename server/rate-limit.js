/**
 * Rate limit en memoria (por instancia).
 * Suficiente para un formulario de contacto en serverless o Express.
 */

const hits = new Map();

export function getClientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || "unknown";
}

export function checkRateLimit(key, options = {}) {
  const max = Number(options.max ?? process.env.RATE_LIMIT_MAX ?? 5);
  const windowMs = Number(options.windowMs ?? process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
  const now = Date.now();
  const record = hits.get(key);

  if (!record || now - record.start > windowMs) {
    hits.set(key, { start: now, count: 1 });
    return { allowed: true };
  }

  if (record.count >= max) {
    return { allowed: false };
  }

  record.count += 1;
  return { allowed: true };
}

export function createRateLimitMiddleware() {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const result = checkRateLimit(`contact:${ip}`);

    if (!result.allowed) {
      return res.status(429).json({
        ok: false,
        error: "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
      });
    }

    next();
  };
}
