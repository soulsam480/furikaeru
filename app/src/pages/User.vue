<script setup lang="ts">
import { useUser } from 'src/store/user';
import { v4 as uuid } from 'uuid';
import type { BoardColumn } from 'src/utils/types';
import { furiApi } from 'src/utils/helpers';
import UserCards from 'src/components/UserCards.vue';
import Icon from 'src/components/App/Icon.vue';
import { useRouter } from 'vue-router';

const { getUser } = useUser();
const { push } = useRouter();

async function createBoard() {
  const votes: { [x: string]: number } = {};
  votes[getUser.value.id as string] = 1;
  const data: { title: string; data: BoardColumn[]; is_public: boolean } = {
    title: 'Example board',
    data: [
      {
        id: uuid(),
        name: 'This is a column',
        created_at: new Date().valueOf(),
        updated_at: new Date().valueOf(),
        owner_id: getUser.value.id as string,
        data: [
          {
            id: uuid(),
            title: 'a card',
            votes: { ...votes },
            user_id: getUser.value.id as string,
            created_date: new Date().valueOf(),
            updated_date: new Date().valueOf(),
          },
        ],
      },
      {
        id: uuid(),
        name: 'This is another column',
        created_at: new Date().valueOf(),
        updated_at: new Date().valueOf(),
        owner_id: getUser.value.id as string,
        data: [
          {
            id: uuid(),
            title: 'another card',
            votes: { ...votes },
            user_id: getUser.value.id as string,
            created_date: new Date().valueOf(),
            updated_date: new Date().valueOf(),
          },
        ],
      },
      {
        id: uuid(),
        name: 'This is another column',
        created_at: new Date().valueOf(),
        updated_at: new Date().valueOf(),
        owner_id: getUser.value.id as string,
        data: [
          {
            id: uuid(),
            title: 'another one',
            votes: { ...votes },
            user_id: getUser.value.id as string,
            created_date: new Date().valueOf(),
            updated_date: new Date().valueOf(),
          },
        ],
      },
    ],
    is_public: true,
  };

  try {
    const { data: result } = await furiApi.post('/board', {
      ...data,
    });
    console.log(result);
    push(`/board/${result.id}/`);
  } catch (error) {
    console.log(JSON.parse(JSON.stringify(error)));
  }
}
</script>
<template>
  <div class="flex justify-between">
    <div class="text-3xl font-semibold">My boards</div>
    <button class="px-3 py-2 bg-cyan-200 flex items-center rounded-sm" type="button" @click="createBoard">
      <Icon icon="ion:add-outline" />
      &nbsp; Add new
    </button>
  </div>

  <UserCards />
</template>
