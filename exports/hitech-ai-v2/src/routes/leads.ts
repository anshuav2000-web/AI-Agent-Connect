import { Router } from "express";
import { db, leadsTable, webhookSettingsTable, webhookLogsTable } from "../db/index.js";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const leadSchema = z.object({
  fullName: z.string().min(2).max(100),
  companyName: z.string().max(100).optional(),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  country: z.string().min(2).max(60),
  consoleModel: z.string().max(60).optional(),
  requirement: z.string().min(5).max(1000),
  referralSource: z.string().max(60).optional(),
});

router.post("/leads", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });
    return;
  }

  const [lead] = await db.insert(leadsTable).values(parsed.data).returning();

  const [webhook] = await db.select().from(webhookSettingsTable).where(eq(webhookSettingsTable.enabled, true)).limit(1);
  if (webhook) {
    const payload = { event: "new_lead", lead };
    let success = false, status = 0, responseBody = "";
    try {
      const { default: fetch } = await import("node-fetch");
      const r = await fetch(webhook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      status = r.status; responseBody = await r.text(); success = r.ok;
    } catch (e) { responseBody = String(e); }
    await db.insert(webhookLogsTable).values({ webhookUrl: webhook.url, payload, status, success, responseBody });
  }

  res.status(201).json({ success: true, id: lead.id });
});

export default router;
