<script setup lang="ts">
import type { BoardModel } from 'src/utils/types';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getDDMMYY, copyLink, shareBoard } from 'src/utils/helpers';
import FButton from 'src/components/lib/FButton.vue';
import { useUser } from 'src/store/user';
import { deleteBoard, getAllBoards, updateBoard } from 'src/utils/boardService';
import FMenu from 'src/components/lib/FMenu.vue';
import { useAlerts } from 'src/store/alert';

const { push } = useRouter();
const { showLoader, hideLoader } = useUser();
const { setAlerts } = useAlerts();
const boards = ref<BoardModel[]>([]);

const isShare = navigator.share;

const boardContext = (type: boolean) => [
  {
    label: type ? 'Make private' : 'Make public',
    value: 'changetype',
  },
  {
    label: 'Delete',
    value: 'delete',
  },
];

async function handleBoardContext(type: string, id?: string, is_public?: boolean) {
  switch (type) {
    case 'delete':
      await handleBoardRemove(id as string);
      break;

    case 'changetype':
      await handleChangeType(id as string, !is_public);
      break;
  }
}

function viewBoard(id: string, is_public: boolean) {
  if (is_public) return push(`/${id}/`);
  return push(`/board/${id}/`);
}

async function getBoards() {
  showLoader();
  try {
    const { data }: { data: BoardModel[] } = await getAllBoards();
    boards.value = [...data];
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
}

async function handleBoardRemove(id: string) {
  try {
    await deleteBoard(id);
    setAlerts({ type: 'success', message: 'Board removed.' });
    await getBoards();
  } catch (error) {
    console.log(error);
  }
}

async function handleChangeType(id: string, is_public: boolean) {
  try {
    await updateBoard(id, { is_public });
    setAlerts({ type: 'success', message: 'Board type changed.' });
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
        <div class="flex">
          <div class="text-lg truncate flex-grow" :title="board.title">{{ board.title }}</div>
          <div class="flex-none">
            <FMenu
              :options="boardContext(board.is_public)"
              option-key="value"
              sm
              icon="ion:ellipsis-vertical-outline"
              @input="handleBoardContext($event, board.id, board.is_public)"
              title="Board settings"
            />
          </div>
        </div>
        <div class="font-semibold text-xs pt-1">{{ board.is_public ? 'Public' : 'Private' }}</div>
        <div class="text-gray-500 text-xs pt-1">Updated: {{ getDDMMYY(board.updated_at) }}</div>

        <div class="flex items-center pt-2 space-x-2">
          <FButton
            title="View board"
            @click="viewBoard(board.id, board.is_public)"
            icon="ion:eye-outline"
            size="17px"
            sm
          />
          <FButton
            title="Share board"
            v-if="board.is_public && isShare"
            @click="shareBoard(`https://furikaeru.sambitsahoo.com/${board.id}`, board.title)"
            icon="ion:share-social-outline"
            size="17px"
            sm
          />
          <FButton
            title="Copy public URL"
            v-if="board.is_public"
            @click="
              copyLink(`https://furikaeru.sambitsahoo.com/${board.id}`),
                setAlerts({ type: 'success', message: 'Copied!' })
            "
            icon="ion:clipboard-outline"
            size="17px"
            sm
          />
        </div>
      </div>
    </div>
  </div>
</template>
