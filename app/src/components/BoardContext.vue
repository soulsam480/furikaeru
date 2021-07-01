<script setup lang="ts">
import { defineEmit, defineProps } from 'vue';
import { shareBoard, copyLink } from 'src/utils/helpers';
import FButton from 'src/components/lib/FButton.vue';
import type { BoardModel } from 'src/utils/types';
import { useAlerts } from 'src/store/alert';

defineProps<{
  board: BoardModel;
  uid: string;
}>();
defineEmit(['remove']);

const { setAlerts } = useAlerts();

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
