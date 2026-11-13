import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { buildSiteConfig } from "./site-config.js";
import { sendContactEmail } from "./mail.js";
import { createRateLimitMiddleware } from "./rate-limit.js";
import { isHoneypotTriggered, validateContactPayload } from "./spam-guard.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const DEFAULT_PORT = Number(process.env.PORT || 3000);

const app = express();

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
    console.log(`API config: http://localhost:${port}/api/config`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const nextPort = port + 1;
      const nextPortIndex = nextPort - DEFAULT_PORT;

      if (nextPortIndex <= 10) {
        console.warn(`Puerto ${port} ocupado. Intentando ${nextPort}...`);
        startServer(nextPort);
        return;
      }
    }

    throw err;
  });
}

app.use(express.json({ limit: "32kb" }));
app.use(express.static(rootDir));

const contactRateLimit = createRateLimitMiddleware();

/** Configuración pública del sitio (desde .env) */
app.get("/api/config", (_req, res) => {
  res.json(buildSiteConfig());
});

/** Envío de formulario de contacto vía SMTP Gmail */
app.post("/api/contact", contactRateLimit, async (req, res) => {
  if (isHoneypotTriggered(req.body)) {
    return res.json({ ok: true, message: "¡Mensaje enviado! Te responderé pronto." });
  }

  const validation = validateContactPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({ ok: false, error: validation.error });
  }

  try {
    await sendContactEmail(validation.data);
    res.json({ ok: true, message: "¡Mensaje enviado! Te responderé pronto." });
  } catch (err) {
    console.error("Error SMTP:", err.message);
    res.status(500).json({
      ok: false,
      error: "No se pudo enviar el mensaje. Intenta por WhatsApp o email directo.",
    });
  }
});

startServer(DEFAULT_PORT);
