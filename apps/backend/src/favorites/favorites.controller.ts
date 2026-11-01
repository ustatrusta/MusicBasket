import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FavoritesService } from './favorites.service';

class AddFavoriteDto {
  @IsString()
  songId!: string;
}

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@Req() req: { user: { id: string } }) {
    return this.favoritesService.list(req.user.id);
  }

  @Post()
  add(@Req() req: { user: { id: string } }, @Body() dto: AddFavoriteDto) {
    return this.favoritesService.add(req.user.id, dto.songId);
  }

  @Delete(':songId')
  remove(@Req() req: { user: { id: string } }, @Param('songId') songId: string) {
    return this.favoritesService.remove(req.user.id, songId);
  }
}
