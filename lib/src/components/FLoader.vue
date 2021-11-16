<script lang="ts">
export default {
  name: 'FLoader',
};
</script>

<script setup lang="ts"></script>
<template>
  <div
    wire:loading
    class="
      fixed
      top-0
      left-0
      right-0
      bottom-0
      w-full
      h-screen
      z-10000
      overflow-hidden
      dark:bg-gray-800
      bg-white
      flex flex-col
      items-center
      justify-center
    "
  >
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-20 w-20 mb-4"></div>
    <h2 class="text-center text-black dark:text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-black dark:text-white">
      This may take a few seconds, please don't close this page.
    </p>
  </div>
</template>
<style lang="scss">
.loader {
  border-top-color: rgba(34, 211, 238, var(--tw-border-opacity)) !important;
  -webkit-animation: spinner 1s linear infinite;
  animation: spinner 1s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
