import { Body, Controller, Post } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';

@Controller('cases')
export class CasesController {
  constructor(private readonly cases: CasesService) {}

  /** Public intake-form submission. Returns the generated reference number. */
  @Post()
  create(@Body() dto: CreateCaseDto) {
    return this.cases.create(dto);
  }
}
