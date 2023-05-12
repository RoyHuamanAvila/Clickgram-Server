import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { RegisterAuthDto } from '../auth/dto/register-auth-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userObject: RegisterAuthDto) {
    const newUser = await new this.userModel(userObject);
    return newUser.save();
  }

  async getUsers() {
    const foundUsers = await this.userModel.find({});
    return foundUsers;
  }

  async getUserByEmail(email: string) {
    const foundUser = await this.userModel.findOne({ email });
    return foundUser;
  }

  async getUserByUsername(username: string) {
    const foundUser = await this.userModel
      .findOne({ username })
      .populate('posts', 'content');
    return foundUser;
  }

  async getUserById(id: string) {
    const foundUser = await this.userModel.findById(id);
    return foundUser;
  }

  async addPostToUser(id: string, idPost: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        $push: {
          posts: idPost,
        },
      },
      { new: true },
    );
    return updatedUser;
  }

  async deletePostUser(id: string, idPost: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          posts: idPost,
        },
      },
      { new: true },
    );
    return updatedUser;
  }

  async followUser(id: string, idToFollow: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        $push: {
          follows: idToFollow,
        },
      },
      { new: true },
    );

    await this.userModel.findByIdAndUpdate(idToFollow, {
      $push: {
        followers: id,
      },
    });
    return updatedUser;
  }

  async unfollowUser(id: string, idToUnfollow: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          follows: idToUnfollow,
        },
      },
      { new: true },
    );

    await this.userModel.findByIdAndUpdate(idToUnfollow, {
      $pull: {
        followers: id,
      },
    });

    return updatedUser;
  }

  async updateProfilePicture(id: string, imageUrl: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        picture: imageUrl,
      },
      { new: true },
    );
    console.log(updatedUser);

    return updatedUser;
  }
}
