<script lang="ts">
export default {
  name: 'FButton',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from './FIcon.vue';

const props = withDefaults(
  defineProps<{
    label?: any;
    icon?: string;
    size?: string;
    sm?: boolean;
    invert?: boolean;
    center?: boolean;
    block?: boolean;
    flat?: boolean;
    /**
     * @kind 'red', 'green', 'purple', 'indigo', 'cyan', 'amber', 'lime'
     * @default 'cyan'
     */
    color?: string;
    disabled?: boolean;
  }>(),
  {
    sm: false,
    invert: false,
    center: false,
    block: false,
    disabled: false,
  },
);

defineEmits(['click']);

const buttonColors = computed(() => {
  return props.disabled && props.flat
    ? `hover:bg-red-300`
    : props.disabled
    ? `bg-${props.color || 'cyan'}-500`
    : props.invert
    ? `bg-${props.color || 'cyan'}-200 hover:bg-${props.color || 'cyan'}-300`
    : props.flat
    ? `hover:bg-${props.color || 'cyan'}-300 bg-transparent`
    : `bg-${props.color || 'cyan'}-300 hover:bg-${props.color || 'cyan'}-400`;
});
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
      cursor-pointer
      disabled:(!cursor-not-allowed)
    "
    :class="[
      {
        'px-2 py-[6px]': sm,
        'px-3 py-2': !sm,
        'justify-center': center,
        'w-full': block,
      },
      buttonColors,
    ]"
    type="button"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <span v-if="icon || $slots.icon">
      <slot name="icon">
        <icon v-if="icon" :icon="icon" :size="icon && sm && !size ? '15px' : size || '17px'" />
      </slot>
    </span>

    <span v-if="label || $slots.default">
      <slot>
        {{ label }}
      </slot>
    </span>
  </button>
</template>
