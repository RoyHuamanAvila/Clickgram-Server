import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostCreateDto } from './dto/post-create-dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { decode } from 'jsonwebtoken';
import { PayloadAuthDto } from 'src/auth/dto/payload-auth-dto';
import { UserService } from 'src/user/user.service';
import { PostUpdateDto } from './dto/post-update-dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Inject()
  userService: UserService;

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async postCreateController(
    @Body() objectPost: PostCreateDto,
    @Req() req: Request,
  ) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const decoded = await decode(token);
    const { id } = decoded as PayloadAuthDto;

    const foundUser = await this.userService.getUserById(id);

    const createdPost = await this.postService.createPost({
      ...objectPost,
      owner: foundUser._id,
    });

    return createdPost;
  }

  @Get('/')
  async getPostsController() {
    return this.postService.getPosts();
  }
}
