<script>
  import KeyModal from '$lib/components/KeyModal.svelte';
  import { apiKeys } from '$lib/stores/apiKeys';
  import { onMount } from 'svelte';
  let modalOpen = false;
  onMount(() => {
    let keys;
    const unsub = apiKeys.subscribe((k) => (keys = k));
    unsub();
    if (!keys.mapbox || !keys.openweather || !keys.esri || !keys.opentopo) {

    apiKeys.subscribe(k => (keys = k))();
n = true;
    }
  });
</script>

<nav>
  <a href="/">Home</a>
  <a href="/planner">Planner</a>
  <a href="/courses">Courses</a>
  <a href="/profile">Profile</a>
</nav>

<slot />
<KeyModal bind:open={modalOpen} />

<style>
nav {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  background: #eee;
}
</style>

<slot />
<KeyModal bind:open={modalOpen} />
</script>

<slot />
<KeyModal />

