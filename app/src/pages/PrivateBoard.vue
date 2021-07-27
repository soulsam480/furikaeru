<script setup lang="ts">
const COLORS = ['red', 'green', 'purple', 'indigo', 'amber', 'lime', 'cyan'];
const BINDINGS: KeyBinding[] = [
  {
    key: 'n',
    modifier: 'Alt',
    handler: () => (isNewCardModal.value = !isNewCardModal.value),
  },
];

import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import AsyncLoader from 'src/components/AsyncLoader.vue';
const Draggable = defineAsyncComponent({
  loader: () => import('src/components/App/Draggable.vue'),
  loadingComponent: AsyncLoader,
  delay: 0,
});
import type { BoardModel, Card, KeyBinding } from 'src/utils/types';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from 'src/store/user';
import { v4 } from 'uuid';
import FButton from 'src/components/lib/FButton.vue';
const EditContent = defineAsyncComponent(() => import('src/components/App/EditContent.vue'));
import { deleteBoard, getBoard, updateBoard } from 'src/utils/boardService';
const BoardContext = defineAsyncComponent(() => import('src/components/BoardContext.vue'));
import FMenu from 'src/components/lib/FMenu.vue';
import { useIo } from 'src/utils/createWs';
import FBanner from 'src/components/lib/FBanner.vue';
import { useAlert, useKeyBindings } from 'src/utils/composables';
import { Head } from '@vueuse/head';
const NewCardModal = defineAsyncComponent(() => import('src/components/NewCardModal.vue'));
import { generateRoute } from 'src/utils/helpers';

const {
  params: { id: routeBid },
} = useRoute();
const { push, replace } = useRouter();
const { getUser, showLoader, hideLoader } = useUser();
const { set } = useAlert();
const { isConnected } = useIo();
useKeyBindings(BINDINGS);

const board = ref<BoardModel>();
const enabled = ref(true);
const isEditColumnName = ref<string | null>(null);
const isEditBoardName = ref<string | null>(null);
const newCardName = ref('');
const sortBy = ref('');
const noDrag = ref(false);
const isCommentsExpand = ref(false);
const isNewCard = ref<string | null>(null);
const newCardParent = ref('');
const isNewCardModal = ref(false);
const isBottomNewCard = ref<string | null>(null);
const getUserId = computed(() => getUser.value.id as string);
const bid = computed(() => {
  const id = routeBid as string;
  if (id.includes('--')) return id.split('--')[1];
  return id;
});
const columnOptions = computed(() => {
  if (!board.value) return [];
  return (board.value as BoardModel).data.map((col) => ({
    label: col.name,
    value: col.id,
  }));
});

async function getPrivateBoard() {
  try {
    const { data } = await getBoard(bid.value);
    board.value = { ...data };
  } catch (error) {
    set({ message: 'Something wrong happened !', type: 'danger' });
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
    set({ message: 'Something wrong happened !', type: 'danger' });
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

  replace(`/board/${generateRoute(board.value as BoardModel)}/`);
  updateBoardEmit(bid.value, board.value as BoardModel, 'title');
}

function handleColumnTheme(id: string, color: string) {
  const idx = board.value?.data.findIndex((el) => el.id === id);
  if (idx !== undefined && idx !== -1) {
    (board.value as BoardModel).data[idx]['color'] = color;
  }
  updateBoardEmit(bid.value, board.value as BoardModel, 'board');
}

function handleCardAddition(id: string, content: string, top = true) {
  if (isNewCardModal.value && !newCardParent.value) return;

  if (!content) return;
  const card: Card = {
    id: v4(),
    title: content,
    votes: {},
    user_id: getUserId.value as string,
    comments: {},
  };

  const idx = board.value?.data.findIndex((el) => el.id === id);
  if (idx !== undefined && idx !== -1) {
    if (!top) {
      board.value?.data[idx].data.push({ ...card });
    } else {
      board.value?.data[idx].data.unshift({ ...card });
    }
  }
  updateBoardEmit(bid.value, board.value as BoardModel, 'board');

  newCardParent.value = '';
  isNewCard.value = null;
  isBottomNewCard.value = null;

  if (isNewCardModal.value) isNewCardModal.value = false;
}

async function handleBoardRemove(id: string) {
  try {
    await deleteBoard(id);
    set({ type: 'success', message: 'Board removed successfully !' });
    push('/');
  } catch (error) {
    set({ type: 'danger', message: error });
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
  <div class="board pb-10">
    <Head>
      <title>{{ board?.title }} | Furikaeru</title>
    </Head>

    <transition name="fade">
      <f-banner
        v-if="!isConnected"
        text="You are not connected. Changes won't be saved."
        class="mb-4 mt-1"
        type="danger"
      />
    </transition>

    <new-card-modal
      :options="columnOptions"
      v-model:new-card-parent="newCardParent"
      v-model:is-modal="isNewCardModal"
      @add="handleCardAddition(newCardParent, $event)"
    />

    <board-context
      :board="board || {}"
      :uid="getUserId"
      @remove="handleBoardRemove(board.id)"
      @sort="sortBy = $event"
      @expand="isCommentsExpand = !isCommentsExpand"
      @toggle-drag="noDrag = !noDrag"
    />

    <div class="mb-4">
      <div class="flex" v-if="isEditBoardName !== board?.id">
        <div class="text-2xl font-semibold flex-grow sm:mr-1 sm:flex-none break-word dark:text-white">
          {{ board?.title }}
        </div>
        <div class="flex-none">
          <f-button
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
        <edit-content
          is="input"
          :content="board.title"
          @save="handleBoardNameChange"
          @cancel="isEditBoardName = null"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 board-grid">
      <div v-for="column in board?.data" :key="column.id">
        <div class="pb-2">
          <div class="flex" v-if="isEditColumnName !== column.id">
            <div class="text-lg flex-grow break-word dark:text-white">{{ column.name }}</div>
            <div class="flex-none flex">
              <f-button
                title="Edit column title"
                @click="isEditColumnName = column.id"
                flat
                icon="ion:pencil"
                class="dark:text-white dark:hover:text-black"
                sm
                :color="column.color || 'cyan'"
              />
              <f-menu
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
              </f-menu>
            </div>
          </div>
          <div v-else class="flex items-center">
            <edit-content
              is="input"
              :content="column.name"
              @save="handleColumnNameChange($event, column.id)"
              @cancel="isEditColumnName = null"
              :color="column.color || 'cyan'"
            />
          </div>
        </div>

        <f-button
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

        <div class="w-full flex py-2 items-start" v-if="isNewCard === column.id">
          <edit-content
            @save="handleCardAddition(column.id, $event)"
            @cancel="isNewCard = null"
            :color="column.color || 'cyan'"
          />
        </div>

        <draggable
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
          :no-drag="noDrag"
        />

        <f-button
          @click="isBottomNewCard = column.id"
          block
          icon="ion:add"
          class="text-xs"
          title="Add a new card"
          center
          label="Add"
          sm
          :color="column.color || 'cyan'"
          v-if="column.data.length > 0"
        />

        <div class="w-full flex py-2 items-start" v-if="isBottomNewCard === column.id && column.data.length > 0">
          <edit-content
            @save="handleCardAddition(column.id, $event, false)"
            @cancel="isBottomNewCard = null"
            :color="column.color || 'cyan'"
          />
        </div>
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
