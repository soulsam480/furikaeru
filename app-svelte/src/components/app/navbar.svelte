<script lang="ts">
  import { useUserStore } from 'src/store/user';

  import { link } from 'svelte-navigator';

  const { isLoggedIn, getUser } = useUserStore();
</script>

<nav class="navbar bg-neutral text-neutral-content shadow-sm min-h-12 sticky top-0 z-100">
  <div class="flex max-w-7xl mx-auto w-full items-center justify-between">
    <div class="px-2 mx-2">
      <span class="text-lg font-bold">Furikaeru</span>
    </div>

    <div class="flex-none flex">
      {#if !$isLoggedIn}
        <a class="btn btn-primary btn-sm" href="/login" use:link>Login</a>
      {:else}
        <button class="btn btn-primary btn-sm">{$getUser.name}</button>
      {/if}
    </div>
  </div>
</nav>
