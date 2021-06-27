<script setup lang="ts">
import { computed, ref } from 'vue';
import Icon from 'src/components/lib/FIcon.vue';
import { useUser } from 'src/store/user';
import FButton from 'src/components/lib/FButton.vue';
import { useRouter } from 'vue-router';

const { isLoggedIn, getUser, setLogin } = useUser();
const { push } = useRouter();
const isNav = ref(false);

const isDark = ref(localStorage.getItem('theme'));
const isContext = ref(false);
const mNav = ref<HTMLDivElement | null>(null);

const getNavHeight = computed(() => mNav.value?.scrollHeight);

function setNav() {
  isNav.value = !isNav.value;
}

function logout() {
  isContext.value = false;
  setLogin(null);
  localStorage.removeItem('__token');
  push('/');
}

function handleDarkMode() {
  const root = document.querySelector(':root');

  if (localStorage.theme === 'light') {
    //@ts-ignore
    root.style.setProperty('--f-bg', '#1F2937');
    isDark.value = 'dark';
    localStorage.theme = 'dark';
    document.documentElement.classList.add('dark');
  } else {
    //@ts-ignore
    root.style.setProperty('--f-bg', '#ffffff');
    isDark.value = 'light';
    localStorage.theme = 'light';
    document.documentElement.classList.remove('dark');
  }
}
</script>
<template>
  <nav
    class="
      sticky
      top-0
      z-20
      transition-colors
      duration-400
      ease-in-out
      border-b-[0.5px] border-cyan-200
      shadow-md shadow-cyan-200
      bg-white
      dark:bg-cool-gray-800
    "
    :class="{ '!bg-cyan-400 dark:bg-cyan-400 rounded-b-md': isNav }"
  >
    <div class="max-w-7xl mx-auto px-2">
      <div class="relative flex items-center justify-between h-14">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <FButton
            icon="ion:menu-outline"
            sm
            aria-controls="mobile-menu"
            :aria-expanded="isNav"
            @click="setNav"
          ></FButton>
        </div>
        <div class="flex-1 flex items-center ml-10 sm:ml-0 sm:items-stretch justify-start">
          <div
            class="flex-shrink-0 dark:text-white font-semibold flex items-center text-2xl cursor-pointer"
            :class="{ 'dark:text-black': isNav }"
            @click="$router.push('/')"
          >
            <img src="/icon-48.png" alt="Furikaeru logo" class="sm:block hidden mr-1" style="width: 30px" />
            furikaeru
          </div>
          <!-- <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4 items-center" v-if="isLoggedIn">
             
            </div>
          </div> -->
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div class="flex space-x-1 items-center">
              <FButton
                v-if="!isLoggedIn"
                sm
                icon="ion:shield-half-outline"
                @click="$router.push('/')"
                label="&nbsp;Anonymous"
              />
              <FButton
                v-else
                @click="isContext = !isContext"
                v-click-outside="() => (isContext = false)"
                class="focus:bg-cyan-400"
                sm
                :label="getUser.name"
                icon="ion:person-outline"
                size="17px"
              />
              <FButton sm @click="handleDarkMode" title="Toggle dark mode">
                <template #icon>
                  <Icon v-if="isDark === 'light'" icon="ion:contrast-outline" size="17px" />
                  <Icon v-if="isDark === 'dark'" icon="ion:sunny-outline" size="17px" />
                </template>
              </FButton>
              <FButton sm class="hidden sm:block">
                <a target="_blank" href="https://github.com/soulsam480/furikaeru">
                  <Icon icon="ion:logo-github" size="17px" />
                </a>
              </FButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                class="
                  origin-top-right
                  absolute
                  right-0
                  z-50
                  mt-2
                  w-48
                  rounded-md
                  shadow-lg
                  py-1
                  bg-cyan-200
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                "
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
                v-show="isContext"
              >
                <router-link to="/user" class="block px-4 py-2 hover:bg-cyan-300 text-sm" role="menuitem" tabindex="-1">
                  Home
                </router-link>
                <a
                  @click="logout"
                  class="block px-4 py-2 text-sm hover:bg-cyan-400 cursor-pointer"
                  role="menuitem"
                  tabindex="-1"
                >
                  Sign out
                </a>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <div
      class="overflow-hidden transition-all ease-in-out max-h-0 duration-300 sm:h-0"
      id="mobile-menu"
      ref="mNav"
      :style="isNav ? 'max-height: ' + getNavHeight + 'px' : ''"
      v-click-outside="() => (isNav = false)"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a
          type="button"
          target="_blank"
          class="hover:bg-cyan-400 block text-black px-3 py-2 rounded-md font-medium"
          href="https://github.com/soulsam480/furikaeru"
        >
          <Icon icon="ion:logo-github" size="20px" />
          &nbsp; GitHub
        </a>
      </div>
    </div>
  </nav>
</template>
