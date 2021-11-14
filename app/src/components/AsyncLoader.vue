<script setup lang="ts"></script>
<template>
  <div class="p-4 flex justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
  </div>
</template>
<style lang="scss" scoped>
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
