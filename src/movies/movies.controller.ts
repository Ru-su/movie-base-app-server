import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { MoviesService } from './movies.service';
import { CreateMovieDto, EditMovieDto } from 'src/movies/dto';

@UseGuards(JwtGuard)
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  getMovisByTitle() {
    console.log();
    return this.moviesService.getMovis();
  }

  @Get(':id')
  getMovieById(@Param('id', ParseIntPipe) movieId: number) {
    console.log('id', movieId);
    return this.moviesService.getMoviById(movieId);
  }

  @Post()
  createMovie(@Body() dto: CreateMovieDto) {
    return this.moviesService.createMovie(dto);
  }

  @Patch(':id')
  async editMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() dto: EditMovieDto,
  ) {
    return this.moviesService.editMovie(movieId, dto);
  }

  @Delete(':id')
  deleteMovie(@Param('id', ParseIntPipe) movieId: number) {
    return this.moviesService.deleteMovie(movieId);
  }
}
