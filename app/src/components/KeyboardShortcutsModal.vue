<script setup lang="ts">
import FModal from 'src/components/lib/FModal.vue';
import FIcon from 'src/components/lib/FIcon.vue';

defineProps<{
  modelValue?: boolean;
}>();

defineEmits<{
  (e: 'update:model-value', val: boolean): void;
}>();
</script>
<template>
  <f-modal
    title="Shortcuts"
    width="300px"
    title-size="20px"
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #body>
      <div class="py-2 flex flex-col space-y-2 dark:text-white">
        <div class="text-base">Global</div>
        <div class="flex items-center space-x-4">
          <div class="flex-none flex items-center">
            <f-icon icon="vaadin:alt" size="18px" />
            &nbsp; +&nbsp;
            <f-icon icon="mdi:alpha-s-box" size="24px" />
          </div>
          <div class="flex-grow">View shortcuts</div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-none flex items-center">
            <f-icon icon="vaadin:alt" size="18px" />
            &nbsp; +&nbsp;
            <f-icon icon="mdi:alpha-q-box" size="24px" />
          </div>
          <div class="flex-grow">Toggle dark mode</div>
        </div>
        <div class="text-base">Scoped</div>
        <div class="flex items-center space-x-4">
          <div class="flex-none flex items-center">
            <f-icon icon="vaadin:alt" size="18px" />
            &nbsp; +&nbsp;
            <f-icon icon="mdi:alpha-n-box" size="24px" />
          </div>
          <div class="flex-grow">Create a new card</div>
        </div>
      </div>
    </template>
  </f-modal>
</template>
