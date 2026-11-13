import nodemailer from "nodemailer";
import { getSmtpConfig } from "./site-config.js";

let transporter = null;

function getTransporter(env = process.env) {
  if (transporter) return transporter;

  const smtp = getSmtpConfig(env);

  if (!smtp.user || !smtp.pass) {
    throw new Error("SMTP_USER y SMTP_PASS son requeridos en .env");
  }

  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  return transporter;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Envía el mensaje del formulario de contacto.
 * En Node usa SMTP Gmail. En Cloudflare Workers usa MailChannels.
 */
export async function sendContactEmail({ name, email, message }, env = process.env) {
  const runtimeEnv = env && typeof env === "object" ? env : process.env ?? {};

  const isNodeRuntime = typeof process !== "undefined" && !!process.versions?.node;

  if (!isNodeRuntime) {
    const recipient = runtimeEnv.SMTP_TO || runtimeEnv.CONTACT_EMAIL || "";
    if (!recipient) {
      throw new Error("SMTP_TO o CONTACT_EMAIL son requeridos para enviar el email.");
    }

    const fromEmail = runtimeEnv.SMTP_FROM_EMAIL || `noreply@${(runtimeEnv.SEO_URL || "localhost").replace(/^https?:\/\//, "").split("/")[0]}`;
    const subject = `Contacto web — ${name}`;
    const body = [
      `Nombre: ${name}`,
      `Email: ${email}`,
      "",
      "Mensaje:",
      message,
    ].join("\n");

    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipient, name: runtimeEnv.SITE_NAME || "Landing Page" }],
          },
        ],
        from: {
          email: fromEmail,
          name: runtimeEnv.SMTP_FROM_NAME || runtimeEnv.SITE_NAME || "Landing Page",
        },
        reply_to: {
          email,
          name,
        },
        subject,
        content: [{ type: "text/plain", value: body }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`MailChannels error: ${response.status} ${text}`);
    }

    return;
  }

  const smtp = getSmtpConfig(runtimeEnv);
  const transport = getTransporter(runtimeEnv);

  const mailOptions = {
    from: `"${smtp.fromName}" <${smtp.user}>`,
    to: smtp.to,
    replyTo: email,
    subject: `Contacto web — ${name}`,
    text: [
      `Nombre: ${name}`,
      `Email: ${email}`,
      "",
      "Mensaje:",
      message,
    ].join("\n"),
    html: `
      <h2>Nuevo mensaje desde la landing page</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <hr>
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  };

  await transport.sendMail(mailOptions);
}
