import nodemailer from "nodemailer";

interface EmailConfig {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    };

    if (config.host && config.user && config.pass) {
      this.transporter = nodemailer.createTransporter({
        host: config.host,
        port: config.port || 587,
        secure: config.port === 465,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });
    }
  }

  async sendEmail(to: string, subject: string, html: string, attachments?: any[]) {
    if (!this.transporter) {
      throw new Error("SMTP not configured");
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
      attachments,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendBulkEmail(recipients: string[], subject: string, html: string, attachments?: any[]) {
    if (!this.transporter) {
      throw new Error("SMTP not configured");
    }

    const promises = recipients.map(email =>
      this.sendEmail(email, subject, html, attachments)
    );

    return await Promise.allSettled(promises);
  }

  async testConnection() {
    if (!this.transporter) {
      throw new Error("SMTP not configured");
    }
    
    return await this.transporter.verify();
  }

  isConfigured() {
    return this.transporter !== null;
  }
}

export const emailService = new EmailService();
