import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import config from '../../../config/configurations';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().jwtSecretKey,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const candidate = { id: payload.sub, email: payload.email };
    const userData = await this.userService.findByCond(candidate);

    if (!userData) {
      throw new UnauthorizedException({
        message: 'нет доступа к этой странице ',
      });
    }
    const { password, ...user } = userData;
    return user;
  }
}
