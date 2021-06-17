import { User } from 'src/entities/user';
import { Request } from 'express';
import { Socket } from 'socket.io';
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

export type Vote = {
  [x: string]: number;
};
export interface Card {
  id: string;
  title: string;
  votes: Vote;
  owner_id: string;
  user_id: string;
  created_date: number;
  updated_date: number;
}

export interface BoardColumn {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
  owner_id: string;
  data: Card[];
}

export interface SocketWithUser extends Socket {
  user?: User;
}
