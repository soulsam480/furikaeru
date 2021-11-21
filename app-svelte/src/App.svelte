<script lang="ts">
  import { Route, Router } from 'svelte-routing';
  import Navbar from './components/app/navbar.svelte';
  import Landing from './views/Landing.svelte';

  export let url = '';
</script>

<main>
  <Navbar />
  <Router {url}>
    <div>
      <Route path="/" component={Landing} />
    </div>
  </Router>
</main>

<style>
</style>
