import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { CaseStatus, Urgency } from '@prisma/client';
import { AdminService } from './admin.service';
import type { CaseFilter } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class UpdateStatusDto {
  @IsEnum(CaseStatus)
  status!: CaseStatus;
}

class AddNoteDto {
  @IsString()
  @MinLength(1)
  body!: string;
}

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.stats();
  }

  @Get('cases')
  list(
    @Query('q') q?: string,
    @Query('status') status?: CaseStatus,
    @Query('category') category?: string,
    @Query('urgency') urgency?: Urgency,
    @Query('state') state?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.admin.list({ q, status, category, urgency, state, from, to } as CaseFilter);
  }

  @Get('cases/export')
  async exportCsv(@Res() res: Response, @Query() query: CaseFilter) {
    const csv = await this.admin.exportCsv(query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="legal-aid-cases.csv"');
    res.send(csv);
  }

  @Get('cases/:id')
  detail(@Param('id') id: string) {
    return this.admin.detail(id);
  }

  @Patch('cases/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.admin.updateStatus(id, dto.status);
  }

  @Post('cases/:id/notes')
  addNote(
    @Param('id') id: string,
    @Body() dto: AddNoteDto,
    @Req() req: { user: { username: string } },
  ) {
    return this.admin.addNote(id, dto.body, req.user.username);
  }
}
