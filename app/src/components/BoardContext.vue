<script setup lang="ts">
import { ref } from 'vue';
import { shareBoard, copyLink, generateRoute } from 'src/utils/helpers';
import FButton from 'src/components/lib/FButton.vue';
import type { BoardModel } from 'src/utils/types';
import { useAlerts } from 'src/store/alert';
import FMenu from 'src/components/lib/FMenu.vue';
import FIcon from 'src/components/lib/FIcon.vue';

defineProps<{
  board: BoardModel;
  uid: string;
}>();
const emits = defineEmits(['remove', 'sort', 'expand', 'focus-mode']);

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
const isShare = navigator.share;

const { setAlerts } = useAlerts();
const sortBy = ref('');
const isExpand = ref(false);
const isFocus = ref(false);

function handleCommentCollapse() {
  isExpand.value = !isExpand.value;
  emits('expand');
}

function handleFocusMode() {
  isFocus.value = !isFocus.value;
  emits('focus-mode');
}
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
      @click="handleFocusMode"
      icon="ion:radio-button-on-outline"
      size="17px"
      sm
      title="Toggle focus mode"
      :color="isFocus ? 'green' : 'cyan'"
      v-if="board.is_public"
    />
    <FButton @click="handleCommentCollapse" sm :title="`${!isExpand ? 'Expand' : 'Collapse'} comments`">
      <template #icon>
        <FIcon icon="ion:contract-outline" size="17px" v-show="isExpand" />
        <FIcon icon="ion:expand-outline" size="17px" v-show="!isExpand" />
      </template>
    </FButton>

    <FButton
      title="Copy public URL"
      v-if="board.is_public"
      @click="
        copyLink(`https://furikaeru.sambitsahoo.com/${generateRoute(board)}`),
          setAlerts({ type: 'success', message: 'Copied!' })
      "
      icon="ion:clipboard-outline"
      size="17px"
      sm
    />
    <FButton
      title="Share board"
      v-if="board.is_public && !!isShare"
      @click="shareBoard(`https://furikaeru.sambitsahoo.com/${generateRoute(board)}`, board.title)"
      icon="ion:share-social-outline"
      size="17px"
      sm
    />
  </div>
</template>
