import { Router } from "express";
import leadsRouter from "./leads.js";
import siteSettingsRouter from "./site-settings.js";
import adminRouter from "./admin/index.js";

const router = Router();

router.get("/healthz", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));
router.use(leadsRouter);
router.use(siteSettingsRouter);
router.use("/admin", adminRouter);

export default router;
