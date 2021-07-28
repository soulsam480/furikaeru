<script setup lang="ts">
import { ref, toRef, watch } from 'vue';
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
const maxVote = ref<number>();
const isExpand = ref(false);
const isFocus = ref(false);
const noDrag = ref(false);

watch(
  () => props.board.max_vote,
  (val) => {
    if (!!val) {
      maxVote.value = val;
    }
  },
);

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
      top-[56px]
      z-50
      sm:(static
      !bg-transparent
      top-[unset])
      bg-white
      dark:bg-cool-gray-800
      rounded-t-none rounded
      transition-colors
      duration-400
      ease-in-out
      flex-wrap
      items-baseline
      p-1
    "
  >
    <f-button
      title="Remove board"
      v-if="board.user === uid"
      @click="$emit('remove')"
      icon="ion:trash-outline"
      size="17px"
      sm
      class="mt-1"
    />

    <f-menu
      v-model="maxVote"
      :options="maxVoteOptions"
      option-key="value"
      sm
      @input="$emit('max-vote', $event)"
      v-if="board.is_public"
      noicon
      class="mt-1"
      :disabled="board.user !== uid"
    />

    <f-menu
      :options="SortOptions"
      option-key="value"
      v-model="sortBy"
      sm
      :label="sortBy ? `Sort by ${sortBy}` : 'No sort'"
      icon="ion:filter-circle-outline"
      @input="$emit('sort', $event)"
      class="mt-1"
    />

    <f-button
      size="17px"
      sm
      title="Toggle drag"
      :color="noDrag ? 'red' : 'cyan'"
      @click="handleDragToggle"
      class="mt-1"
    >
      <template #icon>
        <f-icon icon="ic:outline-do-not-touch" size="17px" v-show="!noDrag" />
        <f-icon icon="ic:outline-touch-app" size="17px" v-show="noDrag" />
      </template>
    </f-button>

    <f-button
      @click="handleFocusMode"
      size="17px"
      sm
      title="Toggle focus mode"
      :color="isFocus ? 'green' : 'cyan'"
      v-if="board.is_public"
      class="mt-1"
    >
      <template #icon>
        <f-icon icon="ion:radio-button-on-outline" size="17px" v-show="!isFocus" />
        <f-icon icon="ion:radio-button-off-outline" size="17px" v-show="isFocus" />
      </template>
    </f-button>

    <f-button @click="handleCommentCollapse" class="mt-1" sm :title="`${!isExpand ? 'Expand' : 'Collapse'} comments`">
      <template #icon>
        <f-icon icon="ion:contract-outline" size="17px" v-show="isExpand" />
        <f-icon icon="ion:expand-outline" size="17px" v-show="!isExpand" />
      </template>
    </f-button>

    <f-button
      class="mt-1"
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
      class="mt-1"
      title="Share board"
      v-if="board.is_public && !!isShare"
      @click="shareBoard(`https://furikaeru.sambitsahoo.com/${generateRoute(board)}`, board.title)"
      icon="ion:share-social-outline"
      size="17px"
      sm
    />
  </div>
</template>
