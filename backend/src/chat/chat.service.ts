import { Injectable } from '@nestjs/common';
import { ChatSender } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  caseByReference(reference: string) {
    return this.prisma.case.findUnique({
      where: { reference: reference.trim().toUpperCase() },
      select: { id: true, reference: true, name: true, status: true },
    });
  }

  caseById(id: string) {
    return this.prisma.case.findUnique({
      where: { id },
      select: { id: true, reference: true, name: true, status: true },
    });
  }

  history(caseId: string, limit = 100) {
    return this.prisma.chatMessage.findMany({
      where: { caseId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  saveMessage(caseId: string, sender: ChatSender, body: string) {
    return this.prisma.chatMessage.create({
      data: { caseId, sender, body },
    });
  }

  /** Mark the *other* party's messages as read when one side opens the room. */
  markRead(caseId: string, readerIsLawyer: boolean) {
    return this.prisma.chatMessage.updateMany({
      where: {
        caseId,
        readAt: null,
        sender: readerIsLawyer ? ChatSender.CLIENT : ChatSender.LAWYER,
      },
      data: { readAt: new Date() },
    });
  }

  /** Lawyer's inbox: every case that has at least one message, newest activity first. */
  async activeChats() {
    const cases = await this.prisma.case.findMany({
      where: { messages: { some: {} } },
      select: {
        id: true,
        reference: true,
        name: true,
        status: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: {
          select: { messages: { where: { sender: ChatSender.CLIENT, readAt: null } } },
        },
      },
    });
    return cases
      .map((c) => ({
        id: c.id,
        reference: c.reference,
        name: c.name,
        status: c.status,
        lastMessage: c.messages[0] ?? null,
        unread: c._count.messages,
      }))
      .sort(
        (a, b) =>
          (b.lastMessage?.createdAt.getTime() ?? 0) - (a.lastMessage?.createdAt.getTime() ?? 0),
      );
  }
}
