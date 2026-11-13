/**
 * Rate limit en memoria (por instancia).
 * Suficiente para un formulario de contacto en serverless o Express.
 */

const hits = new Map();

function getRuntimeEnv(env) {
  return env && typeof env === "object" ? env : process.env ?? {};
}

export function getClientIp(req) {
  if (typeof Request !== "undefined" && req instanceof Request) {
    const forwarded = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
    if (forwarded) {
      return String(forwarded).split(",")[0].trim();
    }
    return "unknown";
  }

  const forwarded = req.headers?.["x-forwarded-for"];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || "unknown";
}

export function checkRateLimit(key, options = {}) {
  const runtimeEnv = getRuntimeEnv(options.env ?? process.env);
  const max = Number(options.max ?? runtimeEnv.RATE_LIMIT_MAX ?? 5);
  const windowMs = Number(options.windowMs ?? runtimeEnv.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
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

export function createRateLimitMiddleware(env = process.env) {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const result = checkRateLimit(`contact:${ip}`, { env });

    if (!result.allowed) {
      return res.status(429).json({
        ok: false,
        error: "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
      });
    }

    next();
  };
}
