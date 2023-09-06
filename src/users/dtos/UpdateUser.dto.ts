import { IsDateString, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
