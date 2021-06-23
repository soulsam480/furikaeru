<script setup lang="ts">
import { onMounted } from 'vue';
import Axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import Icon from 'src/components/App/Icon.vue';
import { useUser } from 'src/store/user';
import type { UserResponse } from 'src/store/user';

const { setLogin } = useUser();

const url = import.meta.env.VITE_API;
const { query } = useRoute();
const { push } = useRouter();
function login() {
  Axios({
    baseURL: import.meta.env.VITE_API,
    url: '/auth/google',
  });
}

async function catchRedirect() {
  if (!Object.keys(query)) return;
  if (!query.auth_success) return;
  const { auth_success } = query;
  try {
    const { data }: { data: UserResponse } = await Axios({
      baseURL: import.meta.env.VITE_API,
      url: '/auth/user',
      headers: {
        Authorization: `Bearer ${auth_success}`,
      },
    });
    setLogin({ ...data });
    push('/user');
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await catchRedirect();
});
</script>
<template>
  <div class="mt-24 flex flex-row justify-center">
    <div class="login sm:w-4/5 lg:w-2/5 w-full">
      <div class="login_card bg-gray-100 px-10 pt-5 p-b-10 rounded-xl">
        <img src="/icon-72.png" class="block m-auto pb-3" alt="icon-48.png" />
        <div class="grid grid-cols-1 gap-3 text-center">
          <div class="text-xl pb-4">
            Welcome to
            <b class="text-cyan-500">Furikaeru</b>
            !
          </div>
          <div class="pb-3">
            <div class="text-md px-2 mb-2 py-1 bg-amber-100 border-1 border-amber-200 rounded-md">
              You are currently in
              <b class="text-cyan-600">anonymous</b>
              mode.
            </div>
            <div class="text-sm text-gray-500">
              You can still view/edit public boards. Login/signup to create a board.
            </div>
          </div>
          <div>
            <a
              class="
                bg-cyan-200
                flex
                rounded-md
                justify-center
                items-center
                text-lg
                px-3
                py-2
                hover:bg-cyan-300
                border-1 border-cyan-300
                transition-all
                ease-in-out
                mx-auto
              "
              :href="`${url}/auth/google`"
              type="button"
              @click="login"
            >
              Login with &nbsp;
              <Icon icon="ion:logo-google" size="25px" />
            </a>
          </div>
          <div class="text-sm text-gray-500">To prevent spamming, only Google login is available.</div>
        </div>
      </div>
    </div>
  </div>
</template>
