import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() userId: number, @Body() dto: CreatePostDto) {
    return this.postService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User() userId: number,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.update(+id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() userId: number, @Param('id') id: string) {
    return this.postService.remove(+id, userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('/popular')
  getPopularPosts() {
    return this.postService.popular();
  }

  @Get('/search')
  SearchPosts(@Query() dto: SearchPostDto) {
    return this.postService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
}
