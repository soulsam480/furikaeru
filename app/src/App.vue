<script setup lang="ts">
import Navbar from 'src/components/App/Navbar.vue';
import { authState } from 'src/utils/authState';
import { registerToken } from 'src/utils/helpers';

authState();
registerToken();
</script>
<template>
  <div>
    <Navbar />
    <div class="max-w-7xl mx-auto p-2">
      <router-view />
    </div>
  </div>
</template>
