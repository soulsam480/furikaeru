import { User } from 'src/entities/user';
import { Request } from 'express';
export interface loginDto {
  name: string;
  email: string;
  ga_id: string;
  is_active: boolean;
  username: string;
}
export interface RequestWithUser extends Request {
  user?: Partial<User>;
}
