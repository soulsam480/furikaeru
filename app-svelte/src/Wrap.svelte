<script lang="ts">
  import Home from 'src/views/Home.svelte';
  import Landing from 'src/views/Landing.svelte';
  import { Route, useNavigate } from 'svelte-navigator';
  import { refreshUser } from './utils/authState';
  import PrivateRoute from './components/app/PrivateRoute.svelte';

  const navigate = useNavigate();

  const { auth, isAuth } = refreshUser(navigate);

  auth();
</script>

{#if !$isAuth}
  <div>
    <Route path="/" component={Landing} />

    <PrivateRoute path="/home">
      <Home />
    </PrivateRoute>
  </div>
{/if}
