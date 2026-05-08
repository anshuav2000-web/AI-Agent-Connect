import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const webhookSettingsTable = pgTable("webhook_settings", {
  id: serial("id").primaryKey(),
  label: text("label").notNull().default("Primary Webhook"),
  url: text("url").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertWebhookSettingSchema = createInsertSchema(webhookSettingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWebhookSetting = z.infer<typeof insertWebhookSettingSchema>;
export type WebhookSetting = typeof webhookSettingsTable.$inferSelect;
