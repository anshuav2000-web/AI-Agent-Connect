import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  companyName: text("company_name"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  requirement: text("requirement").notNull(),
  consoleModel: text("console_model"),
  referralSource: text("referral_source"),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const webhookSettingsTable = pgTable("webhook_settings", {
  id: serial("id").primaryKey(),
  label: text("label").notNull().default("Primary Webhook"),
  url: text("url").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const webhookLogsTable = pgTable("webhook_logs", {
  id: serial("id").primaryKey(),
  webhookUrl: text("webhook_url").notNull(),
  payload: jsonb("payload"),
  status: integer("status"),
  success: boolean("success").notNull().default(false),
  responseBody: text("response_body"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const activityLogsTable = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  detail: text("detail"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Lead = typeof leadsTable.$inferSelect;
export type WebhookSetting = typeof webhookSettingsTable.$inferSelect;
export type SiteSetting = typeof siteSettingsTable.$inferSelect;
export type WebhookLog = typeof webhookLogsTable.$inferSelect;
export type ActivityLog = typeof activityLogsTable.$inferSelect;
