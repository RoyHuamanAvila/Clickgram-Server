import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { RegisterAuthDto } from 'src/auth/dto/register-auth-dto';

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
}
