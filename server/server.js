import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import chatHandler from "../api/chat.js";

dotenv.config({ path: process.env.ENV_FILE || resolve(fileURLToPath(new URL("..", import.meta.url)), ".env.local") });

const app = express();
const port = Number(process.env.PORT || 5000);

app.disable("x-powered-by");
app.use(express.json({ limit: "128kb" }));

app.get("/api/healthz", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ status: "ok" });
});
app.all("/api/healthz", (_req, res) => {
  res.setHeader("Allow", "GET");
  res.setHeader("Cache-Control", "no-store");
  res.status(405).json({ error: "Method not allowed" });
});

app.post("/api/chat", chatHandler);
app.all("/api/chat", (_req, res) => {
  res.setHeader("Allow", "POST");
  res.status(405).json({ error: "Method not allowed" });
});

app.listen(port, () => {
  console.log(`Hacker gf API listening on port ${port}`);
});
