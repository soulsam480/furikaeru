<script setup lang="ts">
import { defineEmit, defineProps, onBeforeUnmount, onMounted, ref } from 'vue';
import FButton from 'src/components/lib/FButton.vue';

defineProps<{
  options: string[] | Record<'label' | 'value', any>[];
  modelValue?: string;
  optionKey?: 'label' | 'value';
  label?: string;
  icon?: string;
  size?: string;
  sm?: boolean;
}>();
const emit = defineEmit(['update:modelValue', 'input']);

const isMenu = ref(false);

function getOptionVal(option: string | Record<'label' | 'value', any>, optionKey?: 'label' | 'value'): string {
  if (typeof option !== 'object') return option;
  if (!optionKey) throw new Error('optionKey prop is required for Object type option.');
  return option[optionKey];
}

function handleClose(e: KeyboardEvent) {
  if (!isMenu.value) return;
  const { key } = e;
  if (key === 'Escape') return (isMenu.value = false);
}

onMounted(() => window.addEventListener('keydown', handleClose));
onBeforeUnmount(() => window.removeEventListener('keydown', handleClose));

function handleClick(val: string, e: MouseEvent) {
  emit('update:modelValue', val);
  emit('input', val, e);
  isMenu.value = false;
}
</script>
<template>
  <div class="relative f-menu" v-click-outside="() => (isMenu = false)">
    <div>
      <FButton
        :label="label"
        :sm="sm"
        :icon="icon || 'ion:chevron-down-outline'"
        :size="size || '17px'"
        @click="isMenu = !isMenu"
      />
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        class="origin-top-right absolute z-50 right-0 min-w-32 mt-2 rounded-md bg-white shadow-lg"
        style="display: none"
        v-show="isMenu"
      >
        <ul
          tabindex="-1"
          role="listbox"
          aria-labelledby="assigned-to-label"
          class="
            max-h-56
            rounded-md
            py-1
            text-base
            leading-6
            shadow
            focus:outline-none
            sm:text-sm
            overflow-auto
            sm:leading-5
            bg-cyan-200
            f-menu__list
          "
        >
          <slot name="options" :options="options" :get-option-val="getOptionVal">
            <li
              role="option"
              class="
                text-gray-900
                cursor-pointer
                select-none
                relative
                px-3
                py-2
                flex
                hover:bg-cyan-300
                transition-colors
                duration-300
                ease-in-out
              "
              v-for="option in options"
              :key="getOptionVal(option, optionKey)"
              @click="handleClick(getOptionVal(option, optionKey), $event)"
              :title="getOptionVal(option, optionKey)"
              :class="{ 'bg-cyan-300': modelValue === getOptionVal(option, optionKey) }"
            >
              <div class="font-normal flex-grow truncate">{{ getOptionVal(option, 'label') }}</div>
            </li>
          </slot>
        </ul>
      </div>
    </transition>
  </div>
</template>
<style lang="scss" scoped>
.f-menu {
  &__list {
    &::-webkit-scrollbar {
      width: 3px;
      @apply bg-transparent;
    }
    &::-webkit-scrollbar-thumb {
      @apply bg-cool-gray-600;
    }
    &::-webkit-scrollbar-track {
      @apply bg-transparent;
    }
  }
}
</style>
