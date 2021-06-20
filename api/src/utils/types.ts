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
  userId?: string;
  user?: Partial<User>;
}

export type Vote = {
  [x: string]: number;
};

export type Comment = {
  [x: string]: string;
};

export interface Card {
  id: string;
  title: string;
  votes: Vote;
  user_id: string;
  comments: Comment;
}

export interface BoardColumn {
  id: string;
  name: string;
  owner_id: string;
  data: Card[];
}

export interface SocketWithUser extends Socket {
  user?: User;
}
