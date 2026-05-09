import { Router } from "express";
import { getAll } from "./admin/site-settings.js";

const router = Router();
router.get("/site-settings", async (_req, res) => res.json(await getAll()));
export default router;
