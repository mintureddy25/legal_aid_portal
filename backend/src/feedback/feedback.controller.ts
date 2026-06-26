import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class FeedbackDto {
  @IsInt() @Min(1) @Max(5) serviceRating!: number;
  @IsInt() @Min(1) @Max(5) websiteRating!: number;
  @IsString() @MinLength(5) @MaxLength(4000) message!: string;
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MaxLength(160) email?: string;
}

class HandledDto {
  @IsBoolean() handled!: boolean;
}

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  // Public: save feedback submitted from the website.
  @Post()
  async submit(@Body() dto: FeedbackDto) {
    await this.feedback.create(dto);
    return { ok: true };
  }

  // Admin: read feedback.
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  list() {
    return this.feedback.list();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id')
  setHandled(@Param('id') id: string, @Body() dto: HandledDto) {
    return this.feedback.markHandled(id, dto.handled);
  }
}
