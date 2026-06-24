import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatSender } from '@prisma/client';
import { ChatService } from './chat.service';

type Role = 'CLIENT' | 'LAWYER';
interface SocketState {
  role: Role;
  // for clients: the single case they are bound to
  caseId?: string;
  reference?: string;
}

const room = (caseId: string) => `case:${caseId}`;
const LAWYERS = 'lawyers';

/**
 * Live chat. One Socket.IO room per case. A client socket is bound to exactly one
 * case (joined on connect via its reference). The lawyer socket authenticates with a
 * JWT, sits in the `lawyers` room for inbox notifications, and joins many case rooms
 * on demand — that's how one lawyer answers many clients concurrently.
 *
 * Every message is persisted, so history survives disconnects and a client can read
 * the lawyer's reply later even if they were offline when it was sent.
 */
@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chat: ChatService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    const { token, reference } = client.handshake.auth ?? {};
    try {
      if (token) {
        // Lawyer / owner
        this.jwt.verify(token, { secret: this.config.get('JWT_SECRET') ?? 'dev_secret' });
        (client.data as SocketState) = { role: 'LAWYER' };
        client.join(LAWYERS);
        client.emit('chat:ready', { role: 'LAWYER' });
        return;
      }
      if (reference) {
        const c = await this.chat.caseByReference(String(reference));
        if (!c) {
          client.emit('chat:error', { message: 'Invalid reference number' });
          client.disconnect();
          return;
        }
        (client.data as SocketState) = { role: 'CLIENT', caseId: c.id, reference: c.reference };
        client.join(room(c.id));
        await this.chat.markRead(c.id, false);
        const history = await this.chat.history(c.id);
        client.emit('chat:ready', { role: 'CLIENT', case: c, history });
        return;
      }
      client.emit('chat:error', { message: 'Missing auth (token or reference)' });
      client.disconnect();
    } catch {
      client.emit('chat:error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  /** Lawyer opens a specific case room and gets its history. */
  @SubscribeMessage('chat:open')
  async open(@ConnectedSocket() client: Socket, @MessageBody() body: { caseId: string }) {
    const state = client.data as SocketState;
    if (state.role !== 'LAWYER') return { error: 'forbidden' };
    const c = await this.chat.caseById(body.caseId);
    if (!c) return { error: 'not_found' };
    client.join(room(c.id));
    await this.chat.markRead(c.id, true);
    const history = await this.chat.history(c.id);
    return { case: c, history };
  }

  /** Lawyer inbox of active chats. */
  @SubscribeMessage('chat:inbox')
  async inbox(@ConnectedSocket() client: Socket) {
    const state = client.data as SocketState;
    if (state.role !== 'LAWYER') return { error: 'forbidden' };
    return this.chat.activeChats();
  }

  /** Send a message. Sender derived from socket role; clients can only post to their own case. */
  @SubscribeMessage('chat:send')
  async send(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { caseId?: string; text: string },
  ) {
    const state = client.data as SocketState;
    const text = (body.text ?? '').trim();
    if (!text) return { error: 'empty' };

    let caseId: string | undefined;
    let sender: ChatSender;
    if (state.role === 'CLIENT') {
      caseId = state.caseId;
      sender = ChatSender.CLIENT;
    } else {
      caseId = body.caseId;
      sender = ChatSender.LAWYER;
    }
    if (!caseId) return { error: 'no_case' };

    const msg = await this.chat.saveMessage(caseId, sender, text.slice(0, 4000));
    this.server.to(room(caseId)).emit('chat:message', msg);
    // Notify the lawyer inbox even if the lawyer hasn't opened this room.
    if (sender === ChatSender.CLIENT) {
      this.server.to(LAWYERS).emit('chat:notify', { caseId, message: msg });
    }
    return { ok: true, message: msg };
  }

  /** Lightweight typing relay. */
  @SubscribeMessage('chat:typing')
  typing(@ConnectedSocket() client: Socket, @MessageBody() body: { caseId?: string }) {
    const state = client.data as SocketState;
    const caseId = state.role === 'CLIENT' ? state.caseId : body.caseId;
    if (!caseId) return;
    client.to(room(caseId)).emit('chat:typing', { role: state.role });
  }
}
