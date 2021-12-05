<script lang="ts">
  import { useUserStore } from 'src/store/user';

  const { isLoggedIn } = useUserStore();
</script>

<div>
  <div>{$isLoggedIn}</div>
</div>

<style>
</style>
