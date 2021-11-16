<script lang="ts">
export default {
  name: 'FBanner',
};
</script>

<script setup lang="ts">
import Icon from './FIcon.vue';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    text?: string;
    icon?: string;
    size?: string;
    noicon?: boolean;
    type?: 'success' | 'danger' | 'warning';
  }>(),
  {
    noicon: false,
  },
);

const bgColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-100 border-green-300 text-green-800';

    case 'warning':
      return 'bg-amber-100 border-amber-300 text-amber-800';

    case 'danger':
      return 'bg-red-100 border-red-300 text-red-800';

    default:
      return 'bg-amber-100 border-amber-300 text-amber-800';
  }
});

const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'ion:checkmark-circle';

    case 'warning':
      return 'ion:alert-circle';

    case 'danger':
      return 'ion:ban';

    default:
      return 'ion:information-circle';
  }
});
</script>
<template>
  <div class="px-2 py-1 w-full border border-1 flex items-center space-x-2 rounded-md" :class="bgColor">
    <div class="flex-none" v-if="!noicon">
      <icon :icon="icon ? icon : iconName" :size="size || '18px'" />
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
