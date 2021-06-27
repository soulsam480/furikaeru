<script setup lang="ts">
import Navbar from 'src/components/App/Navbar.vue';
import { authState } from 'src/utils/authState';
import { registerToken } from 'src/utils/helpers';
import FLoader from './components/lib/FLoader.vue';
import { useUser } from './store/user';
import FAlert from 'src/components/lib/FAlert.vue';
import { useAlerts } from './store/alert';

const { getLoader } = useUser();
const { getAlerts } = useAlerts();

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
    <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 list-group z-50">
      <transition-group name="list" tag="div">
        <FAlert
          v-for="alert in getAlerts"
          :key="alert.id"
          :icon="alert.icon"
          :message="alert.message"
          :id="alert.id"
          :type="alert.type"
          class="list-item"
        />
      </transition-group>
    </div>

    <Navbar />
    <FLoader v-if="getLoader" />
    <div class="max-w-7xl mx-auto px-2 py-3">
      <router-view />
    </div>
  </div>
</template>
<style>
.list-item {
  list-style-type: none;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-leave-to,
.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
