import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { SearchPostDto } from './dto/search-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity) private repository: Repository<PostEntity>,
  ) {}
  create(dto: CreatePostDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find({
      order: { createAt: 'DESC' },
    });
  }

  async popular() {
    const queryBuilder = this.repository.createQueryBuilder();
    queryBuilder.orderBy('views', 'DESC');
    queryBuilder.limit(10);
    const [posts, count] = await queryBuilder.getManyAndCount();
    return { posts, count };
  }

  async search(dto: SearchPostDto) {
    const queryBuilder = this.repository.createQueryBuilder('post');
    const iLike = (value: string, dtoValue) => {
      if (!dtoValue) return;
      // where перетирает значение
      // нужно использовать andWhere чтобы отправлять несколько query запросов
      queryBuilder.andWhere(`post.${value} ILIKE :${value}`);
    };
    queryBuilder.limit(dto.limit || 0);
    queryBuilder.take(dto.take || 10);

    if (dto.views) {
      queryBuilder.orderBy('views', dto.views);
    }
    iLike('body', dto.body);
    iLike('title', dto.title);
    iLike('tag', dto.tag);

    queryBuilder.setParameters({
      title: `%${dto.title}%`,
      body: `%${dto.body}%`,
    });

    const [posts, count] = await queryBuilder.getManyAndCount();
    return { posts, count };
  }

  async findOne(id: number) {
    await this.repository
      .createQueryBuilder('posts')
      .whereInIds(id)
      .update()
      .set({
        views: () => 'views + 1',
      })
      .execute();

    return this.repository.findOne(id);
  }

  async update(id: number, dto: UpdatePostDto) {
    const foundPost = await this.repository.findOne(id);
    if (!foundPost) {
      throw new NotFoundException('Статия не найдена');
    }
    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const foundPost = await this.repository.findOne(id);
    if (!foundPost) {
      throw new NotFoundException('Статия не найдена');
    }
    return this.repository.delete(id);
  }
}
