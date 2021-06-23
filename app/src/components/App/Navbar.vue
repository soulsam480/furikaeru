<script setup lang="ts">
import { ref } from 'vue';
import Icon from 'src/components/App/Icon.vue';
import { useUser } from 'src/store/user';
import Button from 'src/components/lib/Button.vue';

const { isLoggedIn, getUser } = useUser();

const isNav = ref(false);

const isDark = ref(localStorage.getItem('theme'));

function setNav() {
  isNav.value = !isNav.value;
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
  <nav class="bg-cyan-300 sticky top-0 z-20">
    <div class="max-w-7xl mx-auto px-2">
      <div class="relative flex items-center justify-between h-14">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md hover:bg-cyan-200 focus:outline-none"
            aria-controls="mobile-menu"
            :aria-expanded="isNav"
            @click="setNav"
          >
            <span class="sr-only">Open main menu</span>
            <Icon icon="ion:menu-outline" size="24px" />
          </button>
        </div>
        <div class="flex-1 flex items-center ml-10 sm:ml-0 sm:items-stretch justify-start">
          <div class="flex-shrink-0 flex items-center text-2xl font-semibold">
            <img src="/icon-48.png" alt="Furikaeru logo" class="sm:block hidden" style="width: 40px" />
            Furikaeru
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4 items-center" v-if="isLoggedIn">
              <router-link to="/user" class="px-3 py-2 hover:bg-cyan-200 rounded-md font-medium">Home</router-link>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div class="flex items-center">
              <button
                type="button"
                class="flex items-center rounded-md hover:bg-cyan-200 px-3 py-2 mr-2 focus:outline-none"
                v-if="!isLoggedIn"
              >
                Login with &nbsp;
                <Icon icon="ion:logo-google" />
              </button>

              <button v-else type="button" class="flex text-sm items-center rounded-full mr-2 focus:outline-none">
                <Icon icon="ion:person-outline" />
                &nbsp; {{ getUser.name }}
              </button>
              <Button sm @click="handleDarkMode" title="Toggle dark mode">
                <template #icon>
                  <Icon v-show="isDark === 'light'" icon="ion:contrast-outline" size="17px" />
                  <Icon v-show="isDark === 'dark'" icon="ion:sunny-outline" size="17px" />
                </template>
              </Button>
            </div>

            <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          -->
            <!-- <div
              class="
                origin-top-right
                absolute
                right-0
                mt-2
                w-48
                rounded-md
                shadow-lg
                py-1
                bg-white
                ring-1 ring-black ring-opacity-5
                focus:outline-none
              "
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                id="user-menu-item-0"
                >Your Profile</a
              >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                id="user-menu-item-1"
                >Settings</a
              >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                id="user-menu-item-2"
                >Sign out</a
              >
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <!-- :class="isNav ? 'sm:hidden h-auto' : 'hidden h-0'" -->
    <div
      class="overflow-hidden transition-all ease-in-out max-h-0 duration-300 sm:h-0"
      id="mobile-menu"
      ref="mNav"
      :style="isNav ? 'max-height: ' + $refs.mNav.scrollHeight + 'px' : ''"
    >
      <div class="px-2 pt-2 pb-3 space-y-1" v-if="isLoggedIn">
        <router-link
          to="/"
          class="hover:bg-cyan-200 block px-3 py-2 rounded-md text-base font-medium"
          aria-current="page"
        >
          Home
        </router-link>
      </div>
    </div>
  </nav>
</template>
