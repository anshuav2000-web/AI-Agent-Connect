import { Router, type IRouter } from "express";
import authRouter from "./auth";
import leadsRouter from "./leads";
import statsRouter from "./stats";
import webhookRouter from "./webhook";
import siteSettingsRouter from "./site-settings";

const router: IRouter = Router();

router.use(authRouter);
router.use(leadsRouter);
router.use(statsRouter);
router.use(webhookRouter);
router.use(siteSettingsRouter);

export default router;
