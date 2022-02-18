import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from '../config/configurations';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/entities/user.entity';
import { PostEntity } from './post/entities/post.entity';
import { CommentEntity } from './comment/entities/comment.entity';
import { AuthEntity } from './auth/entities/auth.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config().databasePg.host,
      port: config().databasePg.port,
      username: config().databasePg.username,
      password: config().databasePg.password,
      database: config().databasePg.database,
      entities: [UserEntity, PostEntity, CommentEntity, AuthEntity],
      synchronize: true,
    }),
    UserModule,
    PostModule,
    CommentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
