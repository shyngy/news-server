import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configurations';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: configuration().jwtSecretKey,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
