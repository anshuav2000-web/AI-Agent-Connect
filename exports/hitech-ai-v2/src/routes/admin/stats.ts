import { Router } from "express";
import { db, leadsTable } from "../../db/index.js";
import { gte, sql } from "drizzle-orm";
import { requireAdmin } from "./auth.js";

const router = Router();

router.get("/stats", requireAdmin, async (_req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totals] = await db.select({
    total: sql<number>`count(*)::int`,
    approved: sql<number>`count(*) filter (where status = 'approved')::int`,
    pending: sql<number>`count(*) filter (where status = 'pending')::int`,
    rejected: sql<number>`count(*) filter (where status = 'rejected')::int`,
  }).from(leadsTable);

  const [{ today }] = await db.select({ today: sql<number>`count(*)::int` })
    .from(leadsTable).where(gte(leadsTable.createdAt, todayStart));

  const [{ week }] = await db.select({ week: sql<number>`count(*)::int` })
    .from(leadsTable).where(gte(leadsTable.createdAt, weekStart));

  const [{ month }] = await db.select({ month: sql<number>`count(*)::int` })
    .from(leadsTable).where(gte(leadsTable.createdAt, monthStart));

  const byCountry = await db.select({
    country: leadsTable.country,
    count: sql<number>`count(*)::int`,
  }).from(leadsTable)
    .groupBy(leadsTable.country)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  const byConsole = await db.select({
    consoleModel: leadsTable.consoleModel,
    count: sql<number>`count(*)::int`,
  }).from(leadsTable)
    .groupBy(leadsTable.consoleModel)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  res.json({
    totalRequests: totals.total,
    approved: totals.approved,
    pending: totals.pending,
    rejected: totals.rejected,
    todayRequests: today,
    weekRequests: week,
    monthRequests: month,
    byCountry,
    byConsole,
  });
});

export default router;
