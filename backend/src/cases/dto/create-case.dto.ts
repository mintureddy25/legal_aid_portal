import {
  IsBoolean,
  IsEmail,
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
import { Urgency } from '@prisma/client';

export class CreateCaseDto {
  // Step 1
  @IsString()
  @MaxLength(60)
  category!: string;

  // Step 2 — personal
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'phone must be a 10-digit number' })
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  language?: string;

  // Step 3 — case
  @IsString()
  @MinLength(3)
  @MaxLength(140)
  summary!: string;

  @IsString()
  @MinLength(50)
  @MaxLength(5000)
  description!: string;

  @IsOptional()
  @IsEnum(Urgency)
  urgency?: Urgency;

  @IsOptional()
  @IsBoolean()
  priorConsult?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  documents?: string;
}
