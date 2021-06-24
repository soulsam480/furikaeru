<script setup lang="ts">
import Navbar from 'src/components/App/Navbar.vue';
import { authState } from 'src/utils/authState';
import { registerToken } from 'src/utils/helpers';
import FLoader from './components/lib/FLoader.vue';
import { useUser } from './store/user';

const { getLoader } = useUser();

authState();
registerToken();
function checkDarkMode() {
  const root = document.querySelector(':root');
  if (!localStorage.theme) localStorage.theme = 'light';
  if (localStorage.theme && localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark');
    //@ts-ignore
    root.style.setProperty('--f-bg', '#1F2937');
  } else {
    document.documentElement.classList.remove('dark');
    //@ts-ignore
    root.style.setProperty('--f-bg', '#ffffff');
  }
}

checkDarkMode();
</script>
<template>
  <div>
    <Navbar />
    <FLoader v-if="getLoader" />
    <div class="max-w-7xl mx-auto px-2 py-3">
      <router-view />
    </div>
  </div>
</template>
