import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { eq, gte, sql } from "drizzle-orm";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.get("/stats", requireAdmin, async (_req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      approved: sql<number>`count(*) filter (where status = 'approved')::int`,
      pending: sql<number>`count(*) filter (where status = 'pending')::int`,
      rejected: sql<number>`count(*) filter (where status = 'rejected')::int`,
    })
    .from(leadsTable);

  const [{ today }] = await db
    .select({ today: sql<number>`count(*)::int` })
    .from(leadsTable)
    .where(gte(leadsTable.createdAt, todayStart));

  const [{ week }] = await db
    .select({ week: sql<number>`count(*)::int` })
    .from(leadsTable)
    .where(gte(leadsTable.createdAt, weekStart));

  res.json({
    totalRequests: totals.total,
    approved: totals.approved,
    pending: totals.pending,
    rejected: totals.rejected,
    todayRequests: today,
    weekRequests: week,
  });
});

export default router;
