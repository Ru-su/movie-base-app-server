import { IsOptional, IsString } from 'class-validator';

export class EditMovieDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
