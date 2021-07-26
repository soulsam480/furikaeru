<script setup lang="ts">
import { ref, watch } from 'vue';
import vuedraggable from 'vuedraggable';
import Icon from 'src/components/lib/FIcon.vue';
import type { Card, Comment } from 'src/utils/types';
import EditContent from 'src/components/App/EditContent.vue';
import FButton from 'src/components/lib/FButton.vue';
import NewComment from 'src/components/NewComment.vue';

const props = defineProps<{
  list: Card[];
  group: string;
  userId: string;
  sort: string;
  cId: string;
  isCommentsExpand: boolean;
  noDrag: boolean;
  isFocusMode?: boolean;
  color?: string;
}>();

const emits = defineEmits(['upvote', 'change', 'move', 'end']);

const isEdit = ref<string | null>(null);
const isComments = ref<string[]>([]);
const sortedList = ref<Card[]>(props.list);
const movedEl = ref<Card | null>(null);

//TODO: Anti pattern but have to do it
watch(
  () => [props.sort, props.list],
  () => {
    if (props.sort === 'vote') {
      sortedList.value = props.list.slice().sort((a, b) => {
        const aVotes = Object.keys(a.votes).length > 0 ? Object.values(a.votes).reduce((acc, val) => acc + val) : 0;
        const bVotes = Object.keys(b.votes).length > 0 ? Object.values(b.votes).reduce((acc, val) => acc + val) : 0;
        return bVotes > aVotes ? 1 : -1;
      });
    } else {
      sortedList.value = props.list;
    }
  },
  {
    deep: true,
  },
);

watch(
  () => props.isCommentsExpand,
  (v) => {
    if (v) {
      isComments.value = [...sortedList.value.map((el) => el.id)];
      return;
    }
    isComments.value = [];
  },
);

function calcVotes(votes: Record<string, any>) {
  if (Object.keys(votes).length === 0) return 0;
  return Object.values(votes).reduce((acc, val) => acc + val);
}

function calcComments(comments: Comment) {
  return Object.keys(comments).length;
}

function parseComments(comments: Comment) {
  if (Object.keys(comments).length === 0) return [];
  return Object.entries(comments);
}

function handleTitleChange() {
  (isEdit.value = null), emits('end');
}

function handleRemoveCard(id: string) {
  const cardIndex = props.list.findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    props.list.splice(cardIndex, 1);
  }
  emits('end');
}

function handleAddComment(id: string, val: string) {
  if (!val) return;
  const cardIndex = props.list.findIndex((el) => el.id === id);
  const createIndex = `${props.userId?.split('-')[4]}--${new Date().valueOf()}`;
  if (cardIndex !== -1) {
    props.list[cardIndex].comments[createIndex] = {
      text: val,
      likes: 0,
    };
  }
  emits('end');
}

function handleCommentUpVote(id: string, coid: string) {
  const cardIndex = props.list.findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    props.list[cardIndex].comments[coid].likes += 1;
  }
  emits('end');
}

function handleRemoveComment(id: string, coid: string) {
  const cardIndex = props.list.findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    delete props.list[cardIndex].comments[coid];
  }
  emits('end');
}

function toggleComments(id: string) {
  const idx = isComments.value.findIndex((el) => el === id);
  if (idx === -1) {
    isComments.value.push(id);
    return;
  }
  isComments.value.splice(idx, 1);
}

function handleEnd(e: any) {
  const { to, from } = e;
  if (props.sort && to && from) {
    if (to.id !== from.id) {
      const movePayload = {
        to: {
          data: movedEl.value,
          id: to.id,
        },
        from: {
          id: from.id,
        },
      };
      movedEl.value = null;
      emits('move', movePayload);
      return;
    }
    return;
  }
  if (movedEl.value) movedEl.value = null;
  emits('end');
}

