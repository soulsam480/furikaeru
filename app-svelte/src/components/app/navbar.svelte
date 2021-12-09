<script lang="ts">
  import { useUserStore } from 'src/store/user';
  import { link } from 'svelte-navigator';
  import SvBtn from '../lib/SVBtn.svelte';

  const { isLoggedIn, getUser } = useUserStore();
</script>

<nav class="navbar bg-neutral text-neutral-content shadow-sm min-h-12 sticky top-0 z-100">
  <div class="flex max-w-7xl mx-auto w-full items-center justify-between">
    <div class="px-2 flex items-center">
      <img src="/icon-48.png" alt="Furikaeru logo" class="sm:block hidden mr-1" style="width: 30px" />

      <span class="text-lg font-bold">Furikaeru</span>
    </div>

    <div class="flex-none flex">
      {#if !$isLoggedIn}
        <a class="btn btn-primary btn-sm" href="/" use:link>Login</a>
      {:else}
        <SvBtn color="primary" sm>{$getUser.name}</SvBtn>
      {/if}
    </div>
  </div>
</nav>
