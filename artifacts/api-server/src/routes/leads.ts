import { Router, type IRouter } from "express";
import { SubmitLeadBody } from "@workspace/api-zod";
import { db, leadsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/leads", async (req, res) => {
  const parsed = SubmitLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Validation failed", details: parsed.error.message });
    return;
  }

  // Save to database
  let savedLead;
  try {
    [savedLead] = await db.insert(leadsTable).values({
      fullName: parsed.data.fullName,
      companyName: parsed.data.companyName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      consoleModel: parsed.data.consoleModel,
      requirement: parsed.data.requirement,
      referralSource: parsed.data.referralSource,
      status: "pending",
    }).returning();
  } catch (err) {
    req.log.error({ err }, "Failed to save lead to database");
    // Don't fail the request, still try to forward to webhook
  }

  // Forward to n8n webhook
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          leadId: savedLead?.id,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        req.log.error({ status: response.status }, "n8n webhook returned non-OK status");
      }
    } catch (err) {
      req.log.error({ err }, "Failed to call n8n webhook");
    }
  }

  res.json({ success: true, message: "Thank you! We will be in touch shortly." });
});

export default router;
