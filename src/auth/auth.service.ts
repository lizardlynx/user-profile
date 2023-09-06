import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/SignIn.dto';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccountNotVerifiedException } from 'src/exceptions/accountNotVerified.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(signInDto);
    if (user.active == false) throw new AccountNotVerifiedException();
    const payload = { username: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(signInDto: SignInDto) {
    const { login, password } = signInDto;
    const user = await this.usersService.getUserByLogin(login);
    if (!user) throw new NotFoundException();
    else if (user.active == false) throw new AccountNotVerifiedException();
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) throw new UnauthorizedException();
    return user;
  }
}
