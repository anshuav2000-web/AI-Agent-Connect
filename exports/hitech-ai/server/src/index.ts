import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT ?? "3000");
const CLIENT_URL = process.env.CLIENT_URL ?? "*";

app.set("trust proxy", 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://wa.me", "https://api.whatsapp.com"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? CLIENT_URL : "*",
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/leads", strictLimiter);

app.use("/api", router);

const distPath = path.resolve(__dirname, "../../client/dist");
app.use(express.static(distPath, { maxAge: "7d" }));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HiTech AI server running on port ${PORT} [${process.env.NODE_ENV ?? "development"}]`);
});

export default app;
