import { furiApi } from 'src/utils/helpers';
import { BoardColumn, BoardModel } from 'src/utils/types';

export interface CreateBoardDto {
  title: string;
  data: BoardColumn[];
  is_public: boolean;
}

export async function createBoard(data: CreateBoardDto) {
  return await furiApi.post<BoardModel>('/board', { ...data });
}

export async function deleteBoard(id: string) {
  return await furiApi.delete(`/board/${id}`);
}

export async function updateBoard(id: string, data: Partial<BoardModel>) {
  return await furiApi.patch(`/board/${id}`, { ...data });
}

export async function getBoard(id: string) {
  return await furiApi.get<BoardModel>(`/board/${id}`);
}

export async function getAllBoards() {
  return await furiApi.get<BoardModel[]>('/board');
}
