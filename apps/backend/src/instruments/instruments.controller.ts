import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstrumentsService } from './instruments.service';

@ApiTags('instruments')
@Controller('api/v1/instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get()
  list() {
    return this.instrumentsService.list();
  }
}
