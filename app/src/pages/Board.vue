<script setup lang="ts">
const COLORS = ['red', 'green', 'purple', 'indigo', 'amber', 'lime', 'cyan'];
const BINDINGS: KeyBinding[] = [
  {
    key: 'n',
    modifier: 'Alt',
    handler: () => (isNewCardModal.value = !isNewCardModal.value),
  },
];

import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import AsyncLoader from 'src/components/AsyncLoader.vue';
const Draggable = defineAsyncComponent({
  loader: () => import('src/components/App/Draggable.vue'),
  loadingComponent: AsyncLoader,
  delay: 0,
});
import type { BoardModel, Card, KeyBinding } from 'src/utils/types';
import { useIo } from 'src/utils/createWs';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from 'src/store/user';
import { v4 } from 'uuid';
import FButton from 'src/components/lib/FButton.vue';
import EditContent from 'src/components/App/EditContent.vue';
import BoardContext from 'src/components/BoardContext.vue';
import { deleteBoard, updateBoard } from 'src/utils/boardService';
import FMenu from 'src/components/lib/FMenu.vue';
import FBanner from 'src/components/lib/FBanner.vue';
import NewCardModal from 'src/components/NewCardModal.vue';
import { useAlert, useKeyBindings } from 'src/utils/composables';
import { generateRoute } from 'src/utils/helpers';
import { Head } from '@vueuse/head';

const { on, emit, io, isConnected } = useIo();
const {
  params: { id: bid },
} = useRoute();
const { push, replace } = useRouter();
const { isLoggedIn, getUser, showLoader, hideLoader, getLoader } = useUser();
const { set } = useAlert();
useKeyBindings(BINDINGS, true);

