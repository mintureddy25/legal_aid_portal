import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { generateReference } from '../common/reference';

@Injectable()
export class CasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateCaseDto) {
    const reference = await this.uniqueReference();
    const legalCase = await this.prisma.case.create({
      data: {
        reference,
        category: dto.category,
        name: dto.name,
        age: dto.age,
        phone: dto.phone,
        email: dto.email,
        state: dto.state,
        language: dto.language ?? 'English',
        summary: dto.summary,
        description: dto.description,
        urgency: dto.urgency ?? 'MEDIUM',
        priorConsult: dto.priorConsult ?? false,
        documents: dto.documents,
      },
    });

    // Fire notifications without blocking the response on email latency.
    void this.notifications.sendCaseNotifications({
      reference: legalCase.reference,
      name: legalCase.name,
      email: legalCase.email,
      phone: legalCase.phone,
      state: legalCase.state,
      category: legalCase.category,
      urgency: legalCase.urgency,
      summary: legalCase.summary,
      description: legalCase.description,
    });

    return { reference: legalCase.reference, id: legalCase.id };
  }

  private async uniqueReference(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const ref = generateReference();
      const existing = await this.prisma.case.findUnique({ where: { reference: ref } });
      if (!existing) return ref;
    }
    // Extremely unlikely; fall back to a timestamp-suffixed code.
    return `${generateReference()}${Date.now().toString(36).slice(-3).toUpperCase()}`;
  }
}
