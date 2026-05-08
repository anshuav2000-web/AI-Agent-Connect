import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { eq, desc, ilike, or, sql } from "drizzle-orm";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.get("/leads", requireAdmin, async (req, res) => {
  const { status, search } = req.query as { status?: string; search?: string };

  let query = db.select().from(leadsTable).$dynamic();

  const conditions = [];
  if (status && status !== "all") {
    conditions.push(eq(leadsTable.status, status));
  }
  if (search) {
    conditions.push(
      or(
        ilike(leadsTable.fullName, `%${search}%`),
        ilike(leadsTable.email, `%${search}%`),
        ilike(leadsTable.companyName, `%${search}%`),
      )
    );
  }

  const where = conditions.length > 0
    ? conditions.length === 1
      ? conditions[0]
      : sql`${conditions[0]} AND ${conditions[1]}`
    : undefined;

  const leads = await (where ? query.where(where) : query).orderBy(desc(leadsTable.createdAt));
  res.json(leads);
});

router.get("/leads/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, id));
  if (!lead) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(lead);
});

router.patch("/leads/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { status, notes, fullName, companyName, email, phone, country, requirement, referralSource } = req.body;

  const updates: Record<string, unknown> = {};
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  if (fullName !== undefined) updates.fullName = fullName;
  if (companyName !== undefined) updates.companyName = companyName;
  if (email !== undefined) updates.email = email;
  if (phone !== undefined) updates.phone = phone;
  if (country !== undefined) updates.country = country;
  if (requirement !== undefined) updates.requirement = requirement;
  if (referralSource !== undefined) updates.referralSource = referralSource;

  const [updated] = await db.update(leadsTable).set(updates).where(eq(leadsTable.id, id)).returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});

router.delete("/leads/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(leadsTable).where(eq(leadsTable.id, id));
  res.json({ success: true });
});

export default router;
