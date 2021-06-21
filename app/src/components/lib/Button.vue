<script setup lang="ts">
import { defineEmit, defineProps } from '@vue/runtime-core';
import Icon from 'src/components/App/Icon.vue';

defineProps({
  label: String,
  icon: String,
  size: String,
  sm: Boolean,
  invert: Boolean,
  center: Boolean,
  block: Boolean,
  flat: Boolean,
});

defineEmit(['click']);
</script>
<template>
  <button
    class="flex items-center rounded-md focus:outline-none disabled:(cursor-not-allowed hover:bg-red-100)"
    :class="{
      'px-2 py-1': sm,
      'px-3 py-2': !sm,
      'bg-cyan-300 hover:bg-cyan-400': !invert && !flat,
      'hover:bg-cyan-300': flat,
      'bg-cyan-200 hover:bg-cyan-300': invert,
      'justify-center': center,
      'w-full': block,
    }"
    type="button"
    @click="$emit('click')"
  >
    <slot name="icon">
      <Icon v-if="icon || $slots.icon" :icon="icon" :size="icon && sm && !size ? '15px' : size" />
    </slot>
    <slot v-if="label || $slots.default">
      {{ label }}
    </slot>
  </button>
</template>
