import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterAuthDto } from './dto/register-auth-dto';
import { compare, hash } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth-dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadAuthDto } from './dto/payload-auth-dto';

@Injectable()
export class AuthService {
  @Inject()
  userService: UserService;

  @Inject()
  jwtService: JwtService;

  async register(userObject: RegisterAuthDto) {
    const { password, fullname, username, email } = userObject;

    const foundUser = await this.userService.getUserByEmail(email);

    if (foundUser)
      throw new HttpException('Email already registered', HttpStatus.CONFLICT);

    if (!password || !fullname || !username || !email)
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );

    const passwordHash = await hash(password, 10);
    userObject = { ...userObject, password: passwordHash };

    return this.userService.createUser(userObject);
  }

  async login(userObject: LoginAuthDto) {
    const { email, password } = userObject;

    if (!password || !email)
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );

    const foundUser = await this.userService.getUserByEmail(email);
    if (!foundUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const comparePassword = await compare(password, foundUser.password);
    if (!comparePassword)
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);

    const payload: PayloadAuthDto = {
      id: foundUser._id,
      username: foundUser.username,
      fullname: foundUser.fullname,
    };
    const token = await this.jwtService.sign(payload);

    const data = {
      user: foundUser,
      token,
    };
    return data;
  }
}
