import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('track')
export class TrackingController {
  constructor(private readonly prisma: PrismaService) {}

  /** Public status lookup. Returns only non-sensitive fields — never notes or other cases. */
  @Get(':reference')
  async track(@Param('reference') reference: string) {
    const c = await this.prisma.case.findUnique({
      where: { reference: reference.trim().toUpperCase() },
      select: {
        reference: true,
        name: true,
        category: true,
        status: true,
        urgency: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!c) throw new NotFoundException('No case found for that reference number.');
    return c;
  }
}
