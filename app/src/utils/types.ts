import { ComputedRef, InjectionKey } from 'vue';
import { Alert } from 'src/utils/composables';

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
  color: string;
  data: Card[];
}

export interface BoardModel {
  id: string;
  title: string;
  user: string | null;
  data: BoardColumn[];
  is_public: boolean;
  created_at: number;
  updated_at: number;
  max_vote: number;
}

export type FLoadingBarExpose = {
  start: (inc?: number) => void;
  stop: () => void;
};

export const FLoadingKey: InjectionKey<FLoadingBarExpose> = Symbol();

export type KeyBinding = {
  key: string;
  modifier?: 'Control' | 'Alt' | 'Shift';
  handler: () => void;
};

export type KeyBindingSwitches = {
  on: () => void;
  off: () => void;
};

export type AlertAPI = {
  set: (alert: Alert) => void;
  remove: (id: string) => void;
  alerts: ComputedRef<Alert[]>;
};

export const AlertKey: InjectionKey<AlertAPI> = Symbol();
