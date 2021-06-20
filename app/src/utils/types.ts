export type Vote = {
  [x: string]: number;
};

export type UserComment = {
  text: string;
  likes: number;
};

export type Comment = {
  [x: string]: UserComment;
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

type BoardUser = { id: string };
export interface BoardModel {
  id: string;
  title: string;
  user: BoardUser;
  data: BoardColumn[];
  is_public: boolean;
  created_at: number;
  updated_at: number;
}
