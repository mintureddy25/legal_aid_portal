import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CasesModule } from './cases/cases.module';
import { TrackingModule } from './tracking/tracking.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BlogModule } from './blog/blog.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ChatModule } from './chat/chat.module';
import { ContactModule } from './contact/contact.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    NotificationsModule,
    AuthModule,
    CasesModule,
    TrackingModule,
    AdminModule,
    BlogModule,
    AppointmentsModule,
    ChatModule,
    ContactModule,
    FeedbackModule,
  ],
})
export class AppModule {}
