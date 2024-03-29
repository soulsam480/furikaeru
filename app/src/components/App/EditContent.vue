<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { FButton } from 'furikaeru';

const props = withDefaults(
  defineProps<{
    content?: string;
    color?: string;
    is?: 'input' | 'textarea';
  }>(),
  {
    is: 'textarea',
  },
);

const emit = defineEmits<{
  (e: 'save', val: string): void;
  (e: 'cancel'): void;
}>();

const newVal = ref(props.content || '');

function handleSave(e: KeyboardEvent) {
  if (props.is === 'textarea' && e && !e.ctrlKey) return;

  if (!!props.content ? props.content === newVal.value : !newVal.value) return;
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
    v-if="is === 'input'"
    type="text"
    class="rounded-md border-none flex-grow py-1 focus:shadow-none mr-1"
    :class="`bg-${color || 'cyan'}-100`"
    @keyup.enter="handleSave"
    v-model="newVal"
  />
  <textarea
    v-else
    type="text"
    class="rounded-md border-none flex-grow p-2 focus:shadow-none mr-1 !min-h-8 leading-none"
    :class="`bg-${color || 'cyan'}-100`"
    @keyup.enter="handleSave"
    v-model="newVal"
  />
  <div class="flex-none flex">
    <f-button
      @click="handleSave"
      :disabled="!!content ? content === newVal : !newVal"
      title="Save"
      class="dark:text-white dark:hover:text-black"
      flat
      icon="ion:checkmark"
      sm
      :color="color"
    />
    <f-button
      @click="$emit('cancel')"
      title="Cancel"
      flat
      icon="ion:close"
      class="dark:text-white dark:hover:text-black"
      sm
      :color="color"
    />
  </div>
</template>
