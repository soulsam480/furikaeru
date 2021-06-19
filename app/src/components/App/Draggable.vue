<script setup lang="ts">
import { defineEmit, defineProps } from 'vue';
import type { PropType } from 'vue';
import draggable from 'vuedraggable';
import Icon from './Icon.vue';

defineProps({
  enabled: Boolean,
  list: Array as PropType<Record<string, any>[]>,
  group: [String, Function],
});

defineEmit(['upvote']);

function calcVotes(votes: Record<string, any>) {
  return Object.values(votes).reduce((acc, val) => acc + val);
}
</script>
<template>
  <draggable :list="list" item-key="id" class="board-grid__column flex flex-col" :group="group">
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
          duration-200
          cursor-move
          my-1
          rounded-md
        "
        :class="{ 'not-draggable': !enabled }"
      >
        <div class="text-lg">
          {{ element.title }}
        </div>
        <div class="flex justify-end">
          <div class="cursor-pointer" @click="$emit('upvote', { cid: element.id })">
            <icon icon="ion:rocket-outline" size="15px" />
            &nbsp;{{ calcVotes(element.votes) }}
          </div>
        </div>
      </div>
    </template>
  </draggable>
</template>
