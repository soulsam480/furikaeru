<script setup lang="ts">
import { useUser } from 'src/store/user';
import { v4 as uuid } from 'uuid';
import type { BoardColumn } from 'src/utils/types';
import { furiApi } from 'src/utils/helpers';
const { isLoggedIn, getUser } = useUser();

async function createBoard() {
  const votes: { [x: string]: number } = {};
  votes[getUser.value.id as string] = 1;
  const data: BoardColumn[] = [
    {
      id: uuid(),
      name: 'Something',
      created_at: new Date().valueOf(),
      updated_at: new Date().valueOf(),
      owner_id: getUser.value.id as string,
      data: [
        {
          id: uuid(),
          title: 'something',
          votes: { ...votes },
          owner_id: getUser.value.id as string,
          user_id: getUser.value.id as string,
          created_date: new Date().valueOf(),
          updated_date: new Date().valueOf(),
        },
      ],
    },
  ];

  try {
    const { data: result } = await furiApi.post('/board', {
      data,
      is_public: true,
    });
    console.log(result);
  } catch (error) {
    console.log(JSON.parse(JSON.stringify(error)));
  }
}
</script>
<template>
  <div>user is {{ isLoggedIn }}.</div>
  <button class="px-3 py-2 bg-cyan-200" @click="createBoard">Create</button>
  <div>wefj</div>
</template>
