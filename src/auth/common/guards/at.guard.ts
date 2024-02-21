import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const ctx = context.switchToHttp();
    const token = ctx.getRequest().headers['authorization']?.slice(7);

    if (isPublic) {
      return true;
    }

    let decrypted: any;

    try {
      decrypted = this.jwtService.verify(token, {
        secret: process.env.secretForToken,
      });
      ctx.getRequest().user = decrypted;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
