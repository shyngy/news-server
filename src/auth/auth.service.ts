import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByCond({
      email,
      password,
    });

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  makeJwtToken(data: { id: number; email: string }) {
    const payload = { email: data.email, sub: data.id };
    return this.jwtService.sign(payload);
  }

  async login(user: UserEntity) {
    return {
      ...user,
      token: this.makeJwtToken(user),
    };
  }

  async register(dto: CreateUserDto) {
    try {
      const { password, ...user } = await this.userService.create({
        email: dto.email,
        fullName: dto.fullName,
        password: dto.password,
      });
      return {
        ...user,
        token: this.makeJwtToken(user),
      };
    } catch (error) {
      throw new ForbiddenException(error.driverError.detail);
    }
  }
}
