import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContentStatus, UserRole } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { SongsService } from './songs.service';

class UpsertSongDto {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsString()
  genreId!: string;
}

class SongStatusDto {
  @IsEnum(ContentStatus)
  status!: ContentStatus;
}

@ApiTags('songs')
@Controller('api/v1/songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('sort') sort?: 'newest' | 'views' | 'alphabetical'
  ) {
    return this.songsService.listPublic({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      q,
      sort
    });
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.songsService.detail(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: UpsertSongDto) {
    return this.songsService.adminCreate(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpsertSongDto) {
    return this.songsService.adminUpdate(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: SongStatusDto) {
    return this.songsService.adminUpdateStatus(id, dto.status);
  }
}
