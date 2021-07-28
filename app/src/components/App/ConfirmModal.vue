<script setup lang="ts">
import { ref } from 'vue';
import FModal from 'src/components/lib/FModal.vue';
import FButton from 'src/components/lib/FButton.vue';

defineProps<{
  isModal: boolean;
}>();
const emits = defineEmits<{
  (e: 'update:is-modal', val: boolean): void;
  (e: 'yes'): void;
  (e: 'no'): void;
}>();

function handleEmit(type: 'yes' | 'no') {
  if (type === 'yes') {
    emits('yes');
    emits('update:is-modal', false);
    return;
  }
  emits('no');
  emits('update:is-modal', false);
}
</script>
<template>
  <f-modal
    title="Are you sure ?"
    width="300px"
    title-size="20px"
    :model-value="isModal"
    @update:model-value="$emit('update:is-modal', $event)"
    @close="$emit('no')"
  >
    <template #body>
      <div class="py-2 flex items-center justify-center space-x-2">
        <f-button label="Yes" color="red" icon="ion:checkmark-circle-outline" @click="handleEmit('yes')" />
        <f-button label="No" icon="ion:ban-outline" @click="handleEmit('no')" />
      </div>
    </template>
  </f-modal>
</template>
