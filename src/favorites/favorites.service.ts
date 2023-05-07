import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFavoritDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: {
        userId,
      },
    });
  }

  async getFavoritById(userId: number, id: number) {
    return this.prisma.favorite.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async createFavorit(userId: number, dto: CreateFavoritDto) {
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        ...dto,
      },
    });
    return favorite;
  }

  async deleteFavorit(userId: number, id: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        id,
      },
    });

    if (!favorite || favorite.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });
  }
}
