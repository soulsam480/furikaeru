<script setup lang="ts">
import { useUser } from 'src/store/user';
import { v4 as uuid } from 'uuid';
import type { BoardColumn } from 'src/utils/types';
import { createBoard as furiCreateBoard } from 'src/utils/boardService';
import UserCards from 'src/components/UserCards.vue';
import { useRouter } from 'vue-router';
import FBanner from 'src/components/lib/FBanner.vue';
import FMenu from 'src/components/lib/FMenu.vue';
import { useAlerts } from 'src/store/alert';

const { getUser } = useUser();
const { setAlerts } = useAlerts();
const { push } = useRouter();

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

async function createBoard(type: string) {
  const data: { title: string; data: BoardColumn[]; is_public: boolean } = {
    title: 'Example board',
    data: [
      {
        id: uuid(),
        name: 'This is a column',
        color: 'cyan',
        owner_id: getUser.value.id as string,
        data: [
          {
            id: uuid(),
            title: 'a card',
            votes: {},
            user_id: getUser.value.id as string,
            comments: {},
          },
        ],
      },
      {
        id: uuid(),
        name: 'This is another column',
        color: 'cyan',
        owner_id: getUser.value.id as string,
        data: [
          {
            id: uuid(),
            title: 'another card',
            votes: {},
            user_id: getUser.value.id as string,
            comments: {},
          },
        ],
      },
      {
        id: uuid(),
        name: 'This is another column',
        color: 'cyan',
        owner_id: getUser.value.id as string,
        data: [
          {
            id: uuid(),
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
    const { data: result } = await furiCreateBoard({ ...data });
    setAlerts({ type: 'success', message: 'Board created successfully!' });
    push(type === 'public' ? `/${result.id}/` : `/board/${result.id}/`);
  } catch (error) {
    console.log(JSON.parse(JSON.stringify(error)));
  }
}
</script>
<template>
  <div>
    <FBanner text="Furikaeru is in active development. Bugs and frequent changes are expected." class="my-2" />
    <div class="flex justify-between pt-3">
      <div class="text-3xl font-semibold dark:text-white">My boards</div>
      <FMenu :options="boardTypes" @input="createBoard" label="Add new" sm option-key="value" icon="ion:add-outline" />
    </div>
    <UserCards />
  </div>
</template>
