/**
 * Validaciones anti-spam para el formulario de contacto.
 */

const DEFAULT_MIN_SECONDS = 3;
const DEFAULT_MAX_AGE_MS = 60 * 60 * 1000; // 1 hora
const MAX_MESSAGE_LENGTH = 2000;
const MIN_MESSAGE_LENGTH = 10;
const MAX_URLS = 5;

function getRuntimeEnv(env) {
  return env && typeof env === "object" ? env : process.env ?? {};
}

/**
 * Si pasa el honeypot, respondemos éxito falso para no alertar al bot.
 */
export function isHoneypotTriggered(body) {
  const trap = body?.website ?? body?._gotcha ?? "";
  return String(trap).trim().length > 0;
}

export function validateContactPayload(body, env = process.env) {
  const runtimeEnv = getRuntimeEnv(env);
  const { name, email, message, formLoadedAt } = body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { valid: false, error: "Todos los campos son obligatorios." };
  }

  if (name.trim().length > 100) {
    return { valid: false, error: "El nombre es demasiado largo." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: "Email inválido." };
  }

  const msg = message.trim();
  if (msg.length < MIN_MESSAGE_LENGTH) {
    return { valid: false, error: "El mensaje es demasiado corto." };
  }
  if (msg.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: "El mensaje es demasiado largo." };
  }

  const urlCount = (msg.match(/https?:\/\//gi) || []).length;
  if (urlCount > MAX_URLS) {
    return { valid: false, error: "El mensaje contiene demasiados enlaces." };
  }

  const minSeconds = Number(runtimeEnv.SPAM_MIN_SUBMIT_SECONDS || DEFAULT_MIN_SECONDS);
  const maxAgeMs = Number(runtimeEnv.SPAM_MAX_FORM_AGE_MS || DEFAULT_MAX_AGE_MS);
  const loadedAt = Number(formLoadedAt);

  if (!loadedAt || Number.isNaN(loadedAt)) {
    return { valid: false, error: "No se pudo validar el formulario. Recarga la página e intenta de nuevo." };
  }

  const elapsed = Date.now() - loadedAt;
  if (elapsed < minSeconds * 1000) {
    return { valid: false, error: "Espera un momento antes de enviar." };
  }
  if (elapsed > maxAgeMs) {
    return { valid: false, error: "El formulario expiró. Recarga la página e intenta de nuevo." };
  }

  return {
    valid: true,
    data: {
      name: name.trim(),
      email: email.trim(),
      message: msg,
    },
  };
}
