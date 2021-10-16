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
import FButton from 'src/components/lib/FButton.vue';

const { getLoader } = useUser();
const { isConnected } = useIo();

const loadingBar = ref<ComponentPublicInstance<{}, FLoadingBarExpose> | null>(null);
const isBarLoader = ref(false);
const readBanner = () => localStorage.getItem('__f-banner');
const isBanner = ref(readBanner());

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

function setBanner() {
  localStorage.setItem('__f-banner', 'false');
  isBanner.value = readBanner();
}

authState();
registerToken();
checkDarkMode();
</script>
<template>
  <div>
    <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 list-group z-50">
      <transition-group name="list" tag="div" class="flex flex-col justify-center items-center">
        <f-alert
          v-for="alert in getAlerts"
          :key="alert.id"
          :icon="alert.icon"
          :message="alert.message"
          :id="alert.id as string"
          :type="alert.type"
          class="list-item"
        />
      </transition-group>
    </div>

    <navbar />

    <div class="relative">
      <transition name="fade">
        <f-loading-bar ref="loadingBar" v-show="isBarLoader" />
      </transition>
    </div>

    <f-loader v-if="getLoader" />

    <div class="max-w-7xl mx-auto px-2 py-3">
      <router-view />
    </div>

    <div class="fixed z-10 mx-2 bottom-5 left-0 right-0 flex items-center justify-center" v-if="!isBanner">
      <div class="p-2 flex space-x-3 items-center bg-lime-200 border border-lime-400 rounded-md">
        <div class="flex-grow">We use google analytics for traffic measurement and that's it !</div>
        <div class="flex-none">
          <f-button label="no problem !" color="cyan" @click="setBanner" />
        </div>
      </div>
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
