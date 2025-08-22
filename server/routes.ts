import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { requireAdmin, adminLogin, adminLogout } from "./middleware/auth";
import { emailService } from "./lib/email";
import { generateVCF, getVCFFilename } from "./lib/vcf";
import { generateCSV, getCSVFilename } from "./lib/csv";
import { updateProjectZip } from "./lib/zip";
import { insertContactSchema, insertSettingsSchema } from "@shared/schema";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { createTables, initializeSettings } from "./lib/supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database
  await createTables();
  await initializeSettings();

  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "status-contacts-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Public API Routes

  // Contact registration
  app.post("/api/contacts", async (req, res) => {
    try {
      const { name, phone, email, countryCode } = req.body;

      // Validate phone number
      const fullPhone = `${countryCode}${phone}`;
      
      if (!isValidPhoneNumber(fullPhone)) {
        return res.status(400).json({ error: "Invalid phone number" });
      }

      const parsedPhone = parsePhoneNumber(fullPhone);
      const phoneE164 = parsedPhone.format("E.164");
      const phoneCountry = parsedPhone.country || "HT";

      // Get current suffix
      const settings = await storage.getSettings();
      const suffixSnapshot = settings.currentSuffix || "BOOST.1🚀🔥";
      const fullName = `${name} ${suffixSnapshot}`;

      // Check for duplicate phone
      const existingContacts = await storage.getContacts({ search: phoneE164 });
      if (existingContacts.some(c => c.phoneE164 === phoneE164)) {
        return res.status(409).json({ error: "Ce numéro est déjà enregistré" });
      }

      // Create contact
      const contactData = {
        name,
        suffixSnapshot,
        fullName,
        phoneCountry,
        phoneE164,
        email: email || null,
      };

      const contact = await storage.createContact(contactData);

      // Send confirmation email if email provided and SMTP configured
      if (email && emailService.isConfigured()) {
        try {
          const confirmationHtml = `
            <h2>Merci pour votre inscription !</h2>
            <p>Bonjour ${name},</p>
            <p>Vous avez été enregistré avec succès sur STATUS CONTACTS🇭🇹.</p>
            <p>Vous pouvez maintenant rejoindre notre groupe WhatsApp pour accéder aux contacts.</p>
            <a href="${settings.groupWhatsappLink}" style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">Rejoindre le groupe WhatsApp</a>
          `;
          
          await emailService.sendEmail(
            email,
            "Confirmation d'inscription - STATUS CONTACTS🇭🇹",
            confirmationHtml
          );
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
        }
      }

      // Update project ZIP
      await updateProjectZip();

      res.json({ success: true, contact });
    } catch (error) {
      console.error("Contact creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get recent contacts (public, limited info)
  app.get("/api/contacts/recent", async (req, res) => {
    try {
      const contacts = await storage.getContacts({ limit: 5 });
      
      // Mask phone numbers for privacy
      const maskedContacts = contacts.map(contact => ({
        id: contact.id,
        fullName: contact.fullName,
        phoneDisplay: contact.phoneE164.replace(/(\d{4})\d+(\d{4})$/, "$1****$2"),
        createdAt: contact.createdAt,
      }));

      res.json(maskedContacts);
    } catch (error) {
      console.error("Get recent contacts error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get public stats
  app.get("/api/stats/public", async (req, res) => {
    try {
      const stats = await storage.getContactStats();
      res.json({
        totalContacts: stats.total,
        contactsToday: stats.today,
      });
    } catch (error) {
      console.error("Get public stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get settings (public parts only)
  app.get("/api/settings/public", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json({
        contactEmail: settings.contactEmail,
        whatsappNumber: settings.whatsappNumber,
        groupWhatsappLink: settings.groupWhatsappLink,
        currentSuffix: settings.currentSuffix,
        facebookUrl: settings.facebookUrl,
        twitterUrl: settings.twitterUrl,
        instagramUrl: settings.instagramUrl,
        linkedinUrl: settings.linkedinUrl,
      });
    } catch (error) {
      console.error("Get public settings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", adminLogin);
  app.post("/api/admin/logout", requireAdmin, adminLogout);

  // Protected Admin Routes

  // Get all contacts with filters
  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const { search, from, to, withEmail, page = "1", limit = "50" } = req.query;
      
      const options = {
        search: search as string,
        from: from ? new Date(from as string) : undefined,
        to: to ? new Date(to as string) : undefined,
        withEmail: withEmail === "true",
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
        limit: parseInt(limit as string),
      };

      const contacts = await storage.getContacts(options);
      res.json(contacts);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update contact
  app.patch("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const contactId = parseInt(req.params.id);
      const updates = req.body;

      const contact = await storage.updateContact(contactId, updates);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      await updateProjectZip();
      res.json(contact);
    } catch (error) {
      console.error("Update contact error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete contact
  app.delete("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const contactId = parseInt(req.params.id);
      const success = await storage.deleteContact(contactId);
      
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }

      await updateProjectZip();
      res.json({ success: true });
    } catch (error) {
      console.error("Delete contact error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete all contacts
  app.delete("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const deletedCount = await storage.deleteAllContacts();
      await updateProjectZip();
      res.json({ success: true, deletedCount });
    } catch (error) {
      console.error("Delete all contacts error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get admin stats
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getContactStats();
      res.json(stats);
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Export VCF
  app.get("/api/admin/export/vcf", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      const vcfContent = generateVCF(contacts);
      const filename = getVCFFilename();

      res.setHeader("Content-Type", "text/vcard");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(vcfContent);
    } catch (error) {
      console.error("VCF export error:", error);
      res.status(500).json({ error: "Export failed" });
    }
  });

  // Export CSV
  app.get("/api/admin/export/csv", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      const csvContent = generateCSV(contacts);
      const filename = getCSVFilename();

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(csvContent);
    } catch (error) {
      console.error("CSV export error:", error);
      res.status(500).json({ error: "Export failed" });
    }
  });

  // Get settings
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get settings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update settings
  app.patch("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const validation = insertSettingsSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid settings data" });
      }

      const settings = await storage.updateSettings(validation.data);
      await updateProjectZip();
      res.json(settings);
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Send broadcast email
  app.post("/api/admin/broadcast/message", requireAdmin, async (req, res) => {
    try {
      const { subject, message } = req.body;

      if (!emailService.isConfigured()) {
        return res.status(400).json({ error: "SMTP not configured" });
      }

      const contacts = await storage.getContacts({ withEmail: true });
      const emails = contacts
        .filter(c => c.email)
        .map(c => c.email as string);

      if (emails.length === 0) {
        return res.status(400).json({ error: "No contacts with email found" });
      }

      const results = await emailService.sendBulkEmail(emails, subject, message);
      
      const successful = results.filter(r => r.status === "fulfilled").length;
      const failed = results.filter(r => r.status === "rejected").length;

      res.json({
        success: true,
        sent: successful,
        failed,
        total: emails.length,
      });
    } catch (error) {
      console.error("Broadcast email error:", error);
      res.status(500).json({ error: "Broadcast failed" });
    }
  });

  // Send VCF by email
  app.post("/api/admin/broadcast/vcf", requireAdmin, async (req, res) => {
    try {
      if (!emailService.isConfigured()) {
        return res.status(400).json({ error: "SMTP not configured" });
      }

      const contacts = await storage.getContacts({ withEmail: true });
      const emails = contacts
        .filter(c => c.email)
        .map(c => c.email as string);

      if (emails.length === 0) {
        return res.status(400).json({ error: "No contacts with email found" });
      }

      // Generate VCF
      const allContacts = await storage.getContacts();
      const vcfContent = generateVCF(allContacts);
      const filename = getVCFFilename();

      const subject = "Fichier VCF - STATUS CONTACTS🇭🇹";
      const message = `
        <h2>Votre fichier de contacts STATUS CONTACTS🇭🇹</h2>
        <p>Bonjour,</p>
        <p>Vous trouverez en pièce jointe le fichier VCF contenant tous les contacts de notre communauté.</p>
        <p>Pour importer ces contacts sur votre téléphone :</p>
        <ol>
          <li>Téléchargez le fichier VCF en pièce jointe</li>
          <li>Ouvrez le fichier avec votre application de contacts</li>
          <li>Confirmez l'importation</li>
        </ol>
        <p>Cordialement,<br>L'équipe STATUS CONTACTS🇭🇹</p>
      `;

      const attachments = [{
        filename,
        content: vcfContent,
        contentType: "text/vcard",
      }];

      const results = await emailService.sendBulkEmail(
        emails,
        subject,
        message,
        attachments
      );

      const successful = results.filter(r => r.status === "fulfilled").length;
      const failed = results.filter(r => r.status === "rejected").length;

      res.json({
        success: true,
        sent: successful,
        failed,
        total: emails.length,
      });
    } catch (error) {
      console.error("VCF broadcast error:", error);
      res.status(500).json({ error: "VCF broadcast failed" });
    }
  });

  // Test email configuration
  app.post("/api/admin/test-email", requireAdmin, async (req, res) => {
    try {
      if (!emailService.isConfigured()) {
        return res.status(400).json({ error: "SMTP not configured" });
      }

      const testResult = await emailService.testConnection();
      res.json({ success: true, message: "SMTP configuration is working" });
    } catch (error) {
      console.error("Email test error:", error);
      res.status(500).json({ error: "SMTP test failed", details: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
