import { Router } from "express";
import { db, siteSettingsTable } from "../../db/index.js";
import { requireAdmin } from "./auth.js";

const router = Router();

const DEFAULTS: Record<string, string> = {
  siteName: "HiTech AI",
  tagline: "AI Powered DiGiCo Support on WhatsApp",
  logoUrl: "",
  logoText: "HiTech AI",
  announcementEnabled: "true",
  announcementText: "Now Live · DiGiCo AI Support on WhatsApp",
  heroHeadline: "AI Powered DiGiCo Support on WhatsApp",
  heroSubtext: "Instant troubleshooting, console guidance, workflow assistance, and smart audio support — powered by AI, delivered straight to your WhatsApp.",
  heroCta: "Get Access",
  whatsappNumber: "",
  whatsappMessage: "Hi! I need support with my DiGiCo console.",
  supportHours: "24/7 AI Support",
  featuresTitle: "Everything you need for DiGiCo mastery",
  consolesTitle: "Supported DiGiCo Consoles",
  faqTitle: "Frequently Asked Questions",
  footerTagline: "AI-powered DiGiCo console support",
  contactEmail: "",
  consoleModels: "Quantum7,Quantum5,Quantum338,Quantum225,SD12,SD10,SD9,SD7,SD5,SD-Rack,S21,Infinity",
};

export async function getAll() {
  const rows = await db.select().from(siteSettingsTable);
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}

router.get("/site-settings", requireAdmin, async (_req, res) => {
  res.json(await getAll());
});

router.put("/site-settings", requireAdmin, async (req, res) => {
  const updates = req.body as Record<string, string>;
  for (const [key, value] of Object.entries(updates)) {
    await db.insert(siteSettingsTable).values({ key, value })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value } });
  }
  res.json(await getAll());
});

export default router;
