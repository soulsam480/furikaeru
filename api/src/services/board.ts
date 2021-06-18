import { BoardColumn, Card } from 'src/utils/types';

export function upVote(card: Card, uid: string): Card {
  const { votes } = card;
  const userVoted = !!votes.uid;
  if (!userVoted) {
    votes[uid] = 1;
  } else {
    votes.uid += 1;
  }
  return { ...card, updated_date: new Date().valueOf(), votes };
}

export function updateCard(card: Card, column: BoardColumn): BoardColumn {
  const { id, title } = card;
  const cardIndex = column.data.findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    column.data[cardIndex].title = title;
    column.data[cardIndex].updated_date = new Date().valueOf();
    return column;
  }
  return column;
}

export function createCard(card: Card, column: BoardColumn): BoardColumn {
  const { id } = card;
  const cardIndex = column.data.findIndex((el) => el.id === id);
  if (cardIndex === -1) {
    column.data.push({ ...card });
    return column;
  }
  return column;
}

export function deleteCard(card: Card, column: BoardColumn): BoardColumn {
  const { id } = card;
  const cardIndex = column.data.findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    column.data.splice(cardIndex, 1);
    return column;
  }
  return column;
}
