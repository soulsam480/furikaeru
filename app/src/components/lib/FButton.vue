<script setup lang="ts">
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

defineEmits(['click']);
</script>
<template>
  <button
    class="
      flex
      items-center
      text-sm
      rounded-md
      space-x-1
      focus:outline-none
      disabled:(cursor-not-allowed
      hover:bg-red-100)
    "
    :class="[
      {
        'px-2 py-[6px]': sm,
        'px-3 py-2': !sm,
        'justify-center': center,
        'w-full': block,
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
    <span v-if="icon || $slots.icon">
      <slot name="icon">
        <icon v-if="icon" :icon="icon" :size="icon && sm && !size ? '15px' : size" />
      </slot>
    </span>

    <span v-if="label || $slots.default">
      <slot>
        {{ label }}
      </slot>
    </span>
  </button>
</template>
