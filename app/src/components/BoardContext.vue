<script setup lang="ts">
import { ref } from 'vue';
import { shareBoard, copyLink, generateRoute } from 'src/utils/helpers';
import FButton from 'src/components/lib/FButton.vue';
import type { BoardModel } from 'src/utils/types';
import FMenu from 'src/components/lib/FMenu.vue';
import FIcon from 'src/components/lib/FIcon.vue';
import { useAlert } from 'src/utils/composables';

const props = defineProps<{
  board: BoardModel;
  uid: string;
}>();
const emits = defineEmits(['remove', 'sort', 'expand', 'focus-mode', 'toggle-drag', 'max-vote']);

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

const maxVoteOptions = [...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => ({ label: `Max vote ${val}`, value: val }))];

const isShare = navigator.share;

const { set } = useAlert();
const sortBy = ref('');
const maxVote = ref(props.board.max_vote);
const isExpand = ref(false);
const isFocus = ref(false);
const noDrag = ref(false);

function handleCommentCollapse() {
  isExpand.value = !isExpand.value;
  emits('expand');
}

function handleFocusMode() {
  isFocus.value = !isFocus.value;
  emits('focus-mode');
}

function handleDragToggle() {
  noDrag.value = !noDrag.value;
  emits('toggle-drag');
}
</script>
<template>
  <div
    class="
      flex
      space-x-1
      justify-end
      mb-2
      sticky
      top-[57px]
      z-50
      sm:(static
      !bg-transparent
      top-[unset])
      p-1
      bg-white
      dark:bg-cool-gray-800
      rounded-t-none rounded
      transition-colors
      duration-400
      ease-in-out
    "
  >
    <f-button
      title="Remove board"
      v-if="board.user === uid"
      @click="$emit('remove')"
      icon="ion:trash-outline"
      size="17px"
      sm
    />

    <f-menu
      v-model="maxVote"
      :options="maxVoteOptions"
      option-key="value"
      sm
      icon="ion:rocket-outline"
      @input="$emit('max-vote', $event)"
      v-if="board.is_public"
    />

    <f-menu
      :options="SortOptions"
      option-key="value"
      v-model="sortBy"
      sm
      :label="sortBy ? `Sort by ${sortBy}` : 'No sort'"
      icon="ion:filter-circle-outline"
      @input="$emit('sort', $event)"
    />

    <f-button size="17px" sm title="Toggle drag" :color="noDrag ? 'red' : 'cyan'" @click="handleDragToggle">
      <template #icon>
        <FIcon icon="ic:outline-do-not-touch" size="17px" v-show="!noDrag" />
        <FIcon icon="ic:outline-touch-app" size="17px" v-show="noDrag" />
      </template>
    </f-button>

    <f-button
      @click="handleFocusMode"
      size="17px"
      sm
      title="Toggle focus mode"
      :color="isFocus ? 'green' : 'cyan'"
      v-if="board.is_public"
    >
      <template #icon>
        <FIcon icon="ion:radio-button-on-outline" size="17px" v-show="!isFocus" />
        <FIcon icon="ion:radio-button-off-outline" size="17px" v-show="isFocus" />
      </template>
    </f-button>

    <f-button @click="handleCommentCollapse" sm :title="`${!isExpand ? 'Expand' : 'Collapse'} comments`">
      <template #icon>
        <FIcon icon="ion:contract-outline" size="17px" v-show="isExpand" />
        <FIcon icon="ion:expand-outline" size="17px" v-show="!isExpand" />
      </template>
    </f-button>

    <f-button
      title="Copy public URL"
      v-if="board.is_public"
      @click="
        copyLink(`https://furikaeru.sambitsahoo.com/${generateRoute(board)}`),
          set({ type: 'success', message: 'Copied!' })
      "
      icon="ion:clipboard-outline"
      size="17px"
      sm
    />

    <f-button
      title="Share board"
      v-if="board.is_public && !!isShare"
      @click="shareBoard(`https://furikaeru.sambitsahoo.com/${generateRoute(board)}`, board.title)"
      icon="ion:share-social-outline"
      size="17px"
      sm
    />
  </div>
</template>
