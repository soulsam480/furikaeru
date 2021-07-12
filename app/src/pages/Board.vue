<script setup lang="ts">
const COLORS = ['red', 'green', 'purple', 'indigo', 'amber', 'lime', 'cyan'];
const BINDINGS: KeyBinding[] = [
  {
    key: 'n',
    modifier: 'Alt',
    handler: () => (isNewCardModal.value = !isNewCardModal.value),
  },
];
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Draggable from 'src/components/App/Draggable.vue';
import type { BoardModel, Card, KeyBinding } from 'src/utils/types';
import { useIo } from 'src/utils/createWs';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from 'src/store/user';
import { v4 } from 'uuid';
import FButton from 'src/components/lib/FButton.vue';
import EditContent from 'src/components/App/EditContent.vue';
import BoardContext from 'src/components/BoardContext.vue';
import { deleteBoard } from 'src/utils/boardService';
import { useAlerts } from 'src/store/alert';
import FMenu from 'src/components/lib/FMenu.vue';
import FBanner from 'src/components/lib/FBanner.vue';
import { useKeyBindings } from 'src/utils/helpers';
import NewCardModal from 'src/components/NewCardModal.vue';

const { on, emit, io, isConnected } = useIo();
const {
  params: { id: bid },
} = useRoute();
const { push } = useRouter();
const { isLoggedIn, getUser, showLoader, hideLoader, getLoader } = useUser();
const { setAlerts } = useAlerts();
useKeyBindings(BINDINGS, true);

const board = ref<BoardModel>();
const isEditColumnName = ref<string | null>(null);
const isEditColumnColor = ref<string | null>(null);
const isEditBoardName = ref<string | null>(null);
const newCardName = ref('');
const sortBy = ref('');
const isCommentsExpand = ref(false);
const isFocusMode = ref(false);
const isNewCard = ref<string | null>(null);
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
  updateBoardEmit(parsedBoardId.value, board.value as BoardModel);
}

function handleCardAddition(id: string) {
  if (isNewCardModal && !newCardParent.value) return;
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
  updateBoardEmit(parsedBoardId.value, board.value as BoardModel);

  newCardName.value = '';
  newCardParent.value = '';
  isNewCard.value = null;

  if (isNewCardModal.value) isNewCardModal.value = false;
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
  <div class="board">
    <NewCardModal
      :options="columnOptions"
      v-model:new-card-name="newCardName"
      v-model:new-card-parent="newCardParent"
      v-model:is-modal="isNewCardModal"
      @add="handleCardAddition(newCardParent)"
    />

    <transition name="fade">
      <FBanner
        v-if="!isConnected"
        text="You are not connected. Changes won't be saved."
        class="mb-4 mt-1"
        type="danger"
      />
    </transition>

    <BoardContext
      :board="board || {}"
      :uid="getUserId"
      @remove="handleBoardRemove(board.id)"
      @sort="sortBy = $event"
      @expand="isCommentsExpand = !isCommentsExpand"
      @focus-mode="isFocusMode = !isFocusMode"
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
          <div class="flex items-center space-x-1" v-if="isEditColumnName !== column.id">
            <div class="text-lg flex-grow break-word dark:text-white">{{ column.name }}</div>
            <div class="flex-none flex">
              <FButton
                title="Edit column title"
                @click="handleEditColumnName(column.id)"
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
            :class="`bg-${column.color || 'cyan'}-100`"
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
              :color="column.color || 'cyan'"
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
