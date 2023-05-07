import { IsString } from 'class-validator';

export class CreateFavoritDto {
  @IsString()
  title: string;

  @IsString()
  poster: string;
}
