<script setup lang="ts">
import { computed } from 'vue';
import FIcon from './FIcon.vue';

const props = defineProps<{
  icon?: string;
  message: string;
  id: string;
  type: 'success' | 'danger' | 'warning';
}>();

const bgColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500';

    case 'warning':
      return 'bg-yellow-500';

    case 'danger':
      return 'bg-red-500';

    default:
      return 'bg-blue-500';
  }
});
const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'ion:checkmark-circle-outline';

    case 'warning':
      return 'ion:alert-circle-outline';

    case 'danger':
      return 'ion:ban-outline';

    default:
      return '';
  }
});
</script>
<template>
  <div class="py-3 self-center">
    <div
      class="flex items-center space-x-2 text-white text-sm font-bold px-4 py-2 rounded-md shadow-md z-50"
      role="alert"
      :class="bgColor"
    >
      <span v-if="icon || iconName">
        <f-icon :icon="icon || iconName" size="15px" />
      </span>
      <span class="flex text-base font-normal flex-nowrap">{{ message }}</span>
    </div>
  </div>
</template>
