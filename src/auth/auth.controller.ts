import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/SignIn.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  async signIn(
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    signInDto: SignInDto,
  ) {
    return await this.authService.signIn(signInDto);
  }
}
