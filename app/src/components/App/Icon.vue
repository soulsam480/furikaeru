<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  size: String,
  icon: String,
});
</script>
<template>
  <span v-bind="$attrs">
    <i :style="{ fontSize: size || '20px' }" className="iconify" :data-icon="icon" :data-inline="true" />
  </span>
</template>
