import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface BookInput {
  slotId: string;
  name: string;
  phone: string;
  email?: string;
  reason?: string;
  caseRef?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /** Public: upcoming free slots. */
  availableSlots() {
    return this.prisma.slot.findMany({
      where: { isBooked: false, startsAt: { gte: new Date() } },
      orderBy: { startsAt: 'asc' },
    });
  }

  /** Public: book a slot atomically so two clients can't grab the same one. */
  async book(input: BookInput) {
    const slot = await this.prisma.slot.findUnique({ where: { id: input.slotId } });
    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.isBooked) throw new BadRequestException('That slot is no longer available');

    const result = await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.slot.updateMany({
        where: { id: input.slotId, isBooked: false },
        data: { isBooked: true },
      });
      if (claimed.count === 0) throw new BadRequestException('That slot is no longer available');
      return tx.appointment.create({
        data: {
          slotId: input.slotId,
          name: input.name,
          phone: input.phone,
          email: input.email,
          reason: input.reason,
          caseRef: input.caseRef,
        },
        include: { slot: true },
      });
    });

    void this.notifications.sendAppointmentEmails({
      name: result.name,
      email: result.email,
      startsAt: result.slot.startsAt,
      durationMin: result.slot.durationMin,
      reason: result.reason,
    });

    return { id: result.id, startsAt: result.slot.startsAt };
  }

  // ── Admin ──
  createSlot(startsAt: Date, durationMin = 15) {
    return this.prisma.slot.create({ data: { startsAt, durationMin } });
  }

  createSlots(starts: Date[], durationMin = 15) {
    return this.prisma.slot.createMany({
      data: starts.map((startsAt) => ({ startsAt, durationMin })),
    });
  }

  async deleteSlot(id: string) {
    const slot = await this.prisma.slot.findUnique({ where: { id } });
    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.isBooked) throw new BadRequestException('Cannot delete a booked slot');
    await this.prisma.slot.delete({ where: { id } });
    return { ok: true };
  }

  allSlots() {
    return this.prisma.slot.findMany({
      orderBy: { startsAt: 'asc' },
      include: { appointment: true },
    });
  }

  bookings() {
    return this.prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { slot: true },
    });
  }
}
