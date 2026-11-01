import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TrendingService } from './trending.service';

@ApiTags('trending')
@Controller('api/v1/trending')
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @Get('songs')
  list(@Query('limit') limit?: string) {
    return this.trendingService.listSongs(limit ? Number(limit) : 10);
  }
}
