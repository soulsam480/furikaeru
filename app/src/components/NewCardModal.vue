<script setup lang="ts">
import FMenu from 'src/components/lib/FMenu.vue';
import FModal from 'src/components/lib/FModal.vue';
import FButton from 'src/components/lib/FButton.vue';
import { ref } from 'vue';

defineProps<{
  options: (string | { [x in 'label' | 'value']: any })[] | null;
  newCardParent: string;
  isModal: boolean;
}>();

const emits = defineEmits<{
  (e: 'add', val: string): void;
  (e: 'update:new-card-parent', val: string): void;
  (e: 'update:is-modal', val: boolean): void;
}>();

const newCardName = ref('');

function handleSave(val: string) {
  emits('add', val);
  newCardName.value = '';
}
</script>
<template>
  <f-modal
    title="Add new card"
    width="300px"
    title-size="20px"
    :model-value="isModal"
    @update:model-value="$emit('update:is-modal', $event)"
    @close="$emit('update:new-card-parent', '')"
  >
    <template #body>
      <div class="py-2 flex flex-col space-y-2 items-end">
        <f-menu
          :options="options"
          option-key="value"
          label="Select column"
          :model-value="newCardParent"
          @update:model-value="$emit('update:new-card-parent', $event)"
          block
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
          @keyup.enter="handleSave(newCardName)"
          v-model="newCardName"
        />
        <FButton label="Save" sm @click="handleSave(newCardName)" />
      </div>
    </template>
  </f-modal>
</template>
