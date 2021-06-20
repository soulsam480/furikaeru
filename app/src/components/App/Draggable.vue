<script setup lang="ts">
import { defineEmit, defineProps, ref } from 'vue';
import type { PropType } from 'vue';
import draggable from 'vuedraggable';
import Icon from './Icon.vue';
import type { Card, Comment } from 'src/utils/types';

const props = defineProps({
  enabled: Boolean,
  list: Array as PropType<Card[]>,
  group: [String, Function],
  userId: String,
});

const isEdit = ref<string | null>(null);
const isComments = ref<string | null>(null);
const newComment = ref('');
const emits = defineEmit(['upvote', 'change', 'move', 'end']);

function calcVotes(votes: Record<string, any>) {
  if (Object.keys(votes).length === 0) return 0;
  return Object.values(votes).reduce((acc, val) => acc + val);
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
  const cardIndex = (props.list as Card[]).findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    (props.list as Card[]).splice(cardIndex, 1);
  }
  emits('end');
}

function handleAddComment(id: string) {
  const cardIndex = (props.list as Card[]).findIndex((el) => el.id === id);
  const createIndex = `${props.userId?.split('-')[4]}--${new Date().valueOf()}`;
  if (cardIndex !== -1) {
    (props.list as Card[])[cardIndex].comments[createIndex] = newComment.value;
  }
  newComment.value = '';
  emits('end');
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
  >
    <template #item="{ element }">
      <div
        v-bind="$attrs"
        class="
          board-grid__column__item
          relative
          block
          px-3
          py-2
          bg-cyan-100
          hover:bg-cyan-200
          transition-all
          ease-in-out
          duration-400
          cursor-move
          my-2
          rounded-md
          shadow-md shadow-gray-500
        "
        :class="{ 'not-draggable': !enabled }"
      >
        <div class="pb-2">
          <div class="flex" v-if="isEdit !== element.id">
            <div class="text-lg py-1 flex-grow break-all board-grid__column__item__title">{{ element.title }}</div>
            <div class="flex-none board-grid__column__item__edit">
              <button
                class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
                title="Edit card title"
                @click="isEdit = element.id"
                v-if="element.user_id === userId"
              >
                <Icon icon="ion:pencil" class="cursor-pointer" size="15px" />
              </button>
              <button
                class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
                title="Remove card"
                @click="handleRemoveCard(element.id)"
                v-if="element.user_id === userId"
              >
                <Icon icon="ion:trash-outline" class="cursor-pointer" size="15px" />
              </button>
            </div>
          </div>
          <div v-else class="flex items-center w-full">
            <div class="flex-grow mr-1">
              <input
                type="text"
                class="rounded-md border-none bg-cyan-50 py-1 w-full focus:shadow-none"
                v-model="element.title"
                @keyup.enter="handleTitleChange"
              />
            </div>
            <div class="flex-none">
              <button
                class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
                @click="handleTitleChange"
                title="Save"
              >
                <Icon icon="ion:checkmark" class="cursor-pointer" size="15px" />
              </button>

              <button
                class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
                @click="isEdit = null"
                title="Cancel"
              >
                <Icon icon="ion:close" class="cursor-pointer" size="15px" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end items-center">
          <div>
            <button
              class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md mr-1"
              title="Comment"
              @click="isComments === element.id ? (isComments = null) : (isComments = element.id)"
            >
              <icon icon="ion:chatbox-ellipses-outline" size="15px" />
            </button>

            <button
              class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md mr-1"
              title="Up vote"
              @click="$emit('upvote', { cid: element.id })"
            >
              <icon icon="ion:rocket-outline" size="15px" />
            </button>
            {{ calcVotes(element.votes) }}
          </div>
        </div>
        <div
          class="
            flex flex-col
            relative
            overflow-hidden
            transition-all
            max-h-0
            duration-400
            board-grid__column__item__comments
          "
          :ref="`c--${element.id}`"
          :style="isComments === element.id ? 'max-height: ' + $refs[`c--${element.id}`].scrollHeight + 'px' : ''"
          :class="{ 'pt-2': isComments === element.id }"
        >
          <div class="flex items-center">
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
              <button
                class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
                @click="handleAddComment(element.id)"
                title="Save"
              >
                <Icon icon="ion:checkmark" class="cursor-pointer" size="15px" />
              </button>
            </div>
          </div>

          <div class="py-1">
            <div class="py-1 break-all" v-for="comment in parseComments(element.comments)">
              {{ comment[1] }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </draggable>
</template>
