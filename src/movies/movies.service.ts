import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMovieDto, EditMovieDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async getMovis() {
    return this.prisma.movie.findMany({});
  }

  async getMoviById(id: number) {
    console.log(id);
    return this.prisma.movie.findFirst({
      where: {
        id,
      },
    });
  }

  async createMovie(dto: CreateMovieDto) {
    const movie = await this.prisma.movie.create({
      data: {
        ...dto,
      },
    });
    return movie;
  }

  async editMovie(id: number, dto: EditMovieDto) {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new ForbiddenException('Access denied');
    }

    return await this.prisma.movie.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteMovie(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.movie.delete({
      where: {
        id,
      },
    });
  }

  // async isAdmin(){}
}
