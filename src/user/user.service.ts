import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';

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
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
