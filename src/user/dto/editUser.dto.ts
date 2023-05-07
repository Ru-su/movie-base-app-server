import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  fisrstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
