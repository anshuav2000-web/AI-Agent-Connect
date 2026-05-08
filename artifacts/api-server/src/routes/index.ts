import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import adminRouter from "./admin";
import siteSettingsRouter from "./site-settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use("/admin", adminRouter);
router.use(siteSettingsRouter);

export default router;
