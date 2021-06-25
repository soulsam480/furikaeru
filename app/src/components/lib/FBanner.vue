<script setup lang="ts">
import { defineProps } from '@vue/runtime-core';
import Icon from 'src/components/lib/FIcon.vue';

defineProps({
  text: String,
  icon: String,
  size: String,
  noicon: Boolean,
});
</script>
<template>
  <div class="px-2 py-1 w-full bg-amber-200 border border-1 border-amber-400 flex items-center space-x-2 rounded-md">
    <div class="flex-none" v-if="!noicon">
      <Icon :icon="icon || 'ion:information-circle'" :size="size || '18px'" />
    </div>
    <div class="flex-grow">
      <slot>
        <div class="text-sm break-words">
          {{ text }}
        </div>
      </slot>
    </div>
  </div>
</template>
