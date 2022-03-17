import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { SearchPostDto } from './dto/search-post.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { find } from 'rxjs';

type SearchPostKeys = keyof SearchPostDto;
type SearchPostValue = SearchPostDto[SearchPostKeys];
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity) private repository: Repository<PostEntity>,
  ) {}
  create(dto: CreatePostDto, userId: number) {
    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data?.text;

    return this.repository.save({
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      user: {
        id: userId,
      },
      description: firstParagraph || '',
    });
  }

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const foundPost = await this.repository.findOne(id);
    if (!foundPost) {
      throw new NotFoundException('Статья не найдена');
    }
    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data?.text;

    return this.repository.update(id, {
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      user: {
        id: userId,
      },
      description: firstParagraph || '',
    });
  }

  async remove(id: number, userId: number) {
    const foundPost = await this.repository.findOne(id);
    if (!foundPost) {
      throw new NotFoundException('Статья не найдена');
    }

    if (foundPost.user.id !== userId) {
      throw new ForbiddenException('Нет доступа к статье');
    }
    return this.repository.delete(id);
  }

  findAll() {
    return this.repository.find({
      order: { createdAt: 'DESC' },
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
    const queryBuilder = this.repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user');
    const iLike = (value: string, dtoValue: SearchPostValue) => {
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
    const findOne = await this.repository.findOne(id);
    const { password, ...user } = findOne.user;

    const newObj = {
      ...findOne,
      user,
    };

    return this.repository.findOne(id);
  }
}
