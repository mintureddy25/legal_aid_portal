import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface CaseNotificationData {
  reference: string;
  name: string;
  email?: string | null;
  phone: string;
  state?: string | null;
  category: string;
  urgency: string;
  summary: string;
  description: string;
}

/**
 * All outbound client/admin notifications.
 * Email is live (Nodemailer + Gmail SMTP). SMS + WhatsApp are stubbed behind the
 * same method signatures so they can be wired later without touching callers.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get('SMTP_PORT') ?? 587),
        secure: Number(this.config.get('SMTP_PORT') ?? 587) === 465,
        auth: { user, pass },
      });
    } else {
      this.logger.warn('SMTP not configured — emails will be logged, not sent.');
    }
  }

  /** Fire all channels for a new case. Never throws — notification failure must not fail intake. */
  async sendCaseNotifications(data: CaseNotificationData): Promise<void> {
    await Promise.allSettled([
      this.emailClientConfirmation(data),
      this.emailAdmin(data),
      this.sendSms(data),
      this.sendWhatsApp(data),
    ]);
  }

  private from(): string {
    const name = this.config.get<string>('MAIL_FROM_NAME') ?? 'Nyaya Seva';
    const user = this.config.get<string>('SMTP_USER');
    return `"${name}" <${user}>`;
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.log(`[email:dev] to=${to} subject="${subject}"`);
      return;
    }
    try {
      await this.transporter.sendMail({ from: this.from(), to, subject, html });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (e) {
      this.logger.error(`Email to ${to} failed: ${(e as Error).message}`);
    }
  }

  private async emailClientConfirmation(data: CaseNotificationData) {
    if (!data.email) return;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
        <div style="background:#0a2540;padding:20px 24px;color:#fff">
          <h2 style="margin:0;font-size:18px">Nyaya Seva</h2>
        </div>
        <div style="padding:24px;color:#0f172a;line-height:1.6">
          <p>Hi ${data.name},</p>
          <p>Your legal aid request has been received. Our team will contact you within <b>24 hours</b>.</p>
          <p style="font-size:15px">Your reference number:</p>
          <p style="font-size:24px;font-weight:700;color:#1D9E75;letter-spacing:1px">${data.reference}</p>
          <table style="width:100%;font-size:14px;border-collapse:collapse;margin-top:8px">
            <tr><td style="padding:4px 0;color:#64748b">Category</td><td style="padding:4px 0">${data.category}</td></tr>
            <tr><td style="padding:4px 0;color:#64748b">Urgency</td><td style="padding:4px 0">${data.urgency}</td></tr>
          </table>
          <p style="margin-top:16px"><b>What happens next?</b><br/>A volunteer will review your case and reach out on the phone/email you provided.</p>
          <p style="background:#fef3c7;border-radius:8px;padding:12px;font-size:13px">
            For urgent matters you can also call the <b>NALSA helpline: 15100</b> (toll-free).
          </p>
          <p style="color:#94a3b8;font-size:12px">— Nyaya Seva (pro bono initiative)</p>
        </div>
      </div>`;
    await this.send(data.email, `Your Nyaya Seva request — ${data.reference}`, html);
  }

  private async emailAdmin(data: CaseNotificationData) {
    const to = this.config.get<string>('ADMIN_EMAIL');
    if (!to) return;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px">
        <h2 style="color:#0a2540">New case: ${data.reference}</h2>
        <table style="width:100%;font-size:14px;border-collapse:collapse">
          ${row('Reference', data.reference)}
          ${row('Name', data.name)}
          ${row('Phone', data.phone)}
          ${row('Email', data.email ?? '—')}
          ${row('State', data.state ?? '—')}
          ${row('Category', data.category)}
          ${row('Urgency', data.urgency)}
          ${row('Summary', data.summary)}
        </table>
        <h3 style="color:#0a2540">Description</h3>
        <p style="white-space:pre-wrap;font-size:14px;background:#f1f5f9;padding:12px;border-radius:8px">${escapeHtml(
          data.description,
        )}</p>
      </div>`;
    await this.send(to, `[New Case ${data.urgency}] ${data.reference} — ${data.name}`, html);
  }

  /** Booking confirmation to client + notification to the owner. */
  async sendAppointmentEmails(a: {
    name: string;
    email?: string | null;
    startsAt: Date;
    durationMin: number;
    reason?: string | null;
  }): Promise<void> {
    // Always render in Indian Standard Time (the server runs in UTC).
    const whenIST = a.startsAt.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    });
    const whenSubject = `${whenIST} IST`;
    const whenBody = `${whenIST} IST (Indian Standard Time)`;
    if (a.email) {
      await this.send(
        a.email,
        `Your free consultation is booked — ${whenSubject}`,
        `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <p>Hi ${a.name},</p>
          <p>Your free <b>${a.durationMin}-minute</b> legal consultation is booked for:</p>
          <p style="font-size:18px;font-weight:700;color:#1D9E75">${whenBody}</p>
          <p>We'll call you at the number you provided. — Nyaya Seva</p>
        </div>`,
      );
    }
    const admin = this.config.get<string>('ADMIN_EMAIL');
    if (admin) {
      await this.send(
        admin,
        `[New Booking] ${a.name} — ${whenSubject}`,
        `<div style="font-family:Arial,sans-serif">
          <h3 style="color:#0a2540">New appointment</h3>
          <p><b>Name:</b> ${a.name}<br/><b>When:</b> ${whenBody}<br/>
          <b>Duration:</b> ${a.durationMin} min<br/>
          <b>Reason:</b> ${a.reason ?? '—'}</p>
        </div>`,
      );
    }
  }

  // ── Stubbed channels — wire Fast2SMS / Twilio later ──────────────────
  private async sendSms(data: CaseNotificationData): Promise<void> {
    if (this.config.get('SMS_ENABLED') !== 'true') {
      this.logger.debug(`[sms:stub] to=${data.phone} ref=${data.reference}`);
      return;
    }
    // TODO: Fast2SMS / Twilio integration
  }

  private async sendWhatsApp(data: CaseNotificationData): Promise<void> {
    if (this.config.get('WHATSAPP_ENABLED') !== 'true') {
      this.logger.debug(`[whatsapp:stub] to=${data.phone} ref=${data.reference}`);
      return;
    }
    // TODO: Twilio WhatsApp / WATI integration
  }
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 8px;color:#64748b;border-bottom:1px solid #e5e7eb">${label}</td><td style="padding:6px 8px;border-bottom:1px solid #e5e7eb">${escapeHtml(
    value,
  )}</td></tr>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
