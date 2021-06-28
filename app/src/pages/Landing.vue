<script setup lang="ts">
import { onMounted } from 'vue';
import Axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import Icon from 'src/components/lib/FIcon.vue';
import { useUser } from 'src/store/user';
import type { UserResponse } from 'src/store/user';
import FBanner from 'src/components/lib/FBanner.vue';
import AppFooter from 'src/components/App/Footer.vue';

const { setLogin, showLoader, hideLoader } = useUser();

const url = import.meta.env.VITE_API;
const { query } = useRoute();
const { push } = useRouter();
function login() {
  window.location.href = `${url}/auth/google/`;
}

async function catchRedirect() {
  if (!Object.keys(query)) return;
  if (!query.auth_success) return;
  showLoader();
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
    await push('/user');
    hideLoader();
  } catch (error) {
    console.log(error);
    hideLoader();
  }
}

onMounted(async () => {
  await catchRedirect();
});
</script>
<template>
  <div>
    <div class="mt-20 flex flex-row justify-center">
      <div class="login sm:w-4/5 lg:w-2/5 w-full">
        <div class="login_card bg-gray-100 px-10 pt-5 p-b-10 rounded-xl">
          <img src="/icon-72.png" class="block m-auto pb-3" alt="icon-48.png" />
          <div class="grid grid-cols-1 gap-3 text-center">
            <div class="text-xl mb-4">
              <div>
                Welcome to
                <b class="text-cyan-500">Furikaeru</b>
                !
              </div>
              <FBanner
                noicon
                text="Furikaeru is in active development. Bugs and frequent changes are expected."
                class="my-2"
              />
            </div>

            <div class="pb-3">
              <FBanner class="mb-2" noicon>
                You are currently in
                <b class="text-cyan-600">anonymous</b>
                &nbsp;mode.
              </FBanner>
              <div class="text-sm text-gray-500">
                You can still view/edit public boards. Login/signup to create a board.
              </div>
            </div>
            <div>
              <button
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
                  w-full
                "
                @click="login"
              >
                Login with &nbsp;
                <Icon icon="ion:logo-google" size="25px" />
              </button>
            </div>
            <div class="text-sm text-gray-500">To prevent spamming, only Google login is available.</div>
          </div>
        </div>
      </div>
    </div>
    <app-footer />
  </div>
</template>
