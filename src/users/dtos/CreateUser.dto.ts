import { IsEmail, IsNotEmpty, IsDateString, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  surname: string;

  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsDateString()
  birthDate: string;
}
