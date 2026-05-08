import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";

const router: IRouter = Router();

// In-memory session store
const sessions = new Set<string>();

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/login", (req, res) => {
  const { password } = req.body;
  if (!password || password !== getAdminPassword()) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = crypto.randomBytes(32).toString("hex");
  sessions.add(token);
  res.json({ token });
});

router.post("/logout", (req, res) => {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) sessions.delete(token);
  res.json({ success: true });
});

router.get("/me", (req, res) => {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  res.json({ authenticated: !!(token && sessions.has(token)) });
});

export default router;
