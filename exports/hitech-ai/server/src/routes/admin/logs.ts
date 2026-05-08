import { Router } from "express";
import { db, webhookLogsTable, activityLogsTable } from "../../db/index.js";
import { desc } from "drizzle-orm";
import { requireAdmin } from "./auth.js";

const router = Router();

router.get("/webhook-logs", requireAdmin, async (req, res) => {
  const limit = parseInt(typeof req.query.limit === "string" ? req.query.limit : "50");
  const logs = await db.select().from(webhookLogsTable).orderBy(desc(webhookLogsTable.createdAt)).limit(Math.min(limit, 200));
  res.json(logs);
});

router.get("/activity-logs", requireAdmin, async (req, res) => {
  const limit = parseInt(typeof req.query.limit === "string" ? req.query.limit : "100");
  const logs = await db.select().from(activityLogsTable).orderBy(desc(activityLogsTable.createdAt)).limit(Math.min(limit, 500));
  res.json(logs);
});

export default router;
