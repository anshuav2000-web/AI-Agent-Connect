import { Router } from "express";
import { db, webhookSettingsTable } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { requireAdmin } from "./auth.js";

const router = Router();

router.get("/webhook", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(webhookSettingsTable).limit(1);
  if (rows.length === 0) {
    res.json({ id: null, label: "Primary Webhook", url: process.env.N8N_WEBHOOK_URL ?? "", enabled: true });
    return;
  }
  res.json(rows[0]);
});

router.put("/webhook", requireAdmin, async (req, res) => {
  const { label = "Primary Webhook", url, enabled = true } = req.body;
  if (!url) { res.status(400).json({ error: "URL required" }); return; }
  const rows = await db.select().from(webhookSettingsTable).limit(1);
  if (rows.length === 0) {
    const [created] = await db.insert(webhookSettingsTable).values({ label, url, enabled }).returning();
    res.json(created);
  } else {
    const [updated] = await db.update(webhookSettingsTable).set({ label, url, enabled })
      .where(eq(webhookSettingsTable.id, rows[0].id)).returning();
    res.json(updated);
  }
});

router.post("/webhook/test", requireAdmin, async (req, res) => {
  const { url } = req.body;
  if (!url) { res.status(400).json({ error: "URL required" }); return; }
  try {
    const { default: fetch } = await import("node-fetch");
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "test", timestamp: new Date().toISOString(), source: "HiTech AI Admin" }),
      signal: AbortSignal.timeout(8000),
    });
    const text = await resp.text().catch(() => "");
    res.json({ success: resp.ok, status: resp.status, message: resp.ok ? "Webhook reached successfully" : `Error: ${text.slice(0, 100)}` });
  } catch (err) {
    res.json({ success: false, status: 0, message: String(err) });
  }
});

export default router;
