import {
  Injectable,
  CanActivate,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token);
      req['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type == 'Bearer' ? token : null;
  }
}
