import express from "express";
import fetch from "node-fetch";

const app = express();

// Permitir JSON no corpo das requisições
app.use(express.json());

// Middleware de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Rota principal do proxy
app.all("/proxy", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "O parâmetro ?url= é obrigatório." });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
      },
      body: req.method === "GET" ? null : JSON.stringify(req.body),
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(200).json(data);
    }

    const text = await response.text();
    return res.status(200).send(text);
  } catch (error) {
    console.error("Erro no proxy:", error);
    return res.status(500).json({ error: "Erro ao acessar URL de destino" });
  }
});

// Subir servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Proxy rodando em http://localhost:" + PORT);
});
