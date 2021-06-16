<script setup lang="ts">
import { useUser } from 'src/store/user';

const { isLoggedIn } = useUser();
</script>
<template>
  <div>user is {{ isLoggedIn }}.</div>
  <div>wefj</div>
</template>
