<script setup lang="ts">
import { defineProps } from '@vue/runtime-core';
import type { PropType } from 'vue';
import draggable from 'vuedraggable';
defineProps({
  enabled: Boolean,
  list: Array as PropType<Record<string, any>[]>,
  group: [String, Function],
});
</script>
<template>
  <draggable :list="list" item-key="name" class="board-grid__column flex flex-col" :group="group">
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
        {{ element.name }}
      </div>
    </template>
  </draggable>
</template>
