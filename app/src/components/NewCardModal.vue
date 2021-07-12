<script setup lang="ts">
import FMenu from 'src/components/lib/FMenu.vue';
import FModal from 'src/components/lib/FModal.vue';
import FButton from 'src/components/lib/FButton.vue';

defineProps<{
  options: (string | { [x in 'label' | 'value']: any })[] | null;
  newCardName: string;
  newCardParent: string;
  isModal: boolean;
}>();

defineEmits<{
  (e: 'add'): void;
  (e: 'update:new-card-name', val: string): void;
  (e: 'update:new-card-parent', val: string): void;
  (e: 'update:is-modal', val: boolean): void;
}>();
</script>
<template>
  <FModal
    title="Add new card"
    width="300px"
    title-size="20px"
    :model-value="isModal"
    @update:model-value="$emit('update:is-modal', $event)"
    @close="$emit('update:new-card-parent', '')"
  >
    <template #body>
      <div class="py-2 flex flex-col space-y-2 items-end">
        <FMenu
          :options="options"
          option-key="value"
          label="Select column"
          class="w-full"
          :model-value="newCardParent"
          @update:model-value="$emit('update:new-card-parent', $event)"
        />
        <input
          type="text"
          class="
            rounded-md
            w-full
            border border-cyan-200
            py-1
            shadow-none
            bg-cyan-50
            focus:(shadow-none
            border-cyan-400)
            transition-colors
          "
          placeholder="New card title"
          @keyup.enter="$emit('add')"
          :value="newCardName"
          @input="$emit('update:new-card-name', $event.target.value)"
        />
        <FButton label="Save" sm @click="$emit('add')" />
      </div>
    </template>
  </FModal>
</template>
<style lang="scss" scoped></style>
