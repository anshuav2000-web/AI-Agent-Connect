import { Router } from "express";
import authRouter from "./auth.js";
import leadsRouter from "./leads.js";
import statsRouter from "./stats.js";
import webhookRouter from "./webhook.js";
import siteSettingsRouter from "./site-settings.js";
import logsRouter from "./logs.js";

const router = Router();
router.use(authRouter);
router.use(leadsRouter);
router.use(statsRouter);
router.use(webhookRouter);
router.use(siteSettingsRouter);
router.use(logsRouter);
export default router;
