import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private repository: Repository<CommentEntity>,
  ) {}

  async create(dto: CreateCommentDto, userId: number) {
    const comment = await this.repository.save({
      text: dto.text,
      post: { id: dto.postId },
      user: { id: userId },
    });
    return this.repository.findOne({ id: comment.id }, { relations: ['user'] });
  }

  async findAll(postId: number) {
    const queryBuilder = this.repository.createQueryBuilder('c');

    if (postId) {
      queryBuilder.where('c.postId = :postId', { postId });
    }
    const items = await queryBuilder
      .leftJoinAndSelect('c.post', 'post')
      .leftJoinAndSelect('c.user', 'user')
      .getMany();

    return items.map((item) => ({
      ...item,
      post: { id: item.post.id, title: item.post.title },
      user: {
        id: item.user.id,
        email: item.user.email,
        fullName: item.user.fullName,
      },
    }));
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, dto: UpdateCommentDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
