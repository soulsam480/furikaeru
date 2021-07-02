<script setup lang="ts">
import { defineEmit, defineProps, ref } from 'vue';
import draggable from 'vuedraggable';
import Icon from 'src/components/lib/FIcon.vue';
import type { Card, Comment } from 'src/utils/types';
import EditContent from 'src/components/App/EditContent.vue';
import FButton from 'src/components/lib/FButton.vue';

const props = defineProps<{ enabled: boolean; list: Card[]; group: string; userId: string }>();

const emits = defineEmit(['upvote', 'change', 'move', 'end']);

const isEdit = ref<string | null>(null);
const isComments = ref<string[]>([]);
const newComment = ref('');

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

function emitMove() {
  emits('move');
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

function handleAddComment(id: string) {
  if (!newComment) return;
  const cardIndex = props.list.findIndex((el) => el.id === id);
  const createIndex = `${props.userId?.split('-')[4]}--${new Date().valueOf()}`;
  if (cardIndex !== -1) {
    props.list[cardIndex].comments[createIndex] = {
      text: newComment.value,
      likes: 0,
    };
  }
  newComment.value = '';
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
</script>
<template>
  <draggable
    @change="$emit('change')"
    :list="list"
    item-key="id"
    class="board-grid__column flex flex-col"
    :group="group"
    :move="emitMove"
    @end="$emit('end')"
    ghost-class="ghost"
  >
    <template #item="{ element }">
      <div
        v-bind="$attrs"
        class="
          board-grid__column__item
          block
          px-3
          py-2
          bg-cyan-400
          hover:(shadow-lg
          shadow-gray-700)
          cursor-move
          my-2
          relative
          rounded-md
        "
        :class="{ 'not-draggable': !enabled }"
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
          <div class="flex" v-if="isEdit !== element.id">
            <div class="text-lg flex-grow break-word board-grid__column__item__title">{{ element.title }}</div>
            <div class="flex board-grid__column__item__edit transition-all ease-in-out">
              <FButton
                icon="ion:pencil"
                title="Edit card title"
                @click="isEdit = element.id"
                v-if="element.user_id === userId"
                sm
                flat
              />
              <FButton
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
            <EditContent
              :content="element.title"
              @save="(element.title = $event), handleTitleChange()"
              @cancel="isEdit = null"
            />
          </div>
        </div>

        <div class="flex space-x-2 justify-end items-center pb-1">
          <FButton
            title="Comment"
            @click="toggleComments(element.id)"
            icon="ion:chatbox-ellipses-outline"
            sm
            flat
            id="comment"
          />
          <span class="text-xs">{{ calcComments(element.comments) }}</span>
          <FButton title="Up vote" @click="$emit('upvote', { cid: element.id })" icon="ion:rocket-outline" sm flat />

          <span class="text-xs">{{ calcVotes(element.votes) }}</span>
        </div>
        <div
          class="flex-col h-auto board-grid__column__item__comments bg-cyan-300 overflow-hidden rounded-md px-1 flex"
          v-show="isComments.includes(element.id)"
        >
          <div class="flex items-center pt-2">
            <div class="flex-grow mr-1">
              <input
                type="text"
                class="rounded-md border-none w-full bg-cyan-50 py-1 focus:shadow-none"
                v-model="newComment"
                @keyup.enter="handleAddComment(element.id)"
                placeholder="Add a comment"
              />
            </div>
            <div class="flex-none">
              <FButton
                icon="ion:checkmark"
                :disabled="!newComment"
                sm
                @click="handleAddComment(element.id)"
                title="Save"
              />
            </div>
          </div>

          <div class="pt-2">
            <div class="py-1 px-2" v-for="comment in parseComments(element.comments)" :key="comment[0]">
              <div class="flex items-center">
                <div class="flex-grow text-xs break-word">
                  {{ comment[1].text }}
                </div>
                <div class="flex-none flex items-center justify-end">
                  <FButton
                    title="Remove comment"
                    @click="handleRemoveComment(element.id, comment[0])"
                    v-if="comment[0].split('--')[0] === userId?.split('-')[4]"
                    icon="ion:trash-outline"
                    sm
                    class="px-1 py-0 mr-1"
                    size="12px"
                  />
                  <FButton
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
  </draggable>
</template>
<style>
.ghost {
  @apply bg-cyan-200;
}
/* .ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
} */
</style>
