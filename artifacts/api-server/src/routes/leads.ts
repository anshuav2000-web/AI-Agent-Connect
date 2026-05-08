import { Router, type IRouter } from "express";
import { SubmitLeadBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/leads", async (req, res) => {
  const parsed = SubmitLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Validation failed", details: parsed.error.message });
    return;
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    req.log.error("N8N_WEBHOOK_URL is not configured");
    res.status(500).json({ error: "Webhook not configured" });
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      req.log.error({ status: response.status }, "n8n webhook returned non-OK status");
      res.status(500).json({ error: "Failed to forward lead to webhook" });
      return;
    }

    res.json({ success: true, message: "Thank you! We will be in touch shortly." });
  } catch (err) {
    req.log.error({ err }, "Failed to call n8n webhook");
    res.status(500).json({ error: "Failed to submit lead" });
  }
});

export default router;
