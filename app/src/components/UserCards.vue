<script setup lang="ts">
import { furiApi } from 'src/utils/helpers';
import type { BoardModel } from 'src/utils/types';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getDDMMYY } from 'src/utils/helpers';
import FButton from 'src/components/lib/FButton.vue';
import { useUser } from 'src/store/user';

const { push } = useRouter();
const { showLoader, hideLoader } = useUser();
const boards = ref<BoardModel[]>([]);

function viewBoard(id: string, is_public: boolean) {
  if (is_public) return push(`/${id}/`);
  return push(`/board/${id}/`);
}

async function getBoards() {
  showLoader();
  try {
    const { data }: { data: BoardModel[] } = await furiApi.get('/board');
    boards.value = [...data];
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
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
          bg-cyan-200
          transition-colors
          ease-in-out
          filter
          py-3
          px-2
          rounded-md
          duration-500
          hover:(shadow-md
          shadow-gray-500
          )
        "
      >
        <div class="text-lg break-word">{{ board.title }}</div>
        <div class="font-semibold text-xs pt-1" v-if="board.is_public">Public</div>
        <div class="text-gray-500 text-xs pt-1">Updated: {{ getDDMMYY(board.updated_at) }}</div>

        <div class="flex items-center pt-2">
          <FButton
            title="Remove board"
            @click="handleBoardRemove(board.id)"
            icon="ion:trash-outline"
            size="17px"
            class="mr-1"
            sm
          />
          <FButton
            title="View board"
            @click="viewBoard(board.id, board.is_public)"
            icon="ion:eye-outline"
            size="17px"
            sm
          />
        </div>
      </div>
    </div>
  </div>
</template>
