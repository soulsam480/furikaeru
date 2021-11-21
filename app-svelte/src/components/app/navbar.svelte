<script lang="ts">
  import { useUserStore } from 'src/store/user';

  import { link } from 'svelte-routing';

  const { isLoggedIn, getUser } = useUserStore();
</script>

<nav class="navbar bg-neutral text-neutral-content shadow-sm min-h-12 sticky top-0 z-100">
  <div class="w-7xl mx-auto px-2 block">
    <div class="flex items-center justify-between">
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
  </div>
</nav>

<style>
</style>
