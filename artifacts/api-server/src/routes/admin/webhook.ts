import { Router, type IRouter } from "express";
import { db, webhookSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

async function getOrCreateWebhook() {
  const [existing] = await db.select().from(webhookSettingsTable).limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(webhookSettingsTable)
    .values({
      label: "Primary Webhook",
      url: process.env.N8N_WEBHOOK_URL || "",
      enabled: true,
    })
    .returning();
  return created;
}

router.get("/webhook", requireAdmin, async (_req, res) => {
  const webhook = await getOrCreateWebhook();
  res.json(webhook);
});

router.put("/webhook", requireAdmin, async (req, res) => {
  const { label, url, enabled } = req.body;
  const webhook = await getOrCreateWebhook();

  const [updated] = await db
    .update(webhookSettingsTable)
    .set({
      label: label ?? webhook.label,
      url: url ?? webhook.url,
      enabled: enabled ?? webhook.enabled,
    })
    .where(eq(webhookSettingsTable.id, webhook.id))
    .returning();

  res.json(updated);
});

router.post("/webhook/test", requireAdmin, async (req, res) => {
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ success: false, message: "URL is required" });
    return;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: true, timestamp: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    res.json({
      success: response.ok,
      status: response.status,
      message: response.ok ? "Webhook responded successfully" : `Webhook returned status ${response.status}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Connection failed";
    res.json({ success: false, status: 0, message });
  }
});

export default router;
