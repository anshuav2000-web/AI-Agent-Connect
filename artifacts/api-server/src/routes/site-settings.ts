import { Router, type IRouter } from "express";
import { getAll } from "./admin/site-settings";

const router: IRouter = Router();

router.get("/site-settings", async (_req, res) => {
  res.json(await getAll());
});

export default router;
