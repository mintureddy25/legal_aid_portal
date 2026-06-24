# Legal Aid Portal

Pro bono legal aid portal — async intake + notifications + admin dashboard + case tracking + blog + appointments + **live lawyer↔client chat (WebSockets)**.

## Stack
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind. Navy `#0a2540` / green `#1D9E75`.
- **Backend:** NestJS + Prisma + PostgreSQL + Socket.IO.
- **Email:** Nodemailer over Gmail SMTP (client's Gmail app password). SMS/WhatsApp: stubbed for later.
- **Storage:** PostgreSQL only (no Google Sheets).
- **Deploy (later):** Shiva's free EC2.

## Local dev
```bash
docker compose up -d            # Postgres on :5544
cd backend && pnpm install && pnpm prisma migrate dev && pnpm start:dev   # :3010
cd frontend && pnpm install && pnpm dev                                   # :3000
```
