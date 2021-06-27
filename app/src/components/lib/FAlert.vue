<script setup lang="ts">
import { computed, defineProps } from '@vue/runtime-core';
import FIcon from 'src/components/lib/FIcon.vue';
// import { useAlerts } from 'src/store/alert';

// const { removeAlert } = useAlerts();

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
      break;
    case 'warning':
      return 'bg-yellow-500';
      break;
    case 'danger':
      return 'bg-red-500';
      break;
    default:
      return 'bg-blue-500';
      break;
  }
});
const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'ion:checkmark-circle-outline';
      break;
    case 'warning':
      return 'ion:alert-circle-outline';
      break;
    case 'danger':
      return 'ion:ban-outline';
      break;
    default:
      return '';
      break;
  }
});
</script>
<template>
  <div class="py-3 pr-5">
    <div
      class="flex items-center space-x-2 text-white text-sm font-bold px-4 py-2 rounded-md shadow-md z-50"
      role="alert"
      :class="bgColor"
    >
      <span v-if="icon || iconName">
        <f-icon :icon="icon || iconName" size="15px" />
      </span>
      <span class="flex text-lg">{{ message }}</span>
      <!-- <button
        type="button"
        class="flex pa-2 hover:(bg-opacity-10) rounded-md"
        :class="bgColor"
        @click="removeAlert(id)"
      >
        <f-icon icon="ion:close-circle-outline" />
      </button> -->
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
