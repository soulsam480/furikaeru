<script setup lang="ts">
import { defineEmit, defineProps, onBeforeUnmount, onMounted, ref } from 'vue';
import FButton from 'src/components/lib/FButton.vue';

const props = defineProps<{
  content: string;
  color?: string;
}>();
const emit = defineEmit({
  save: String,
  cancel: null,
});

const newVal = ref(props.content);

function handleSave() {
  if (newVal.value === props.content) return;
  emit('save', newVal.value);
}

function handleClose(e: KeyboardEvent) {
  const { key } = e;
  if (key === 'Escape') return emit('cancel');
}

onMounted(() => window.addEventListener('keydown', handleClose));
onBeforeUnmount(() => window.removeEventListener('keydown', handleClose));
</script>
<template>
  <input
    type="text"
    class="rounded-md border-none flex-grow py-1 focus:shadow-none mr-1"
    :class="`bg-${color || 'cyan'}-50`"
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
    :color="color"
  />
  <FButton
    @click="$emit('cancel')"
    title="Cancel"
    flat
    icon="ion:close"
    class="dark:text-white dark:hover:text-black"
    sm
    :color="color"
  />
</template>
