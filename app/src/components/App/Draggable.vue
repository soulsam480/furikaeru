<script setup lang="ts">
import { defineEmit, defineProps, ref } from 'vue';
import type { PropType } from 'vue';
import draggable from 'vuedraggable';
import Icon from './Icon.vue';
import type { Card, Comment } from 'src/utils/types';
import EditContent from 'src/components/App/EditContent.vue';
import Button from 'src/components/lib/Button.vue';

const props = defineProps({
  enabled: Boolean,
  list: Array as PropType<Card[]>,
  group: [String, Function],
  userId: String,
});

const emits = defineEmit(['upvote', 'change', 'move', 'end']);

const isEdit = ref<string | null>(null);
const isComments = ref<string | null>(null);
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
  const cardIndex = (props.list as Card[]).findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    (props.list as Card[]).splice(cardIndex, 1);
  }
  emits('end');
}

function handleAddComment(id: string) {
  if (!newComment) return;
  const cardIndex = (props.list as Card[]).findIndex((el) => el.id === id);
  const createIndex = `${props.userId?.split('-')[4]}--${new Date().valueOf()}`;
  if (cardIndex !== -1) {
    (props.list as Card[])[cardIndex].comments[createIndex] = {
      text: newComment.value,
      likes: 0,
    };
  }
  newComment.value = '';
  emits('end');
}

function handleCommentUpVote(id: string, coid: string) {
  const cardIndex = (props.list as Card[]).findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    (props.list as Card[])[cardIndex].comments[coid].likes += 1;
  }
  emits('end');
}

function handleRemoveComment(id: string, coid: string) {
  const cardIndex = (props.list as Card[]).findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    delete (props.list as Card[])[cardIndex].comments[coid];
  }
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
          bg-cyan-400
          hover:(shadow-lg
          shadow-gray-700)
          transition-all
          ease-in-out
          duration-400
          cursor-move
          my-2
          rounded-md
        "
        :class="{ 'not-draggable': !enabled }"
      >
        <div class="pb-2">
          <div class="flex" v-if="isEdit !== element.id">
            <div class="text-lg flex-grow break-all board-grid__column__item__title">{{ element.title }}</div>
            <div class="flex board-grid__column__item__edit transition-all ease-in-out">
              <Button
                icon="ion:pencil"
                title="Edit card title"
                @click="isEdit = element.id"
                v-if="element.user_id === userId"
                sm
                flat
              />
              <Button
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

        <div class="flex justify-end items-center pb-1">
          <Button
            title="Comment"
            @click="isComments === element.id ? (isComments = null) : (isComments = element.id)"
            icon="ion:chatbox-ellipses-outline"
            sm
            flat
            class="mr-1"
          />
          <span class="text-xs mr-1">{{ calcComments(element.comments) }}</span>
          <Button
            title="Up vote"
            @click="$emit('upvote', { cid: element.id })"
            icon="ion:rocket-outline"
            sm
            flat
            class="mr-1"
          />

          <span class="text-xs">{{ calcVotes(element.votes) }}</span>
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
            bg-cyan-300
            rounded-md
          "
          :ref="`c--${element.id}`"
          :style="isComments === element.id ? 'max-height: ' + $refs[`c--${element.id}`].scrollHeight + 'px' : ''"
          :class="{ 'px-1': isComments === element.id }"
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
              <Button
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
                <div class="flex-grow text-xs break-all">
                  {{ comment[1].text }}
                </div>
                <div class="flex-none flex items-center justify-end">
                  <Button
                    title="Remove comment"
                    @click="handleRemoveComment(element.id, comment[0])"
                    v-if="comment[0].split('--')[0] === userId?.split('-')[4]"
                    icon="ion:trash-outline"
                    sm
                    class="px-1 py-0 mr-1"
                    size="12px"
                  />
                  <Button
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
      </div>
    </template>
  </draggable>
</template>
