<script setup lang="ts">
const getYear = () => new Date().getFullYear();
</script>
<template>
  <div class="text-center pt-8 text-sm text-gray-500 dark:text-gray-200">
    <footer>Copyright © Sambit Sahoo {{ getYear() }}, MIT License</footer>
  </div>
</template>
<style lang="scss" scoped></style>
