import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, CaseStatus, Urgency } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CaseFilter {
  q?: string;
  status?: CaseStatus;
  category?: string;
  urgency?: Urgency;
  state?: string;
  from?: string;
  to?: string;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(f: CaseFilter): Prisma.CaseWhereInput {
    const where: Prisma.CaseWhereInput = {};
    if (f.status) where.status = f.status;
    if (f.category) where.category = f.category;
    if (f.urgency) where.urgency = f.urgency;
    if (f.state) where.state = f.state;
    if (f.from || f.to) {
      where.createdAt = {};
      if (f.from) where.createdAt.gte = new Date(f.from);
      if (f.to) where.createdAt.lte = new Date(f.to);
    }
    if (f.q) {
      where.OR = [
        { reference: { contains: f.q, mode: 'insensitive' } },
        { name: { contains: f.q, mode: 'insensitive' } },
        { phone: { contains: f.q, mode: 'insensitive' } },
        { summary: { contains: f.q, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  async list(f: CaseFilter) {
    const cases = await this.prisma.case.findMany({
      where: this.buildWhere(f),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reference: true,
        name: true,
        phone: true,
        category: true,
        urgency: true,
        state: true,
        status: true,
        createdAt: true,
        _count: { select: { messages: true } },
      },
    });
    return cases;
  }

  async detail(id: string) {
    const c = await this.prisma.case.findUnique({
      where: { id },
      include: {
        notes: { orderBy: { createdAt: 'desc' } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!c) throw new NotFoundException('Case not found');
    return c;
  }

  async updateStatus(id: string, status: CaseStatus) {
    await this.ensureExists(id);
    return this.prisma.case.update({ where: { id }, data: { status } });
  }

  async addNote(id: string, body: string, author: string) {
    await this.ensureExists(id);
    return this.prisma.caseNote.create({ data: { caseId: id, body, author } });
  }

  async stats() {
    const [total, pending, inProgress, responded, closed] = await Promise.all([
      this.prisma.case.count(),
      this.prisma.case.count({ where: { status: 'PENDING' } }),
      this.prisma.case.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.case.count({ where: { status: 'RESPONDED' } }),
      this.prisma.case.count({ where: { status: 'CLOSED' } }),
    ]);
    return { total, pending, inProgress, responded, closed };
  }

  async exportCsv(f: CaseFilter): Promise<string> {
    const rows = await this.prisma.case.findMany({
      where: this.buildWhere(f),
      orderBy: { createdAt: 'desc' },
    });
    const header = [
      'Reference', 'Date', 'Name', 'Age', 'Phone', 'Email',
      'State', 'Language', 'Category', 'Urgency', 'Status', 'Summary',
    ];
    const lines = [header.join(',')];
    for (const r of rows) {
      lines.push(
        [
          r.reference,
          r.createdAt.toISOString(),
          r.name,
          r.age ?? '',
          r.phone,
          r.email ?? '',
          r.state ?? '',
          r.language,
          r.category,
          r.urgency,
          r.status,
          r.summary,
        ]
          .map(csvCell)
          .join(','),
      );
    }
    return lines.join('\n');
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.case.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new NotFoundException('Case not found');
  }
}

function csvCell(v: unknown): string {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
