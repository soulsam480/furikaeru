<script setup lang="ts">
import { defineEmit, defineProps, ref } from 'vue';
import FButton from 'src/components/lib/FButton.vue';
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
  <FButton
    @click="handleSave"
    :disabled="newVal === content"
    title="Save"
    class="dark:text-white dark:hover:text-black"
    flat
    icon="ion:checkmark"
    sm
  />
  <FButton
    @click="$emit('cancel')"
    title="Cancel"
    flat
    icon="ion:close"
    class="dark:text-white dark:hover:text-black"
    sm
  />
</template>
