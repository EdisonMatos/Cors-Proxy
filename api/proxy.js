import fetch from "node-fetch";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "O parâmetro ?url= é obrigatório." });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method === "GET" ? null : req.body,
    });

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return res.status(200).json(data);
    }

    const text = await response.text();
    return res.status(200).send(text);
  } catch (error) {
    console.error("Erro no proxy:", error);
    return res.status(500).json({ error: "Erro ao acessar URL de destino" });
  }
}
