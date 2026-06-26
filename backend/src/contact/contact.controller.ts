import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class ContactDto {
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(160) subject?: string;
  @IsString() @MinLength(5) @MaxLength(4000) message!: string;
}

class HandledDto {
  @IsBoolean() handled!: boolean;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  // Public: save a message from the website contact form.
  @Post()
  async submit(@Body() dto: ContactDto) {
    await this.contact.create(dto);
    return { ok: true };
  }

  // Admin: read messages.
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  list() {
    return this.contact.list();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id')
  setHandled(@Param('id') id: string, @Body() dto: HandledDto) {
    return this.contact.markHandled(id, dto.handled);
  }
}
