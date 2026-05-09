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
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  })
);

app.use(cors({ origin: isProd ? CLIENT_URL : "*", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const leadLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: "Too many submissions, try again later." } });

app.use("/api/", apiLimiter);
app.use("/api/leads", leadLimiter);
app.use("/api", router);

// Serve built React frontend
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist, { maxAge: isProd ? "7d" : 0 }));
app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[HiTech AI] Server started on port ${PORT} — ${isProd ? "production" : "development"}`);
});

export default app;
