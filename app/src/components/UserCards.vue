<script setup lang="ts">
import type { BoardModel } from 'src/utils/types';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getDDMMYY, copyLink, shareBoard, generateRoute } from 'src/utils/helpers';
import FButton from 'src/components/lib/FButton.vue';
import { deleteBoard, getAllBoards, getArchivedBoards, updateBoard } from 'src/utils/boardService';
import FMenu from 'src/components/lib/FMenu.vue';
import { useAlert, useLoadingBar } from 'src/utils/composables';
import ConfirmModal from 'src/components/App/ConfirmModal.vue';

const props = defineProps<{
  isArchive: boolean;
}>();

const { push, currentRoute } = useRouter();
const { set } = useAlert();
const { start, stop } = useLoadingBar();

const boards = ref<BoardModel[]>([]);

const isShare = navigator.share;

const boardContext = (type: boolean, archive: boolean) => [
  !archive
    ? {
        label: type ? 'Make private' : 'Make public',
        value: 'changetype',
      }
    : {
        label: 'Restore',
        value: 'restore',
      },
  {
    label: 'Delete',
    value: 'delete',
  },
];

const isConfirmModal = ref(false);
const deleteBoardId = ref('');

async function handleBoardContext(type: string, id?: string, is_public?: boolean) {
  switch (type) {
    case 'delete':
      await handleConfirmModal(id as string);
      break;

    case 'changetype':
      await handleChangeType(id as string, !is_public);
      break;

    case 'restore':
      await handleBoardRestore('yes', id as string);
      break;
  }
}

function viewBoard(board: BoardModel) {
  const { is_public } = board;
  if (is_public) return push(`/${generateRoute(board)}/`);
  return push(`/board/${generateRoute(board)}/`);
}

async function getBoards() {
  start();
  try {
    const { data }: { data: BoardModel[] } = await getAllBoards();
    boards.value = [...data];
  } catch (error) {
    console.log(error);
  } finally {
    stop();
  }
}

async function getAllArchivedBoards() {
  start();
  try {
    const { data }: { data: BoardModel[] } = await getArchivedBoards();
    boards.value = [...data];
  } catch (error) {
    console.log(error);
  } finally {
    stop();
  }
}

async function handleBoardRemove(type: string, id: string) {
  if (type === 'yes') {
    start();
    try {
      if (props.isArchive) {
        await deleteBoard(id as string);
        await getAllArchivedBoards();
      } else {
        await updateBoard(id, { is_deleted: true, is_public: false });
        await getBoards();
      }
      set({ type: 'success', message: `Board ${!props.isArchive ? 'archived' : 'deleted'}.` });
    } catch (error) {
      console.log(error);
    } finally {
      stop();
    }
  }
  deleteBoardId.value = '';
}

async function handleBoardRestore(type: string, id: string) {
  if (type === 'yes') {
    start();
    try {
      await updateBoard(id, { is_deleted: false });
      set({ type: 'success', message: 'Board restored.' });
      await getAllArchivedBoards();
    } catch (error) {
      console.log(error);
    } finally {
      stop();
    }
  }
  deleteBoardId.value = '';
}

function handleConfirmModal(id: string) {
  deleteBoardId.value = id;
  isConfirmModal.value = true;
}

async function handleChangeType(id: string, is_public: boolean) {
  try {
    await updateBoard(id, { is_public });
    set({ type: 'success', message: 'Board type changed.' });
    await getBoards();
  } catch (error) {
    console.log(error);
  }
}

watch(
  () => props.isArchive,
  async (val) => {
    if (val) {
      await getAllArchivedBoards();
      return;
    } else {
      await getBoards();
    }
  },
);

onMounted(async () => {
  if (!props.isArchive) {
    await getBoards();
  } else {
    await getAllArchivedBoards();
  }
});
</script>
<template>
  <div>
    <confirm-modal
      v-model:is-modal="isConfirmModal"
      @yes="handleBoardRemove('yes', deleteBoardId)"
      @no="handleBoardRemove('no', deleteBoardId)"
    />

    <div class="grid sm:grid-cols-4 grid-cols-1 gap-2 py-3">
      <div
        v-for="board in boards"
        :key="board.id"
        class="bg-cyan-200 transition-colors ease-in-out filter py-3 px-2 rounded-md shadow-md"
      >
        <div class="flex">
          <div class="text-lg truncate flex-grow" :title="board.title">{{ board.title }}</div>
          <div class="flex-none">
            <f-menu
              :options="boardContext(board.is_public, board.is_deleted)"
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
          <f-button title="View board" @click="viewBoard(board)" icon="ion:eye-outline" size="17px" sm />
          <f-button
            title="Share board"
            v-if="board.is_public && !!isShare"
            @click="shareBoard(`https://furikaeru.sambitsahoo.com/${generateRoute(board)}`, board.title)"
            icon="ion:share-social-outline"
            size="17px"
            sm
          />
          <f-button
            title="Copy public URL"
            v-if="board.is_public"
            @click="
              copyLink(`https://furikaeru.sambitsahoo.com/${generateRoute(board)}`),
                set({ type: 'success', message: 'Copied!' })
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
