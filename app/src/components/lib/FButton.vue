<script setup lang="ts">
import { defineEmit, defineProps } from '@vue/runtime-core';
import Icon from 'src/components/lib/FIcon.vue';

defineProps<{
  label?: any;
  icon?: string;
  size?: string;
  sm?: boolean;
  invert?: boolean;
  center?: boolean;
  block?: boolean;
  flat?: boolean;
  color?: string;
}>();

defineEmit(['click']);
</script>
<template>
  <button
    class="flex items-center text-sm rounded-md focus:outline-none disabled:(cursor-not-allowed hover:bg-red-100)"
    :class="[
      {
        'px-2 py-[6px]': sm,
        'px-3 py-2': !sm,
        'justify-center': center,
        'w-full': block,
        'space-x-1': icon || $slots.icon,
      },
      `${
        invert
          ? `bg-${color || 'cyan'}-200 hover:bg-${color || 'cyan'}-300`
          : flat
          ? `hover:bg-${color || 'cyan'}-300`
          : `bg-${color || 'cyan'}-300 hover:bg-${color || 'cyan'}-400`
      }`,
    ]"
    type="button"
    @click="$emit('click')"
  >
    <slot name="icon">
      <Icon v-if="icon" :icon="icon" :size="icon && sm && !size ? '15px' : size" />
    </slot>
    <slot>
      <div v-if="label">
        {{ label }}
      </div>
    </slot>
  </button>
</template>
