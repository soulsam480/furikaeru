<script lang="ts">
export default {
  name: 'FIcon',
};
</script>

<script setup lang="ts">
defineProps({
  size: String,
  icon: String,
});
</script>
<template>
  <span v-bind="$attrs">
    <i
      :style="{ fontSize: size || '20px', verticalAlign: '-0.25em' }"
      class="iconify"
      :data-icon="icon"
      :data-inline="true"
    />
  </span>
</template>
