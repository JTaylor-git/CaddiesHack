<script>
  import KeyModal from '$lib/components/KeyModal.svelte';
  import { apiKeys } from '$lib/stores/apiKeys';
  import { onMount } from 'svelte';
  let modalOpen = false;
  onMount(() => {
    let keys;
    apiKeys.subscribe(k => (keys = k))();
    if (!keys.mapbox || !keys.openweather || !keys.esri) {
      modalOpen = true;
    }
  });
</script>

<slot />
<KeyModal bind:open={modalOpen} />
</script>

<slot />
<KeyModal />
