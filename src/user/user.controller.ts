import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { PayloadAuthDto } from 'src/auth/dto/payload-auth-dto';
import { Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RequestCustom } from 'src/types/ExpressCustom';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UpdateUserDto } from './dto/user-update-dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject()
  cloudinaryService: CloudinaryService;

  @Get('/:id')
  async getUserController(@Param('id') id) {
    return await this.userService.getUserById(id);
  }

  @Get('/username/:username')
  async getUserByUsernameController(@Param('username') username) {
    return await this.userService.getUserByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUsersController() {
    return await this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/follow/:id')
  async followUserController(@Req() req: Request, @Param('id') idToFollow) {
    const validateMongoId = Types.ObjectId.isValid(idToFollow);
    if (!validateMongoId)
      throw new HttpException('Enter a valid id', HttpStatus.BAD_REQUEST);

    const foundUserToFollow = await this.userService.getUserById(idToFollow);
    if (!foundUserToFollow)
      throw new HttpException('User to follow not found', HttpStatus.NOT_FOUND);

    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const decoded = await decode(token);
    const { id } = decoded as PayloadAuthDto;

    if (id === idToFollow)
      throw new HttpException(
        "You can't follow yourself",
        HttpStatus.BAD_REQUEST,
      );

    const foundUser = await this.userService.getUserById(id);

    if (foundUser.follows.includes(idToFollow))
      throw new HttpException(
        'You already follow this user',
        HttpStatus.CONFLICT,
      );

    const updatedUser = await this.userService.followUser(id, idToFollow);

    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/unfollow/:id')
  async unfollowUserController(@Req() req: Request, @Param('id') idToUnfollow) {
    const validateMongoId = Types.ObjectId.isValid(idToUnfollow);
    if (!validateMongoId)
      throw new HttpException('Enter a valid id', HttpStatus.BAD_REQUEST);

    const foundUserToUnfollow = await this.userService.getUserById(
      idToUnfollow,
    );
    if (!foundUserToUnfollow)
      throw new HttpException(
        'User to unfollow not found',
        HttpStatus.NOT_FOUND,
      );

    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const decoded = await decode(token);
    const { id } = decoded as PayloadAuthDto;

    const foundUser = await this.userService.getUserById(id);

    if (!foundUser.follows.includes(idToUnfollow))
      throw new HttpException('Unfollowed user not found', HttpStatus.CONFLICT);

    const updatedUser = await this.userService.unfollowUser(id, idToUnfollow);
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit/picture')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: multer.memoryStorage(),
    }),
  )
  async changePictureProfileController(
    @UploadedFile() picture: Express.Multer.File,
    @Req() req: RequestCustom,
    @Res() res: Response,
  ) {
    const user = req.userData;
    const { buffer } = picture;

    const secure_url = await this.cloudinaryService.uploadImage(buffer, res);
    await this.userService.updateProfilePicture(user.id, secure_url);

    return res.json({ picture: secure_url });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async updateUserController(
    @Req() req: RequestCustom,
    @Body() userObject: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const { _id } = req.userData;

      await this.userService.updateUser(_id, userObject);

      return res.json(userObject);
    } catch (error) {
      return error;
    }
  }
}
