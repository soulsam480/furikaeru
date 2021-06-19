<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Draggable from 'src/components/App/Draggable.vue';
import type { BoardModel } from 'src/utils/types';
import { useIo } from 'src/utils/createWs';
import { useRoute } from 'vue-router';
import { useUser } from 'src/store/user';
import { v4 } from 'uuid';

const { on, emit, io } = useIo();
const {
  params: { id: bid },
} = useRoute();
const { isLoggedIn, getUser } = useUser();

const board = ref<BoardModel>();
const enabled = ref(true);
const getUserId = computed(() => {
  if (isLoggedIn.value) return getUser.value.id;
  const uid = localStorage.getItem('__uuid');
  return uid ?? v4();
});

function vote(card: any, uid: string): any {
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

  emit('update:board', { id: bid, b: board.value });
}

onMounted(() => {
  emit('get:board', { id: bid });
});

on('send:board', ({ d }: { d: BoardModel }) => {
  board.value = { ...d };
  console.log(board.value);
});

onBeforeUnmount(() => {
  io.off('send:board');
  emit('leave:board');
});
</script>
<template>
  <div class="board">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 board-grid">
      <div v-for="column in board?.data" :key="column.id">
        <div class="text-lg">{{ column.name }}</div>
        <Draggable
          :list="column.data"
          :enabled="enabled"
          group="board"
          v-bind="$attrs"
          @upvote="upVote({ cid: $event.cid, coid: column.id })"
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.buttons {
  margin-top: 35px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.not-draggable {
  cursor: no-drop;
}
.board-grid {
  &__column {
    &__item {
      &:first-child {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
      }
    }
  }
}
</style>
