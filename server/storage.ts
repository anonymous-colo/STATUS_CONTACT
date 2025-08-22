import { Contact, InsertContact, Settings, InsertSettings } from "@shared/schema";
import { db } from "./lib/supabase";
import { contacts, settings } from "@shared/schema";
import { eq, desc, like, and, gte, lte, isNotNull } from "drizzle-orm";

export interface IStorage {
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(options?: {
    search?: string;
    from?: Date;
    to?: Date;
    withEmail?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Contact[]>;
  getContactById(id: number): Promise<Contact | undefined>;
  updateContact(id: number, updates: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  deleteAllContacts(): Promise<number>;
  getContactStats(): Promise<{
    total: number;
    today: number;
    withEmail: number;
    dailyCounts: Array<{ date: string; count: number }>;
  }>;
  
  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(updates: Partial<InsertSettings>): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  async createContact(contact: InsertContact): Promise<Contact> {
    const [result] = await db.insert(contacts).values(contact).returning();
    return result;
  }

  async getContacts(options: {
    search?: string;
    from?: Date;
    to?: Date;
    withEmail?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<Contact[]> {
    let query = db.select().from(contacts);
    
    const conditions = [];
    
    if (options.search) {
      conditions.push(
        like(contacts.fullName, `%${options.search}%`)
      );
    }
    
    if (options.from) {
      conditions.push(gte(contacts.createdAt, options.from));
    }
    
    if (options.to) {
      conditions.push(lte(contacts.createdAt, options.to));
    }
    
    if (options.withEmail) {
      conditions.push(isNotNull(contacts.email));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(contacts.createdAt));
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.offset(options.offset);
    }
    
    return await query;
  }

  async getContactById(id: number): Promise<Contact | undefined> {
    const [result] = await db.select().from(contacts).where(eq(contacts.id, id));
    return result;
  }

  async updateContact(id: number, updates: Partial<InsertContact>): Promise<Contact | undefined> {
    const [result] = await db
      .update(contacts)
      .set(updates)
      .where(eq(contacts.id, id))
      .returning();
    return result;
  }

  async deleteContact(id: number): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return result.rowCount > 0;
  }

  async deleteAllContacts(): Promise<number> {
    const result = await db.delete(contacts);
    return result.rowCount;
  }

  async getContactStats(): Promise<{
    total: number;
    today: number;
    withEmail: number;
    dailyCounts: Array<{ date: string; count: number }>;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [totalResult] = await db.select({ count: contacts.id }).from(contacts);
    const [todayResult] = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(gte(contacts.createdAt, today));
    const [emailResult] = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(isNotNull(contacts.email));

    // Get daily counts for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyContacts = await db
      .select()
      .from(contacts)
      .where(gte(contacts.createdAt, thirtyDaysAgo))
      .orderBy(contacts.createdAt);

    const dailyCounts: { [key: string]: number } = {};
    
    dailyContacts.forEach(contact => {
      if (contact.createdAt) {
        const date = contact.createdAt.toISOString().split('T')[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      }
    });

    const dailyCountsArray = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total: totalResult?.count || 0,
      today: todayResult?.count || 0,
      withEmail: emailResult?.count || 0,
      dailyCounts: dailyCountsArray,
    };
  }

  async getSettings(): Promise<Settings> {
    const [result] = await db.select().from(settings).limit(1);
    
    if (!result) {
      // Create default settings if none exist
      const [newSettings] = await db.insert(settings).values({
        id: "settings",
      }).returning();
      return newSettings;
    }
    
    return result;
  }

  async updateSettings(updates: Partial<InsertSettings>): Promise<Settings> {
    const [result] = await db
      .update(settings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(settings.id, "settings"))
      .returning();
    
    return result;
  }
}

export const storage = new DatabaseStorage();
