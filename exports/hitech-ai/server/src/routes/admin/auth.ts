import { Router, type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";

const router = Router();

const sessions = new Map<string, { createdAt: number }>();
const SESSION_TTL = 24 * 60 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [token, s] of sessions) {
    if (now - s.createdAt > SESSION_TTL) sessions.delete(token);
  }
}, 60 * 60 * 1000);

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const session = sessions.get(token)!;
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(token);
    res.status(401).json({ error: "Session expired" });
    return;
  }
  next();
}

router.post("/login", (req, res) => {
  const { password } = req.body ?? {};
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  if (!password || password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { createdAt: Date.now() });
  res.json({ token });
});

router.post("/logout", requireAdmin, (req, res) => {
  const token = (req.headers.authorization ?? "").slice(7);
  sessions.delete(token);
  res.json({ success: true });
});

router.get("/me", (req, res) => {
  const token = (req.headers.authorization ?? "").slice(7);
  res.json({ authenticated: sessions.has(token) });
});

export default router;
