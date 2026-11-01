import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { GenresService } from './genres.service';

class UpsertGenreDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsString()
  code!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@ApiTags('genres')
@Controller('api/v1/genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  list() {
    return this.genresService.listActive();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: UpsertGenreDto) {
    return this.genresService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpsertGenreDto) {
    return this.genresService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  archive(@Param('id') id: string) {
    return this.genresService.archive(id);
  }
}
