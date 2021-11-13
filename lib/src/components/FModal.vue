<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import FIcon from './FIcon.vue';

defineProps<{
  /**
   * In standard CSS units
   * max: 768px
   */
  width?: string;
  title?: string;
  /**
   * In standard CSS units
   * @default: 30px
   */
  titleSize?: string;
  modelValue?: boolean;
}>();

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'update:modelValue', val: boolean): void;
}>();

function handleClose() {
  emits('close');
  emits('update:modelValue', false);
}

function handleKeyDown(e: KeyboardEvent) {
  const { key } = e;
  if (key === 'Escape') {
    handleClose();
    return;
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyDown));
</script>
<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="modelValue"
        class="
          overflow-x-hidden overflow-y-auto
          fixed
          inset-0
          z-50
          outline-none
          focus:outline-none
          justify-center
          items-center
          flex
          f-modal
          backdrop-filter backdrop-blur-sm
        "
      >
        <div class="relative w-full my-6 sm:mx-auto mx-2 max-w-3xl">
          <div
            class="
              border-0
              rounded-md
              shadow-lg
              relative
              flex flex-col
              p-3
              bg-gray-200
              dark:bg-cool-gray-700
              transition-colors
              duration-400
              ease-in-out
              outline-none
              focus:outline-none
              f-modal__content
              mx-auto
            "
            :style="{ width: width || '100%' }"
            v-click-outside="() => handleClose()"
          >
            <slot>
              <slot name="header">
                <div class="flex items-start justify-between">
                  <div
                    class="flex-grow font-medium dark:text-white"
                    :class="{ 'text-3xl': !titleSize }"
                    :style="`${titleSize ? `font-size:${titleSize};` : ''}`"
                  >
                    {{ title }}
                  </div>
                  <div class="flex-none">
                    <f-icon
                      icon="ion:close-circle-outline"
                      class="
                        cursor-pointer
                        dark:text-white
                        hover:text-red-500
                        transition-colors
                        duration-300
                        ease-in-out
                      "
                      @click="handleClose"
                      title="close"
                    />
                  </div>
                </div>
              </slot>
              <slot name="body"></slot>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<style lang="scss" scoped>
.f-modal {
  &__content {
    @media (max-width: 600px) {
      width: 100% !important;
    }
  }
}
</style>
