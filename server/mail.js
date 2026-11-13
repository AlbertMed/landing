import nodemailer from "nodemailer";
import { getSmtpConfig } from "./site-config.js";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const smtp = getSmtpConfig();

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

/**
 * Envía el mensaje del formulario de contacto vía Gmail SMTP.
 */
export async function sendContactEmail({ name, email, message }) {
  const smtp = getSmtpConfig();
  const transport = getTransporter();

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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