function handleStart(e: any) {
  if (props.sort) {
    const { oldIndex } = e;
    movedEl.value = sortedList.value[oldIndex];
  }
}
</script>
<template>
  <vuedraggable
    class="board-grid__column flex flex-col"
    @change="$emit('change')"
    :list="sortedList"
    item-key="id"
    :group="group"
    @end="handleEnd"
    ghost-class="ghost"
    @start="handleStart"
    :sort="!sort"
    v-bind="$attrs"
    :id="cId"
    tag="transition-group"
    :component-data="{
      tag: 'div',
      type: 'transition-group',
      name: 'flip-list',
    }"
    :animation="300"
    :disabled="noDrag || !!isEdit"
  >
    <template #item="{ element }">
      <div
        v-bind="$attrs"
        class="board-grid__column__item block px-3 py-2 shadow-md my-2 relative rounded-md"
        :class="[
          `bg-${color}-400`,
          { 'filter blur-sm': isFocusMode && element.user_id !== userId },
          `${noDrag || !!isEdit ? 'no-drop' : 'cursor-move'}`,
        ]"
      >
        <!-- <transition
            enter-active-class="transition ease-out duration-400"
            enter-class="transform scale-y-0"
            enter-to-class="transform scale-y-1"
            leave-active-class="transition ease-in duration-500"
            leave-class="transform scale-y-1"
            leave-to-class="transform scale-y-0"
          > -->
        <div class="pb-2">
          <div class="flex space-x-1 items-start" v-if="isEdit !== element.id">
            <div class="text-lg py-[2px] flex-grow break-word board-grid__column__item__title">{{ element.title }}</div>
            <div class="flex board-grid__column__item__edit transition-all ease-in-out">
              <f-button
                :color="color"
                icon="ion:pencil"
                title="Edit card title"
                @click="isEdit = element.id"
                v-if="element.user_id === userId"
                sm
                flat
              />
              <f-button
                :color="color"
                icon="ion:trash-outline"
                title="Remove card"
                @click="handleRemoveCard(element.id)"
                v-if="element.user_id === userId"
                sm
                flat
              />
            </div>
          </div>
          <div v-else class="flex items-center w-full">
            <edit-content
              :content="element.title"
              @save="(element.title = $event), handleTitleChange()"
              @cancel="isEdit = null"
              :color="color"
            />
          </div>
        </div>

        <div class="flex space-x-2 justify-end items-center pb-1">
          <f-button
            :color="color"
            title="Comment"
            @click="toggleComments(element.id)"
            icon="ion:chatbox-ellipses-outline"
            sm
            flat
            id="comment"
          />
          <span class="text-xs">{{ calcComments(element.comments) }}</span>
          <f-button
            :color="color"
            title="Up vote"
            @click="$emit('upvote', { cid: element.id })"
            icon="ion:rocket-outline"
            sm
            flat
          />

          <span class="text-xs">{{ calcVotes(element.votes) }}</span>
        </div>
        <div
          class="flex-col h-auto board-grid__column__item__comments overflow-hidden rounded-md px-1 flex"
          :class="`bg-${color}-300`"
          v-show="isComments.includes(element.id)"
        >
          <new-comment :color="color" @save="handleAddComment(element.id, $event)" />

          <div class="pt-2">
            <div class="py-1 px-2" v-for="comment in parseComments(element.comments)" :key="comment[0]">
              <div class="flex items-center">
                <div class="flex-grow text-xs break-word">
                  {{ comment[1].text }}
                </div>
                <div class="flex-none flex items-center justify-end">
                  <f-button
                    :color="color"
                    title="Remove comment"
                    @click="handleRemoveComment(element.id, comment[0])"
                    v-if="comment[0].split('--')[0] === userId?.split('-')[4]"
                    icon="ion:trash-outline"
                    sm
                    class="px-1 py-0 mr-1"
                    size="12px"
                  />
                  <f-button
                    :color="color"
                    v-else
                    title="Up vote"
                    @click="handleCommentUpVote(element.id, comment[0])"
                    class="px-1 py-0 mr-1"
                    icon="ion:rocket-outline"
                    size="12px"
                    sm
                  />
                  <template v-if="comment[0].split('--')[0] === userId?.split('-')[4]">
                    <icon icon="ion:rocket-outline" size="10px" />
                    <span>&nbsp;</span>
                  </template>
                  <span class="text-xs">{{ comment[1].likes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- </transition> -->
      </div>
    </template>
  </vuedraggable>
</template>
<style>
.ghost {
  @apply bg-gray-50;
}
/* .ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
} */

.no-drop {
  cursor: no-drop;
}
</style>
