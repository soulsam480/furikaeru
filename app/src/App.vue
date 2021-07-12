<script setup lang="ts">
import { provide, ref, watch } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { AlertKey, FLoadingKey } from 'src/utils/types';
import type { FLoadingBarExpose } from 'src/utils/types';
import Navbar from 'src/components/App/Navbar.vue';
import FLoadingBar from 'src/components/lib/FLoadingBar.vue';
import FLoader from 'src/components/lib/FLoader.vue';
import FAlert from 'src/components/lib/FAlert.vue';
import { authState } from 'src/utils/authState';
import { registerToken } from 'src/utils/helpers';
import { useUser } from 'src/store/user';
import { useIo } from 'src/utils/createWs';
import { getAlerts, removeAlert, setAlerts } from 'src/utils/composables';

const { getLoader } = useUser();

const loadingBar = ref<ComponentPublicInstance<{}, FLoadingBarExpose> | null>(null);
const isBarLoader = ref(false);
const { isConnected } = useIo();

watch(
  () => isConnected.value,
  (v, o) => {
    if (v !== o) {
      if (v === false) {
        setAlerts({
          message: 'Connection lost !',
          type: 'danger',
        });
      } else if (v === true) {
        setAlerts({
          message: 'Connection established !',
          type: 'success',
        });
      }
    }
  },
);

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

function start(inc?: number) {
  isBarLoader.value = true;
  loadingBar.value!.start(inc);
}

function stop() {
  loadingBar.value!.stop();
  isBarLoader.value = false;
}

provide(FLoadingKey, {
  start,
  stop,
});

provide(AlertKey, {
  set: setAlerts,
  remove: removeAlert,
  alerts: getAlerts,
});

authState();
registerToken();
checkDarkMode();
</script>
<template>
  <div>
    <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 list-group z-50">
      <transition-group name="list" tag="div" class="flex flex-col justify-center items-center">
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

    <div class="relative">
      <transition name="fade">
        <FLoadingBar ref="loadingBar" v-show="isBarLoader" />
      </transition>
    </div>

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

.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}
</style>
