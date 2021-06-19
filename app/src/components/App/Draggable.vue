<script setup lang="ts">
import { defineEmit, defineProps, ref } from 'vue';
import type { PropType } from 'vue';
import draggable from 'vuedraggable';
import Icon from './Icon.vue';
import type { Card } from 'src/utils/types';

const props = defineProps({
  enabled: Boolean,
  list: Array as PropType<Card[]>,
  group: [String, Function],
});

const isEdit = ref<string | null>(null);

const emits = defineEmit(['upvote', 'change', 'move', 'end']);

function calcVotes(votes: Record<string, any>) {
  if (Object.keys(votes).length === 0) return 0;
  return Object.values(votes).reduce((acc, val) => acc + val);
}

function emitMove() {
  emits('move');
}

function handleTitleChange(card: Card) {
  const { id } = card;
  const cardIndex = (props.list as Card[]).findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    (props.list as Card[])[cardIndex].updated_date = new Date().valueOf();
  }
  (isEdit.value = null), emits('end');
}

function handleRemoveCard(id: string) {
  const cardIndex = (props.list as Card[]).findIndex((el) => el.id === id);
  if (cardIndex !== -1) {
    (props.list as Card[]).splice(cardIndex, 1);
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
          bg-cyan-100
          hover:bg-cyan-200
          transition-all
          ease-in-out
          duration-400
          cursor-move
          my-1
          rounded-md
          shadow-md shadow-gray-500
        "
        :class="{ 'not-draggable': !enabled }"
      >
        <div class="pb-2">
          <div class="flex" v-if="isEdit !== element.id">
            <div class="text-lg flex-grow break-all">{{ element.title }}</div>
            <div class="flex-none">
              <button
                class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
                title="Edit card title"
                @click="isEdit = element.id"
              >
                <Icon icon="ion:pencil" class="cursor-pointer" size="15px" />
              </button>
              <button
                class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
                title="Remove card"
                @click="handleRemoveCard(element.id)"
              >
                <Icon icon="ion:trash-outline" class="cursor-pointer" size="15px" />
              </button>
            </div>
          </div>
          <div v-else class="flex items-center">
            <input
              type="text"
              class="rounded-md border-none bg-cyan-50 flex-grow py-1 focus:shadow-none mr-1"
              v-model="element.title"
              @keyup.enter="handleTitleChange(element)"
            />
            <button
              class="px-2 py-1 hover:bg-cyan-100 focus:outline-none rounded-md"
              @click="handleTitleChange(element)"
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

        <div class="flex justify-end items-center">
          <div>
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
      </div>
    </template>
  </draggable>
</template>
