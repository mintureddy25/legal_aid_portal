import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { AppointmentStatus } from '@prisma/client';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class BookDto {
  @IsString() slotId!: string;
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @IsString() @Matches(/^\d{10}$/, { message: 'phone must be a 10-digit number' }) phone!: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() @MaxLength(300) reason?: string;
  @IsOptional() @IsString() @MaxLength(20) caseRef?: string;
}

class CreateSlotsDto {
  @IsArray() @IsDateString({}, { each: true }) starts!: string[];
  @IsOptional() @IsInt() @Min(5) @Max(120) durationMin?: number;
}

class UpdateBookingStatusDto {
  @IsEnum(AppointmentStatus) status!: AppointmentStatus;
}

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appts: AppointmentsService) {}

  // ── Public ──
  @Get('slots')
  slots() {
    return this.appts.availableSlots();
  }

  @Post('book')
  book(@Body() dto: BookDto) {
    return this.appts.book(dto);
  }

  // ── Admin ──
  @UseGuards(JwtAuthGuard)
  @Get('admin/slots')
  allSlots() {
    return this.appts.allSlots();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/bookings')
  bookings() {
    return this.appts.bookings();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/bookings/:id/status')
  setBookingStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.appts.setStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/slots')
  createSlots(@Body() dto: CreateSlotsDto) {
    return this.appts.createSlots(
      dto.starts.map((s) => new Date(s)),
      dto.durationMin ?? 15,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/slots/:id')
  deleteSlot(@Param('id') id: string) {
    return this.appts.deleteSlot(id);
  }
}
