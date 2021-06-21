<script setup lang="ts">
import { defineEmit, defineProps, ref } from 'vue';
import Button from 'src/components/lib/Button.vue';
const props = defineProps({
  content: String,
});

const emit = defineEmit({
  save: String,
  cancel: null,
});
const newVal = ref(props.content);

function handleSave() {
  if (newVal.value === props.content) return;
  emit('save', newVal.value);
}
</script>
<template>
  <input
    type="text"
    class="rounded-md border-none bg-cyan-50 flex-grow py-1 focus:shadow-none mr-1"
    v-model="newVal"
    @keyup.enter="handleSave"
  />
  <Button @click="handleSave" :disabled="newVal === content" title="Save" flat icon="ion:checkmark" sm />
  <Button @click="$emit('cancel')" title="Cancel" flat icon="ion:close" sm />
</template>
