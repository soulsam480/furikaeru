<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Draggable from 'src/components/App/Draggable.vue';
import type { BoardModel, Card } from 'src/utils/types';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from 'src/store/user';
import { v4 } from 'uuid';
import FButton from 'src/components/lib/FButton.vue';
import EditContent from 'src/components/App/EditContent.vue';
import { deleteBoard, getBoard, updateBoard } from 'src/utils/boardService';
import BoardContext from 'src/components/BoardContext.vue';
import { useAlerts } from 'src/store/alert';
import FMenu from 'src/components/lib/FMenu.vue';

const {
  params: { id: routeBid },
} = useRoute();
const { push } = useRouter();
const { getUser, showLoader, hideLoader } = useUser();
const { setAlerts } = useAlerts();

const COLORS = ['red', 'green', 'purple', 'indigo', 'amber', 'lime', 'cyan'];
const board = ref<BoardModel>();
const enabled = ref(true);
const isEditColumnName = ref<string | null>(null);
const isEditBoardName = ref<string | null>(null);
const newCardName = ref('');
const sortBy = ref('');
const isCommentsExpand = ref(false);
const isNewCard = ref<string | null>(null);
const getUserId = computed(() => getUser.value.id as string);
const bid = computed(() => {
  const id = routeBid as string;
  if (id.includes('--')) return id.split('--')[1];
  return id;
});

async function getPrivateBoard() {
  try {
    const { data } = await getBoard(bid.value);
    board.value = { ...data };
  } catch (error) {
    console.log(error);
  }
}

async function updateBoardEmit(id: string, board: BoardModel, type: 'board' | 'title' | 'type') {
  let data: any;
  switch (type) {
    case 'title':
      data = { title: board.title };
      break;

    case 'type':
      data = { is_public: board.is_public };
      break;

    default:
      data = { data: board.data };
      break;
  }

  try {
    await updateBoard(id, data);
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

  updateBoardEmit(bid.value, board.value as BoardModel, 'board');
}

function handleColumnNameChange(e: string, id: string) {
  const column = board.value?.data.filter((el) => el.id === id)[0];
  if (!column) return;
  column.name = e;

  isEditColumnName.value = null;
  updateBoardEmit(bid.value, board.value as BoardModel, 'board');
}

function handleBoardNameChange(e: string) {
  isEditBoardName.value = null;
  (board.value as BoardModel).title = e;
  updateBoardEmit(bid.value, board.value as BoardModel, 'title');
}

function handleColumnTheme(id: string, color: string) {
  const idx = board.value?.data.findIndex((el) => el.id === id);
  if (idx !== undefined && idx !== -1) {
    (board.value as BoardModel).data[idx]['color'] = color;
  }
  updateBoardEmit(bid.value, board.value as BoardModel, 'board');
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
  if (idx !== undefined && idx !== -1) {
    board.value?.data[idx].data.push({ ...card });
  }
  updateBoardEmit(bid.value, board.value as BoardModel, 'board');

  newCardName.value = '';
  isNewCard.value = null;
}

async function handleBoardRemove(id: string) {
  try {
    await deleteBoard(id);
    setAlerts({ type: 'success', message: 'Board removed successfully !' });
    push('/');
  } catch (error) {
    setAlerts({ type: 'danger', message: error });
  }
}

function handleSortedMove(e: any) {
  try {
    const { to, from } = e;

    const fromColIdx = board.value?.data.findIndex((el) => el.id === from.id);
    if (fromColIdx !== undefined && fromColIdx !== -1) {
      const removeIdx = board.value?.data[fromColIdx].data.findIndex((el) => el.id === to.data.id);
      if (removeIdx !== undefined && removeIdx !== -1) {
        board.value?.data[fromColIdx].data.splice(removeIdx, 1);
      }
    }

    const toColIdx = board.value?.data.findIndex((el) => el.id === to.id);
    if (toColIdx !== undefined && toColIdx !== -1) {
      board.value?.data[toColIdx].data.push(to.data);
    }

    updateBoardEmit(board.value?.id as string, board.value as BoardModel, 'board');
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  showLoader();
  await getPrivateBoard();
  hideLoader();
});
</script>
<template>
  <div class="board">
    <BoardContext
      :board="board || {}"
      :uid="getUserId"
      @remove="handleBoardRemove(board.id)"
      @sort="sortBy = $event"
      @expand="isCommentsExpand = !isCommentsExpand"
    />
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
            <div class="flex-none flex">
              <FButton
                title="Edit column title"
                @click="isEditColumnName = column.id"
                flat
                icon="ion:pencil"
                class="dark:text-white dark:hover:text-black"
                sm
                :color="column.color || 'cyan'"
              />
              <FMenu
                :options="COLORS"
                sm
                icon="ion:color-palette-outline"
                flat
                :color="column.color || 'cyan'"
                class="dark:text-white dark:hover:text-black"
                @input="handleColumnTheme(column.id, $event)"
              >
                <template #option="{ option }">
                  <div class="flex items-center space-x-2">
                    <div
                      class="p-3 flex-none rounded-sm cursor-pointer"
                      :class="`palette--${option}`"
                      :title="option"
                    ></div>
                    <div class="flex-grow capitalize">
                      {{ option }}
                    </div>
                  </div>
                </template>
              </FMenu>
            </div>
          </div>
          <div v-else class="flex items-center">
            <EditContent
              :content="column.name"
              @save="handleColumnNameChange($event, column.id)"
              @cancel="isEditColumnName = null"
              :color="column.color || 'cyan'"
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
          :color="column.color || 'cyan'"
        />

        <div class="w-full flex py-2" v-if="isNewCard === column.id">
          <input
            type="text"
            class="rounded-md border-none flex-grow py-1 mr-1 focus:shadow-none"
            v-model="newCardName"
            placeholder="New card title"
            @keyup.enter="handleCardAddition(column.id)"
            :class="`bg-${column.color || 'cyan'}-100`"
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
              :color="column.color || 'cyan'"
            />
          </div>
        </div>
        <Draggable
          :list="column.data"
          :enabled="enabled"
          group="board"
          v-bind="$attrs"
          @upvote="upVote({ cid: $event.cid, coid: column.id })"
          @end="updateBoardEmit(board?.id, board, 'board')"
          :user-id="getUserId"
          :sort="sortBy"
          :c-id="column.id"
          :color="column.color || 'cyan'"
          @move="handleSortedMove"
          :is-comments-expand="isCommentsExpand"
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
