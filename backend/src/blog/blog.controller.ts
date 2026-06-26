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
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreatePostDto {
  @IsString() @MinLength(3) @MaxLength(160) title!: string;
  @IsOptional() @IsString() @MaxLength(60) category?: string;
  @IsOptional() @IsString() @MaxLength(300) excerpt?: string;
  @IsString() @MinLength(10) body!: string;
  @IsOptional() @IsString() @MaxLength(500) coverImage?: string;
  @IsOptional() @IsBoolean() published?: boolean;
}

class UpdatePostDto {
  @IsOptional() @IsString() @MinLength(3) @MaxLength(160) title?: string;
  @IsOptional() @IsString() @MaxLength(60) category?: string;
  @IsOptional() @IsString() @MaxLength(300) excerpt?: string;
  @IsOptional() @IsString() @MinLength(10) body?: string;
  @IsOptional() @IsString() @MaxLength(500) coverImage?: string;
  @IsOptional() @IsBoolean() published?: boolean;
}

@Controller('blog')
export class BlogController {
  constructor(private readonly blog: BlogService) {}

  // ── Public ──
  @Get()
  list() {
    return this.blog.publicList();
  }

  @Get('post/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.blog.publicBySlug(slug);
  }

  // ── Admin ──
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  adminList() {
    return this.blog.adminList();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  adminGet(@Param('id') id: string) {
    return this.blog.adminGet(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  create(@Body() dto: CreatePostDto) {
    return this.blog.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.blog.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.blog.remove(id);
  }
}
