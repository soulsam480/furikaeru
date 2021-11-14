<script setup lang="ts">
import { ref } from 'vue';
import { FButton } from 'furikaeru';

defineProps<{
  color?: string;
}>();
const emit = defineEmits<{
  (e: 'save', val: string): void;
}>();

const newComment = ref('');

function handleSaveComment(val: string) {
  emit('save', val);
  newComment.value = '';
}
</script>
<template>
  <div class="flex items-center pt-2">
    <div class="flex-grow mr-1">
      <input
        type="text"
        class="rounded-md border-none w-full py-1 focus:shadow-none"
        :class="`bg-${color}-50`"
        v-model="newComment"
        @keyup.enter="handleSaveComment(newComment)"
        placeholder="Add a comment"
      />
    </div>
    <div class="flex-none">
      <f-button
        :color="color"
        icon="ion:checkmark"
        :disabled="!newComment"
        sm
        @click="handleSaveComment(newComment)"
        title="Save"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
