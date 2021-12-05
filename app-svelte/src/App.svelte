<script lang="ts">
  import { Router } from 'svelte-navigator';
  import Navbar from './components/app/navbar.svelte';
  import { refreshUser } from './utils/authState';
  import Wrap from './Wrap.svelte';

  export let url = '';

  const { isAuth } = refreshUser();
</script>

<main>
  {#if !$isAuth}
    <Navbar />
  {/if}

  <Router {url}>
    <Wrap />
  </Router>
</main>
