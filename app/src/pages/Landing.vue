<script setup lang="ts">
import Icon from 'src/components/App/Icon.vue';
</script>
<template>
  <div class="mt-24 flex flex-row justify-center">
    <div class="login sm:w-4/5 lg:w-2/5 w-full">
      <div class="login_card bg-gray-100 p-10 rounded-xl">
        <div class="grid grid-cols-1 gap-4 text-center">
          <div class="text-xl">
            Hii, Welcome to
            <b class="text-cyan-400">Furikaeru</b>
            !
          </div>
          <div>
            <button
              class="
                bg-cyan-200
                flex
                rounded-md
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
</template>
