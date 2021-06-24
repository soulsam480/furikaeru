<script setup lang="ts">
import { useUser } from 'src/store/user';
import { v4 as uuid } from 'uuid';
import type { BoardColumn } from 'src/utils/types';
import { furiApi } from 'src/utils/helpers';
import UserCards from 'src/components/UserCards.vue';
import { useRouter } from 'vue-router';
import Button from 'src/components/lib/Button.vue';
import FBanner from 'src/components/lib/FBanner.vue';

const { getUser } = useUser();
const { push } = useRouter();

async function createBoard() {
  const data: { title: string; data: BoardColumn[]; is_public: boolean } = {
    title: 'Example board',
    data: [
      {
        id: uuid(),
        name: 'This is a column',

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
    is_public: true,
  };

  try {
    const { data: result } = await furiApi.post('/board', {
      ...data,
    });
    console.log(result);
    push(`/${result.id}/`);
  } catch (error) {
    console.log(JSON.parse(JSON.stringify(error)));
  }
}
</script>
<template>
  <div>
    <FBanner text="Furikaeru is in active development. Bugs and frequent changes are expected." class="my-2" />
    <div class="flex justify-between">
      <div class="text-3xl font-semibold dark:text-white">My boards</div>
      <Button label="Add new" icon="ion:add-outline" @click="createBoard" />
    </div>

    <UserCards />
  </div>
</template>
