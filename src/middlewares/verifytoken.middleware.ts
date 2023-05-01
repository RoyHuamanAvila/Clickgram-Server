import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { decode } from 'jsonwebtoken';
import { PayloadAuthDto } from 'src/auth/dto/payload-auth-dto';
import { RequestCustom } from 'src/types/ExpressCustom';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  @Inject()
  userService: UserService;

  async use(req: RequestCustom, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const decoded = await decode(token);
    const { id } = decoded as PayloadAuthDto;

    const foundUser = await this.userService.getUserById(id);
    req.userData = foundUser;

    next();
  }
}
