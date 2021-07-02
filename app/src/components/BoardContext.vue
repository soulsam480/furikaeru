<script setup lang="ts">
import { defineEmit, defineProps, ref } from 'vue';
import { shareBoard, copyLink } from 'src/utils/helpers';
import FButton from 'src/components/lib/FButton.vue';
import type { BoardModel } from 'src/utils/types';
import { useAlerts } from 'src/store/alert';
import FMenu from 'src/components/lib/FMenu.vue';

defineProps<{
  board: BoardModel;
  uid: string;
}>();
defineEmit(['remove', 'sort']);

const SortOptions = [
  {
    label: 'No sort',
    value: '',
  },
  {
    label: 'by Vote',
    value: 'vote',
  },
];

const { setAlerts } = useAlerts();
const sortBy = ref('');

const isShare = navigator.share;
</script>
<template>
  <div class="flex space-x-1 justify-end mb-2">
    <FButton
      title="Remove board"
      v-if="board.user === uid"
      @click="$emit('remove')"
      icon="ion:trash-outline"
      size="17px"
      sm
    />
    <FMenu
      :options="SortOptions"
      option-key="value"
      v-model="sortBy"
      sm
      :label="sortBy ? `Sort by ${sortBy}` : 'No sort'"
      icon="ion:filter-circle-outline"
      @input="$emit('sort', $event)"
    />
    <FButton
      title="Copy public URL"
      v-if="board.is_public"
      @click="
        copyLink(`https://furikaeru.sambitsahoo.com/${board.id}`), setAlerts({ type: 'success', message: 'Copied!' })
      "
      icon="ion:clipboard-outline"
      size="17px"
      sm
    />
    <FButton
      title="Share board"
      v-if="board.is_public && isShare"
      @click="shareBoard(`https://furikaeru.sambitsahoo.com/${board.id}`, board.title)"
      icon="ion:share-social-outline"
      size="17px"
      sm
    />
  </div>
</template>
