import { Router, type IRouter } from "express";
import authRouter from "./auth";
import leadsRouter from "./leads";
import statsRouter from "./stats";
import webhookRouter from "./webhook";

const router: IRouter = Router();

router.use(authRouter);
router.use(leadsRouter);
router.use(statsRouter);
router.use(webhookRouter);

export default router;
