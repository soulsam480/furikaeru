<template>
  <div class="board">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 board-grid">
      <div>
        <div class="text-lg">List 1</div>
        <Draggable :list="list" :enabled="enabled" group="perople" v-bind="$attrs" />
      </div>
      <div>
        <div class="text-lg">List 2</div>
        <Draggable :list="list2" :enabled="enabled" group="perople" v-bind="$attrs" />
      </div>
      <div>
        <div class="text-lg">List 3</div>
        <Draggable :list="list3" :enabled="enabled" group="perople" v-bind="$attrs" />
      </div>
      <div>
        <div class="text-lg">List 4</div>
        <Draggable :list="list4" :enabled="enabled" group="perople" v-bind="$attrs" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import Draggable from 'src/components/App/Draggable.vue';
let id = 1;
const list = ref([
  { name: 'John', id: 0 },
  { name: 'Joao', id: 1 },
  { name: 'Jean', id: 2 },
]);
const list2 = ref([
  { name: 'John', id: 4 },
  { name: 'Joao', id: 5 },
  { name: 'Jean', id: 6 },
]);
const list3 = ref([
  { name: 'John', id: 7 },
  { name: 'Joao', id: 8 },
  { name: 'Jean', id: 9 },
]);
const list4 = ref([
  { name: 'John', id: 10 },
  { name: 'Joao', id: 11 },
  { name: 'Jean', id: 12 },
]);
const enabled = ref(true);
</script>
<style scoped lang="scss">
.buttons {
  margin-top: 35px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.not-draggable {
  cursor: no-drop;
}
.board-grid {
  &__column {
    &__item {
      color: red;
      &:first-child {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
      }
    }
  }
}
</style>
