<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Draggable from 'src/components/App/Draggable.vue';
import type { BoardModel, Card } from 'src/utils/types';
import { useIo } from 'src/utils/createWs';
import { useRoute } from 'vue-router';
import { useUser } from 'src/store/user';
import { v4 } from 'uuid';
import Icon from 'src/components/App/Icon.vue';

const { on, emit, io } = useIo();
const {
  params: { id: bid },
} = useRoute();
const { isLoggedIn, getUser } = useUser();

const board = ref<BoardModel>();
const enabled = ref(true);
const isEditColumnName = ref<string | null>(null);
const isEditBoardName = ref<string | null>(null);
const newCardName = ref('');
const isNewCard = ref<string | null>(null);
const getUserId = computed(() => {
  if (isLoggedIn.value) return getUser.value.id;
  const uid = localStorage.getItem('__uuid');
  return uid ?? v4();
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
  return { ...card, updated_date: new Date().valueOf(), votes };
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

  updateBoardEmit(bid as string, board.value as BoardModel);
}

function updateBoardEmit(id: string, board: BoardModel) {
  emit('update:board', { id, b: board });
}

function handleColumnNameChange() {
  isEditColumnName.value = null;
  updateBoardEmit(bid as string, board.value as BoardModel);
}

function handleBoardNameChange() {
  isEditBoardName.value = null;
  updateBoardEmit(bid as string, board.value as BoardModel);
}

function handleCardAddition(id: string) {
  const card: Card = {
    id: v4(),
    title: newCardName.value,
    votes: {},
    user_id: getUserId.value as string,
    created_date: new Date().valueOf(),
    updated_date: new Date().valueOf(),
  };

  const idx = board.value?.data.findIndex((el) => el.id === id);
  if (idx !== -1) {
    board.value?.data[idx as number].data.push({ ...card });
  }
  updateBoardEmit(bid as string, board.value as BoardModel);

  newCardName.value = '';
  isNewCard.value = null;
}

onMounted(() => {
  emit('get:board', { id: bid });
});

on('send:board', ({ d }: { d: BoardModel }) => {
  board.value = { ...d };
});

onBeforeUnmount(() => {
  io.off('send:board');
  emit('leave:board');
});
</script>
<template>
  <div class="board">
    <div class="mb-4">
      <div class="flex" v-if="isEditBoardName !== board?.id">
        <div class="text-2xl font-semibold flex-grow sm:mr-1 sm:flex-none break-all">{{ board?.title }}</div>
        <div class="flex-none">
          <button
            class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
            title="Edit board title"
            @click="isEditBoardName = board.id"
          >
            <Icon icon="ion:pencil" class="cursor-pointer" size="15px" />
          </button>
        </div>
      </div>
      <div v-else class="flex items-center">
        <input
          type="text"
          class="rounded-md border-none bg-cyan-50 flex-grow py-1 focus:shadow-none mr-1"
          v-model="board.title"
          @keyup.enter="handleBoardNameChange"
        />
        <button
          class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
          @click="handleBoardNameChange"
          title="Save"
        >
          <Icon icon="ion:checkmark" class="cursor-pointer" size="15px" />
        </button>

        <button
          class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
          @click="isEditBoardName = null"
          title="Cancel"
        >
          <Icon icon="ion:close" class="cursor-pointer" size="15px" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 board-grid">
      <div v-for="column in board?.data" :key="column.id">
        <div class="pb-2">
          <div class="flex" v-if="isEditColumnName !== column.id">
            <div class="text-lg flex-grow break-all">{{ column.name }}</div>
            <div class="flex-none">
              <button
                class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
                title="Edit column title"
                @click="isEditColumnName = column.id"
              >
                <Icon icon="ion:pencil" class="cursor-pointer" size="15px" />
              </button>
            </div>
          </div>
          <div v-else class="flex items-center">
            <input
              type="text"
              class="rounded-md border-none bg-cyan-50 flex-grow py-1 focus:shadow-none mr-1"
              v-model="column.name"
              @keyup.enter="handleColumnNameChange"
            />
            <button
              class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
              @click="handleColumnNameChange"
              title="Save"
            >
              <Icon icon="ion:checkmark" class="cursor-pointer" size="15px" />
            </button>

            <button
              class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
              @click="isEditColumnName = null"
              title="Cancel"
            >
              <Icon icon="ion:close" class="cursor-pointer" size="15px" />
            </button>
          </div>
        </div>

        <button
          class="bg-cyan-100 rounded-md text-xs w-full flex hover:bg-cyan-200 py-1 items-center justify-center"
          @click="isNewCard = column.id"
        >
          <Icon icon="ion:add" size="15px" />
          Add
        </button>
        <div class="w-full flex py-1" v-if="isNewCard === column.id">
          <input
            type="text"
            class="rounded-md border-none bg-cyan-100 flex-grow py-1 mr-1 focus:shadow-none"
            v-model="newCardName"
            placeholder="New card title"
            @keyup.enter="handleCardAddition(column.id)"
          />
          <div class="flex-none">
            <button
              class="px-2 py-1 bg-cyan-100 mr-1 hover:bg-cyan-200 focus:outline-none rounded-md"
              @click="handleCardAddition(column.id)"
              title="Save"
            >
              <Icon icon="ion:checkmark" class="cursor-pointer" size="15px" />
            </button>

            <button
              class="px-2 py-1 bg-cyan-100 hover:bg-cyan-200 focus:outline-none rounded-md"
              @click="isNewCard = null"
              title="Cancel"
            >
              <Icon icon="ion:close" class="cursor-pointer" size="15px" />
            </button>
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
          display: block;
          transition-property: display;
          transition-timing-function: ease-in-out;
          transition-delay: 400ms;
        }
      }
      &__edit {
        display: none;
      }
      // &__comments {
      //   height: 0;
      //   &--active {
      //     height: auto;
      //   }
      // }
    }
  }
}
</style>
