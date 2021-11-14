<script setup lang="ts">
import { useUser } from 'src/store/user';
import { v4 as uuid } from 'uuid';
import type { BoardColumn } from 'src/utils/types';
import { createBoard as furiCreateBoard } from 'src/utils/boardService';
import UserCards from 'src/components/UserCards.vue';
import { useRouter } from 'vue-router';
import { FBanner, FMenu, FButton } from 'furikaeru';
import { useAlert, useLoadingBar } from 'src/utils/composables';
import { generateRoute } from 'src/utils/helpers';
import { Head } from '@vueuse/head';
import { ref } from 'vue';

const { getUser } = useUser();
const { set } = useAlert();
const { push } = useRouter();
const { start, stop } = useLoadingBar();

const isArchivePage = ref(false);

const boardTypes = [
  {
    label: 'Private board',
    value: 'private',
  },
  {
    label: 'Public board',
    value: 'public',
  },
];

async function createBoard(type: string | number) {
  const data: { title: string; data: BoardColumn[]; is_public: boolean } = {
    title: 'Example board',
    data: [
      {
        id: uuid().split('-')[0],
        name: 'This is a column',
        color: 'lime',
        owner_id: getUser.value.id as string,
        data: [
          {
            id: uuid().split('-')[0],
            title: 'a card',
            votes: {},
            user_id: getUser.value.id as string,
            comments: {},
          },
        ],
      },
      {
        id: uuid().split('-')[0],
        name: 'This is another column',
        color: 'green',
        owner_id: getUser.value.id as string,
        data: [
          {
            id: uuid().split('-')[0],
            title: 'another card',
            votes: {},
            user_id: getUser.value.id as string,
            comments: {},
          },
        ],
      },
      {
        id: uuid().split('-')[0],
        name: 'This is another column',
        color: 'amber',
        owner_id: getUser.value.id as string,
        data: [
          {
            id: uuid().split('-')[0],
            title: 'another one',
            votes: {},
            user_id: getUser.value.id as string,
            comments: {},
          },
        ],
      },
    ],
    is_public: type === 'public' ? true : false,
  };

  try {
    start();
    const { data: result } = await furiCreateBoard({ ...data });
    set({ type: 'success', message: 'Board created successfully!' });
    stop();

    push(type === 'public' ? `/${generateRoute(result)}/` : `/board/${generateRoute(result)}/`);
  } catch (error) {
    console.log(error);
  }
}
</script>
<template>
  <div>
    <Head>
      <title>Home | Furikaeru</title>
    </Head>
    <f-banner text="Furikaeru is in active development. Bugs and frequent changes are expected." class="my-2" />
    <div class="flex justify-between pt-3">
      <div class="text-3xl font-semibold dark:text-white">My boards</div>
      <div class="flex space-x-2 items-center">
        <f-button
          sm
          label="Trash"
          icon="ion:archive-outline"
          :color="isArchivePage ? 'red' : 'cyan'"
          @click="isArchivePage = !isArchivePage"
        ></f-button>

        <f-menu
          :options="boardTypes"
          @input="createBoard"
          label="Add new"
          sm
          option-key="value"
          icon="ion:add-outline"
        />
      </div>
    </div>
    <user-cards :is-archive="isArchivePage" />
  </div>
</template>
