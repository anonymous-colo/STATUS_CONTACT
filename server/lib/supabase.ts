import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { contacts, settings } from "@shared/schema";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const client = postgres(connectionString);
export const db = drizzle(client);

// Initialize settings if they don't exist
export async function initializeSettings() {
  try {
    const existingSettings = await db.select().from(settings).limit(1);
    if (existingSettings.length === 0) {
      await db.insert(settings).values({
        id: "settings",
      });
    }
  } catch (error) {
    console.error("Failed to initialize settings:", error);
  }
}

// Create tables if they don't exist
export async function createTables() {
  try {
    await client`
      CREATE TABLE IF NOT EXISTS settings (
        id varchar PRIMARY KEY DEFAULT 'settings',
        contact_email text DEFAULT 'contact.kerventzweb@gmail.com',
        whatsapp_number text DEFAULT '+18495849472',
        current_suffix text DEFAULT 'BOOST.1🚀🔥',
        group_whatsapp_link text DEFAULT 'https://chat.whatsapp.com/CsVWRycnwNHFhqVLEtFyZv?mode=ac_t',
        group_email text,
        facebook_url text,
        twitter_url text,
        instagram_url text,
        linkedin_url text,
        updated_at timestamptz DEFAULT now()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS contacts (
        id bigserial PRIMARY KEY,
        name text NOT NULL,
        suffix_snapshot text NOT NULL,
        full_name text NOT NULL,
        phone_country text NOT NULL,
        phone_e164 text NOT NULL UNIQUE,
        email text,
        created_at timestamptz DEFAULT now()
      )
    `;

    await client`
      CREATE UNIQUE INDEX IF NOT EXISTS contacts_phone_e164_idx ON contacts(phone_e164)
    `;

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Failed to create tables:", error);
  }
}
