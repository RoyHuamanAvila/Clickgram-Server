import { Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument } from './post.schema';
import { PostCreateDto } from './dto/post-create-dto';
import { PostUpdateDto } from './dto/post-update-dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(objectPost: PostCreateDto) {
    const newPost = await new this.postModel(objectPost);
    return newPost.save();
  }

  async getPostById(id: string) {
    const foundPost = await this.postModel.findById(id);
    return foundPost;
  }

  async getPosts() {
    const foundPosts = await this.postModel.find({}).populate('owner');
    return foundPosts;
  }

  async updatePost(id: string, objectPost: PostUpdateDto) {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, objectPost, {
      new: true,
    });
    return updatedPost;
  }

  async deletePost(id: string) {
    const deletedPost = await this.postModel.findByIdAndDelete(id);
    return deletedPost;
  }
}
