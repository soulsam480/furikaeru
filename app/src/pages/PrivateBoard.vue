<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Draggable from 'src/components/App/Draggable.vue';
import type { BoardModel, Card } from 'src/utils/types';
import { useRoute } from 'vue-router';
import { useUser } from 'src/store/user';
import { v4 } from 'uuid';
import FButton from 'src/components/lib/FButton.vue';
import EditContent from 'src/components/App/EditContent.vue';
import { getBoard, updateBoard } from 'src/utils/boardService';

const {
  params: { id: bid },
} = useRoute();
const { getUser, showLoader, hideLoader } = useUser();

const board = ref<BoardModel>();
const enabled = ref(true);
const isEditColumnName = ref<string | null>(null);
const isEditBoardName = ref<string | null>(null);
const newCardName = ref('');
const isNewCard = ref<string | null>(null);
const getUserId = computed(() => getUser.value.id);

async function getPrivateBoard() {
  try {
    const { data } = await getBoard(bid as string);
    board.value = { ...data };
  } catch (error) {
    console.log(error);
  }
}

async function updateBoardEmit(id: string, board: BoardModel) {
  try {
    await updateBoard(id, board);
    await getPrivateBoard();
  } catch (error) {
    console.log(error);
  }
}

function vote(card: Card, uid: string): Card {
  const { votes } = card;
  const userVoted = Object.keys(votes).includes(uid);

  if (!userVoted) {
    votes[uid] = 1;
  } else {
    votes[uid] = votes[uid] + 1;
  }
  return { ...card, votes };
}

function upVote(e: { cid: string; coid: string }) {
  const { cid, coid } = e;

  const column = board.value?.data.filter((el) => el.id === coid)[0];

  if (!column) {
    return console.log('not found');
  }
  let card = column?.data.filter((el) => el.id === cid)[0];

  if (!card) {
    return console.log('not found');
  }

  card = vote(card, getUserId.value as string);

  column?.data.splice(
    column?.data.findIndex((el) => el.id === card?.id),
    1,
    { ...card },
  );

  board.value?.data.splice(
    board.value.data.findIndex((el) => el.id === column.id),
    1,
    { ...column },
  );

  updateBoardEmit(bid as string, board.value as BoardModel);
}

function handleColumnNameChange(e: string, id: string) {
  const column = board.value?.data.filter((el) => el.id === id)[0];
  if (!column) return;
  column.name = e;

  isEditColumnName.value = null;
  updateBoardEmit(bid as string, board.value as BoardModel);
}

function handleBoardNameChange(e: string) {
  isEditBoardName.value = null;
  (board.value as BoardModel).title = e;
  updateBoardEmit(bid as string, board.value as BoardModel);
}

function handleCardAddition(id: string) {
  if (!newCardName.value) return;
  const card: Card = {
    id: v4(),
    title: newCardName.value,
    votes: {},
    user_id: getUserId.value as string,
    comments: {},
  };

  const idx = board.value?.data.findIndex((el) => el.id === id);
  if (idx !== -1) {
    board.value?.data[idx as number].data.push({ ...card });
  }
  updateBoardEmit(bid as string, board.value as BoardModel);

  newCardName.value = '';
  isNewCard.value = null;
}

onMounted(async () => {
  showLoader();
  await getPrivateBoard();
  hideLoader();
});
</script>
<template>
  <div class="board">
    <div class="mb-4">
      <div class="flex" v-if="isEditBoardName !== board?.id">
        <div class="text-2xl font-semibold flex-grow sm:mr-1 sm:flex-none break-word dark:text-white">
          {{ board?.title }}
        </div>
        <div class="flex-none">
          <FButton
            title="Edit board title"
            flat
            @click="isEditBoardName = board.id"
            sm
            icon="ion:pencil"
            class="dark:text-white dark:hover:text-black"
            size="15px"
          />
        </div>
      </div>
      <div v-else class="flex items-center">
        <EditContent :content="board.title" @save="handleBoardNameChange" @cancel="isEditBoardName = null" />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 board-grid">
      <div v-for="column in board?.data" :key="column.id">
        <div class="pb-2">
          <div class="flex" v-if="isEditColumnName !== column.id">
            <div class="text-lg flex-grow break-word dark:text-white">{{ column.name }}</div>
            <div class="flex-none">
              <FButton
                title="Edit column title"
                @click="isEditColumnName = column.id"
                flat
                icon="ion:pencil"
                class="dark:text-white dark:hover:text-black"
                sm
              />
            </div>
          </div>
          <div v-else class="flex items-center">
            <EditContent
              :content="column.name"
              @save="handleColumnNameChange($event, column.id)"
              @cancel="isEditColumnName = null"
            />
          </div>
        </div>

        <FButton
          @click="isNewCard = column.id"
          block
          icon="ion:add"
          class="text-xs"
          title="Add a new card"
          center
          label="Add"
          sm
        />

        <div class="w-full flex py-1" v-if="isNewCard === column.id">
          <input
            type="text"
            class="rounded-md border-none bg-cyan-100 flex-grow py-1 mr-1 focus:shadow-none"
            v-model="newCardName"
            placeholder="New card title"
            @keyup.enter="handleCardAddition(column.id)"
          />
          <div class="flex-none flex">
            <FButton
              @click="handleCardAddition(column.id)"
              :disabled="!newCardName"
              title="Save"
              flat
              icon="ion:checkmark"
              sm
              class="dark:text-white dark:hover:text-black"
            />
            <FButton
              @click="(isNewCard = null), (newCardName = '')"
              title="Cancel"
              class="dark:text-white dark:hover:text-black"
              flat
              icon="ion:close"
              sm
            />
          </div>
        </div>
        <Draggable
          :list="column.data"
          :enabled="enabled"
          group="board"
          v-bind="$attrs"
          @upvote="upVote({ cid: $event.cid, coid: column.id })"
          @end="updateBoardEmit(board?.id, board)"
          :user-id="getUserId"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.not-draggable {
  cursor: no-drop;
}
.board-grid {
  &__column {
    &__item {
      :hover > & {
        &__edit {
          visibility: visible;
          transition-property: display;
          transition-timing-function: ease-in-out;
          transition-delay: 400ms;
        }
      }
      &__edit {
        visibility: hidden;
      }
    }
  }
}
</style>