const board = ref<BoardModel>();
const isEditColumnName = ref<string | null>(null);
const isEditColumnColor = ref<string | null>(null);
const isEditBoardName = ref<string | null>(null);
const sortBy = ref('');
const isCommentsExpand = ref(false);
const isFocusMode = ref(false);
const noDrag = ref(false);
const isNewCard = ref<string | null>(null);
const isBottomNewCard = ref<string | null>(null);
const isNewCardModal = ref(false);
const newCardParent = ref('');
const getUserId = computed(() => {
  if (isLoggedIn.value) return getUser.value.id as string;
  const uid = localStorage.getItem('__uuid');
  return uid ?? v4();
});
const parsedBoardId = computed(() => {
  const id = bid as string;
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

//TODO: THis will be changed
// function blockUserVotes() {
//   let maxVotes: string | number | null = localStorage.getItem('__mv');
//   if (!maxVotes) {
//     localStorage.setItem('__mv', '0');
//     return true;
//   }
//   if (parseInt(maxVotes) === 5) return false;

//   maxVotes = parseInt(maxVotes);
//   maxVotes++;
//   localStorage.setItem('__mv', `${maxVotes}`);
//   return true;
// }

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
  //TODO: refine this
  // if (!blockUserVotes()) return;

  const { cid, coid } = e;

  const column = board.value?.data.filter((el) => el.id === coid)[0];

  if (!column) {
    return console.log('not found');
  }
  let card = column?.data.filter((el) => el.id === cid)[0];

  if (!card) {
    return console.log('not found');
  }

  if (card.votes[getUserId.value as string] === board.value?.max_vote) return;
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

  updateBoardEmit(parsedBoardId.value, board.value as BoardModel);
}

function updateBoardEmit(id: string, board: BoardModel) {
  emit('update:board', { id, b: { ...board, user: null } });
}

function handleColumnNameChange(e: string, id: string) {
  const column = board.value?.data.filter((el) => el.id === id)[0];
  if (!column) return;
  column.name = e;

  isEditColumnName.value = null;
  updateBoardEmit(parsedBoardId.value, board.value as BoardModel);
}

function handleBoardNameChange(e: string) {
  isEditBoardName.value = null;
  (board.value as BoardModel).title = e;
  replace(`/${generateRoute(board.value as BoardModel)}/`);
  updateBoardEmit(parsedBoardId.value, board.value as BoardModel);
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
  updateBoardEmit(parsedBoardId.value, board.value as BoardModel);

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

async function handleBoardMaxVote(id: string, max_vote: number) {
  try {
    await updateBoard(id, { max_vote });
    emit('get:board', { id: parsedBoardId.value });

    set({ type: 'success', message: 'Updated !' });
  } catch (error) {
    set({ type: 'danger', message: 'Unable to update board !' });
  }
}

function handleColumnTheme(id: string, color: string) {
  const idx = board.value?.data.findIndex((el) => el.id === id);
  if (idx !== undefined && idx !== -1) {
    (board.value as BoardModel).data[idx]['color'] = color;
  }
  updateBoardEmit(parsedBoardId.value, board.value as BoardModel);
}

function handleEditColumnName(id: string) {
  if (isEditColumnColor.value === id) {
    isEditColumnColor.value = null;
  }
  if (isEditColumnName.value === id) {
    isEditColumnName.value = null;
    return;
  }
  isEditColumnName.value = id;
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

    updateBoardEmit(board.value?.id as string, board.value as BoardModel);
  } catch (error) {
    console.log(error);
  }
}

function handleBoardError() {
  if (getLoader.value) {
    hideLoader();
  }
  push('/');
}

onMounted(() => {
  showLoader();
  const firstListen = ({ d }: { d: BoardModel }) => {
    board.value = { ...d };
    io.off('send:board', firstListen);
    hideLoader();
  };
  emit('get:board', { id: parsedBoardId.value }).on('send:board', firstListen);
});

on('send:board', ({ d }: { d: BoardModel }) => {
  board.value = { ...d };
});

on('error', handleBoardError);

onBeforeUnmount(() => {
  io.off('send:board');
  emit('leave:board');
  io.off('error', handleBoardError);
});
</script>
<template>
  <div class="board pb-10">
    <head>
      <title>{{ board?.title }} | Furikaeru</title>
    </head>

    <new-card-modal
      :options="columnOptions"
      v-model:new-card-parent="newCardParent"
      v-model:is-modal="isNewCardModal"
      @add="handleCardAddition(newCardParent, $event)"
    />

    <transition name="fade">
      <f-banner
        v-if="!isConnected"
        text="You are not connected. Changes won't be saved."
        class="mb-4 mt-1"
        type="danger"
      />
    </transition>

    <board-context
      :board="board || {}"
      :uid="getUserId"
      @remove="handleBoardRemove(board?.id)"
      @sort="sortBy = $event"
      @expand="isCommentsExpand = !isCommentsExpand"
      @focus-mode="isFocusMode = !isFocusMode"
      @toggle-drag="noDrag = !noDrag"
      @max-vote="handleBoardMaxVote(board?.id, $event)"
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
          <div class="flex items-center space-x-1" v-if="isEditColumnName !== column.id">
            <div class="text-lg flex-grow break-word dark:text-white">{{ column.name }}</div>
            <div class="flex-none flex">
              <f-button
                title="Edit column title"
                @click="handleEditColumnName(column.id)"
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
          group="board"
          v-bind="$attrs"
          @upvote="upVote({ cid: $event.cid, coid: column.id })"
          @end="updateBoardEmit(board?.id, board)"
          :user-id="getUserId"
          :sort="sortBy"
          :cId="column.id"
          @move="handleSortedMove"
          :color="column.color || 'cyan'"
          :is-comments-expand="isCommentsExpand"
          :is-focus-mode="isFocusMode"
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
  &__column__item {
    :hover > & {
      &__edit {
        visibility: visible;
        transition-property: display;
        transition-timing-function: ease-in-out;
        transition-delay: 400ms;
      }
    }

    &__edit {
      @media (max-width: 600px) {
        visibility: visible;
      }

      visibility: hidden;
    }
  }
}
</style>
