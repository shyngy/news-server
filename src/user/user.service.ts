import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchPostDto } from '../post/dto/search-post.dto';
import { SearchingUserDto } from './dto/searching-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
  ) {}

  create(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return `This action returns all user`;
  }

  findById(id: number) {
    return this.repository.findOne(id);
  }
  findByCond(cond: LoginUserDto) {
    return this.repository.findOne(cond);
  }
  update(id: number, dto: UpdateUserDto) {
    return this.repository.update(id, dto);
  }

  async search(dto: SearchingUserDto) {
    const queryBuilder = this.repository.createQueryBuilder('user');
    const iLike = (value: string, dtoValue) => {
      if (!dtoValue) return;
      queryBuilder.andWhere(`user.${value} ILIKE :${value}`);
    };
    queryBuilder.limit(dto.limit || 0);
    queryBuilder.take(dto.take || 10);

    iLike('fullName', dto.fullName);
    iLike('email', dto.email);

    queryBuilder.setParameters({
      fullName: `%${dto.fullName}%`,
      email: `%${dto.email}%`,
    });

    const [posts, count] = await queryBuilder.getManyAndCount();
    return { posts, count };
  }
}
