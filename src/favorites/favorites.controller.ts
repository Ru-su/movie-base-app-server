import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateFavoritDto } from './dto';
import { FavoritesService } from './favorites.service';

@UseGuards(JwtGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getFavorites(@GetUser('id') userId: number) {
    return this.favoritesService.getFavorites(userId);
  }

  @Get(':id')
  getFavoritById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) favoritId: number,
  ) {
    return this.favoritesService.getFavoritById(userId, favoritId);
  }

  @Post()
  createFavorit(@GetUser('id') userId: number, @Body() dto: CreateFavoritDto) {
    return this.favoritesService.createFavorit(userId, dto);
  }

  @Delete(':id')
  deleteFavorit(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) favoritId: number,
  ) {
    return this.favoritesService.deleteFavorit(userId, favoritId);
  }
}
