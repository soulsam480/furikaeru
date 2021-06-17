<script setup lang="ts">
import { useUser } from 'src/store/user';
import { createAuthWs } from 'src/utils/createWs';

const { isLoggedIn } = useUser();

const io = createAuthWs();
io.emit('ping');
</script>
<template>
  <div>user is {{ isLoggedIn }}.</div>
  <div>wefj</div>
</template>
