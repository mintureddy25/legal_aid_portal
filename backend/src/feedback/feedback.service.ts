import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface FeedbackInput {
  serviceRating: number;
  websiteRating: number;
  message: string;
  name?: string;
  email?: string;
}

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: FeedbackInput) {
    return this.prisma.feedback.create({
      data: {
        serviceRating: input.serviceRating,
        websiteRating: input.websiteRating,
        message: input.message,
        name: input.name,
        email: input.email,
      },
    });
  }

  list() {
    return this.prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } });
  }

  markHandled(id: string, handled: boolean) {
    return this.prisma.feedback.update({ where: { id }, data: { handled } });
  }
}
