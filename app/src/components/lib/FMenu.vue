<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import FButton from 'src/components/lib/FButton.vue';

const props = defineProps<{
  options: (string | { [x in 'label' | 'value']: any })[];
  modelValue?: string;
  optionKey?: 'label' | 'value';
  label?: string;
  icon?: string;
  size?: string;
  sm?: boolean;
  color?: string;
  flat?: boolean;
}>();
const emit = defineEmits(['update:modelValue', 'input']);

const isMenu = ref(false);
const selectedOption = ref<Record<'label' | 'value', any> | string>('');

function getOptionVal(option: string | Record<'label' | 'value', any>, optionKey?: 'label' | 'value'): string {
  if (typeof option !== 'object') return option;
  if (!optionKey) throw new Error('optionKey prop is required for Object type option.');
  return option[optionKey];
}

const buttonLabel = computed((): any => {
  if (!selectedOption.value) return null;
  if (typeof selectedOption.value === 'string') return selectedOption.value;
  return selectedOption.value.label;
});

function handleClose(e: KeyboardEvent) {
  if (!isMenu.value) return;
  const { key } = e;
  if (key === 'Escape') return (isMenu.value = false);
}

onMounted(() => window.addEventListener('keydown', handleClose));
onBeforeUnmount(() => window.removeEventListener('keydown', handleClose));

function handleClick(option: string | Record<'label' | 'value', any>, e: MouseEvent) {
  const val = getOptionVal(option, props.optionKey);
  selectedOption.value = option;

  emit('update:modelValue', val);
  emit('input', val, e);

  isMenu.value = false;
}
</script>
<template>
  <div class="relative f-menu" v-click-outside="() => (isMenu = false)">
    <div>
      <FButton
        :label="!!modelValue ? buttonLabel : label"
        :sm="sm"
        :icon="icon || 'ion:chevron-down-outline'"
        :size="size || '17px'"
        @click="isMenu = !isMenu"
        :color="color"
        :flat="flat"
        v-bind="$attrs"
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
        v-bind="$attrs"
      >
        <ul
          tabindex="-1"
          role="listbox"
          aria-labelledby="assigned-to-label"
          class="
            max-h-56
            rounded-md
            text-base
            leading-6
            shadow
            focus:outline-none
            sm:text-sm
            overflow-auto
            sm:leading-5
            f-menu__list
          "
          :class="`bg-${color || 'cyan'}-200`"
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
                transition-colors
                duration-300
                ease-in-out
              "
              v-for="option in options"
              :key="getOptionVal(option, optionKey)"
              @click="handleClick(option, $event)"
              :title="getOptionVal(option, optionKey)"
              :class="[
                modelValue === getOptionVal(option, optionKey) ? `bg-${color || 'cyan'}-300` : '',
                `hover:bg-${color || 'cyan'}-300`,
              ]"
            >
              <slot name="option" :option="getOptionVal(option, 'label')" :get-option-val="getOptionVal">
                <div class="font-normal flex-grow truncate">{{ getOptionVal(option, 'label') }}</div>
              </slot>
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
