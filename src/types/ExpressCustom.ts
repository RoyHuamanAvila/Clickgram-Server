import { Request } from 'express';
import { User } from 'src/user/user.schema';

export interface RequestCustom extends Request {
  userData: User;
}
