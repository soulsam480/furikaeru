<script>
  import { useNavigate, useLocation } from 'svelte-navigator';
  import { useUserStore } from 'src/store/user';

  const { isLoggedIn } = useUserStore();

  const navigate = useNavigate();
  const location = useLocation();

  $: if (!$isLoggedIn) {
    navigate('/', {
      state: { from: $location.pathname },
    });
  }
</script>

{#if $isLoggedIn}
  <slot />
{/if}
