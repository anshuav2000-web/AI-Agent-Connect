import { Router } from "express";
import { db, leadsTable, webhookSettingsTable, webhookLogsTable } from "../db/index.js";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const leadSchema = z.object({
  fullName: z.string().min(2).max(100),
  companyName: z.string().max(100).optional(),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
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

  const webhookRow = await db
    .select()
    .from(webhookSettingsTable)
    .where(eq(webhookSettingsTable.enabled, true))
    .limit(1);

  if (webhookRow.length > 0) {
    const webhookUrl = webhookRow[0].url;
    const payload = { event: "new_lead", lead };
    let success = false;
    let status = 0;
    let responseBody = "";

    try {
      const { default: fetch } = await import("node-fetch");
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      status = resp.status;
      responseBody = await resp.text();
      success = resp.ok;
    } catch (err) {
      responseBody = String(err);
    }

    await db.insert(webhookLogsTable).values({ webhookUrl, payload, status, success, responseBody });
  }

  res.status(201).json({ success: true, id: lead.id });
});

export default router;
