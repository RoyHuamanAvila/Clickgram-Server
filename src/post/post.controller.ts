import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
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
import { RequestCustom } from 'src/types/ExpressCustom';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Inject()
  userService: UserService;

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async postCreateController(
    @Body() objectPost: PostCreateDto,
    @Req() req: RequestCustom,
  ) {
    const { _id } = req.userData;

    const createdPost = await this.postService.createPost({
      ...objectPost,
      owner: _id,
    });

    await this.userService.addPostToUser(_id, createdPost.id);

    return createdPost;
  }

  @Get('/')
  async getPostsController() {
    return this.postService.getPosts();
  }

  @Patch('/:id')
  async updatePostController(
    @Body() objectPost: PostUpdateDto,
    @Req() req: RequestCustom,
    @Param('id') id: string,
  ) {
    const { userData } = req;
    const foundPost = await this.postService.getPostById(id);

    if (!foundPost)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const isOwner = foundPost.owner == userData.id;
    if (!isOwner)
      throw new HttpException(
        'This post does not belong to this user',
        HttpStatus.FORBIDDEN,
      );

    const updatedPost = await this.postService.updatePost(
      foundPost.id,
      objectPost,
    );
    return updatedPost;
  }

  @Delete('/:id')
  async deletePostController(
    @Param('id') id: string,
    @Req() req: RequestCustom,
  ) {
    const { userData } = req;
    const foundPost = await this.postService.getPostById(id);

    if (!foundPost)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const isOwner = foundPost.owner == userData.id;
    if (!isOwner)
      throw new HttpException(
        'This post does not belong to this user',
        HttpStatus.FORBIDDEN,
      );

    await this.userService.deletePostUser(userData.id, foundPost.id);

    const deletedPost = await this.postService.deletePost(foundPost.id);
    return deletedPost;
  }
}
