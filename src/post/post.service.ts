import { Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument } from './post.schema';
import { PostCreateDto } from './dto/post-create-dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(objectPost: PostCreateDto) {
    const newPost = await new this.postModel(objectPost);
    return newPost.save();
  }

  async getPosts() {
    const foundPosts = await this.postModel.find({});
    return foundPosts;
  }
}
