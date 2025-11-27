export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({
      error: "O parâmetro ?url= é obrigatório.",
    });
  }

  try {
    // STRINGIFY DO BODY — ESSENCIAL
    const body =
      req.method === "POST" || req.method === "PUT"
        ? JSON.stringify(req.body)
        : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error("Erro no proxy:", err);
    return res.status(500).json({
      error: "Erro ao acessar URL de destino",
      detalhes: err.message,
    });
  }
}
