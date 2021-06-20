<script setup lang="ts">
import { furiApi } from 'src/utils/helpers';
import type { BoardModel } from 'src/utils/types';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Icon from 'src/components/App/Icon.vue';
import { getDDMMYY } from 'src/utils/helpers';

const { push } = useRouter();
const boards = ref<BoardModel[]>([]);

function viewBoard(id: string, is_public: boolean) {
  if (is_public) return push(`/${id}/`);
  return push(`/board/${id}/`);
}

async function getBoards() {
  try {
    const { data }: { data: BoardModel[] } = await furiApi.get('/board');
    boards.value = [...data];
  } catch (error) {
    console.log(error);
  }
}

async function handleBoardRemove(id: string) {
  try {
    await furiApi.delete(`/board/${id}/`);
    await getBoards();
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
    <div class="grid sm:grid-cols-4 grid-cols-1 gap-2 py-3">
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
          rounded-md
          shadow-md shadow-gray-500
          duration-500
        "
      >
        <div class="text-lg break-all">{{ board.title }}</div>
        <div class="font-semibold text-xs pt-1" v-if="board.is_public">Public</div>
        <div class="text-gray-500 text-xs pt-1">Updated: {{ getDDMMYY(board.updated_at) }}</div>

        <div class="flex items-center pt-1">
          <button
            class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md flex items-center"
            title="Remove board"
            @click="handleBoardRemove(board.id)"
          >
            <!-- <Icon icon="ion:ellipsis-vertical" size="14px" /> -->
            <Icon icon="ion:trash-outline" size="17px" />
          </button>
          <button
            class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md flex items-center"
            title="View board"
            @click="viewBoard(board.id, board.is_public)"
          >
            <!-- <Icon icon="ion:ellipsis-vertical" size="14px" /> -->
            <Icon icon="ion:eye-outline" size="17px" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
