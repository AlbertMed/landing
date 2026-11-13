import { sendContactEmail } from "../server/mail.js";
import { checkRateLimit, getClientIp } from "../server/rate-limit.js";
import { isHoneypotTriggered, validateContactPayload } from "../server/spam-guard.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método no permitido." });
  }

  const rateLimit = checkRateLimit(`contact:${getClientIp(req)}`);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      ok: false,
      error: "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
    });
  }

  if (isHoneypotTriggered(req.body)) {
    return res.status(200).json({ ok: true, message: "¡Mensaje enviado! Te responderé pronto." });
  }

  const validation = validateContactPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({ ok: false, error: validation.error });
  }

  try {
    await sendContactEmail(validation.data);
    return res.status(200).json({ ok: true, message: "¡Mensaje enviado! Te responderé pronto." });
  } catch (err) {
    console.error("Error SMTP:", err.message);
    return res.status(500).json({
      ok: false,
      error: "No se pudo enviar el mensaje. Intenta por WhatsApp o email directo.",
    });
  }
}
