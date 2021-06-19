<script setup lang="ts">
import { furiApi } from 'src/utils/helpers';
import type { BoardModel } from 'src/utils/types';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const { push } = useRouter();
const boards = ref<BoardModel[]>([]);

function viewBoard(id: string) {
  push(`/board/${id}`);
}

async function getBoards() {
  try {
    const { data }: { data: BoardModel[] } = await furiApi.get('/board');
    boards.value = [...data];
    console.log(boards.value);
  } catch (error) {
    console.log(error);
  }
}
onMounted(async () => {
  await getBoards();
});
</script>
<template>
  <div>
    <div class="grid grid-cols-4 gap-2 py-3">
      <div
        v-for="board in boards"
        :key="board.id"
        class="
          bg-cyan-100
          transition-colors
          ease-in-out
          filter
          py-3
          hover:bg-cyan-200
          px-2
          rounded-sm
          shadow-md shadow-gray-500
          duration-500
          cursor-pointer
        "
        @click="viewBoard(board.id)"
      >
        <!-- <div class="text-lg"> {{board.title}} </div> -->
        <span class="font-semibold text-xs" v-if="board.is_public">Public</span>
      </div>
    </div>
  </div>
</template>
