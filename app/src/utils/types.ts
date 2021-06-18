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