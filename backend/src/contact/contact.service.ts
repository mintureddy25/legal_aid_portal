import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: ContactInput) {
    return this.prisma.contactMessage.create({
      data: {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      },
    });
  }

  list() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  markHandled(id: string, handled: boolean) {
    return this.prisma.contactMessage.update({ where: { id }, data: { handled } });
  }
}
