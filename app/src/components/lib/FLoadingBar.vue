<script setup lang="ts">
import { ref } from 'vue';

defineExpose({
  start,
  stop,
});

const progress = ref(5);
const bar = ref<HTMLDivElement | null>(null);
let timer: any;

function start(inc = 5) {
  timer = setInterval(() => {
    progress.value += inc;
    (bar.value as HTMLDivElement).style.width = `${progress.value}%`;
  }, 1000);
}

function stop() {
  (bar.value as HTMLDivElement).style.width = `100%`;
  progress.value = 5;

  clearInterval(timer);
}
</script>
<template>
  <div class="h-1 absolute w-full overflow-hidden">
    <div ref="bar" class="h-full bg-cyan-500 relative w-0 transition-all duration-300 ease-in-out"></div>
  </div>
</template>
