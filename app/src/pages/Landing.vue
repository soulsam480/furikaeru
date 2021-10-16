<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from 'src/store/user';
import FBanner from 'src/components/lib/FBanner.vue';
import AppFooter from 'src/components/App/Footer.vue';
import FButton from 'src/components/lib/FButton.vue';
import { Head } from '@vueuse/head';
import { setToken } from 'src/utils/helpers';
import { getUserData, setUUID, tokenWatcher } from 'src/utils/authState';

const { setLogin, showLoader, hideLoader } = useUser();

const url = import.meta.env.VITE_API;
const { query } = useRoute();
const router = useRouter();

function login(type: 'google' | 'fb') {
  switch (type) {
    case 'google':
      window.location.href = `${url}/auth/google/`;
      break;

    case 'fb':
      window.location.href = `${url}/auth/fb/`;
      break;

    default:
      break;
  }
}

async function catchRedirect() {
  if (!Object.keys(query)) return;
  if (!query.auth_success) return;
  showLoader();

  const { auth_success } = query;
  setToken(auth_success as string);

  try {
    const data = await getUserData();

    localStorage.setItem('__token', data.refreshToken);
    setToken(data.accessToken);

    setLogin(data);
    setUUID();

    tokenWatcher(router);

    await router.push('/user');
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
    <Head>
      <title>Login/ Signup | Furikaeru</title>
    </Head>

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
              <f-banner
                noicon
                text="Furikaeru is in active development. Bugs and frequent changes are expected."
                class="my-2"
              />
            </div>

            <div class="pb-3">
              <f-banner class="mb-2" noicon>
                You are currently in
                <b class="text-cyan-600">anonymous</b>
                &nbsp;mode.
              </f-banner>
              <div class="text-sm text-gray-500">
                You can still view/edit public boards. Login/signup to create a board.
              </div>
            </div>
            <div class="text-xl">Login with</div>
            <div class="flex space-x-2 justify-center">
              <f-button icon="ion:logo-google" size="25px" class="!px-2" @click="login('google')" />
              <f-button icon="ion:logo-facebook" size="25px" class="!px-2" @click="login('fb')" />
            </div>
            <div class="text-sm text-gray-500">To prevent spamming, only passwordless login is available.</div>
          </div>
        </div>
      </div>
    </div>

    <app-footer />
  </div>
</template>
