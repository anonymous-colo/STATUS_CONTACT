import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, bigserial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default("settings"),
  contactEmail: text("contact_email").default("contact.kerventzweb@gmail.com"),
  whatsappNumber: text("whatsapp_number").default("+18495849472"),
  currentSuffix: text("current_suffix").default("BOOST.1🚀🔥"),
  groupWhatsappLink: text("group_whatsapp_link").default("https://chat.whatsapp.com/CsVWRycnwNHFhqVLEtFyZv?mode=ac_t"),
  groupEmail: text("group_email"),
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  suffixSnapshot: text("suffix_snapshot").notNull(),
  fullName: text("full_name").notNull(),
  phoneCountry: text("phone_country").notNull(),
  phoneE164: text("phone_e164").notNull().unique(),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
