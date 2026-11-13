import { buildSiteConfig } from "../server/site-config.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Método no permitido." });
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json(buildSiteConfig());
}
