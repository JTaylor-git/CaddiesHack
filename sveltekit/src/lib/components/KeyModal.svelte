<script>
  import { apiKeys } from '$lib/stores/apiKeys';
  export let open = false;
  let localKeys = { mapbox: '', openweather: '', esri: '' };
  apiKeys.subscribe(k => (localKeys = { ...k }));
  function save() {
    apiKeys.set(localKeys);
    open = false;
  }
</script>

{#if open}
  import { onMount } from 'svelte';
  let localKeys = { mapbox: '', openweather: '', esri: '' };
  let show = false;
  const unsubscribe = apiKeys.subscribe(k => localKeys = { ...k });
  onMount(() => {
    if (!localKeys.mapbox) show = true;
  });
  function save() {
    apiKeys.set(localKeys);
    show = false;
  }
</script>

{#if show}
<div class="modal">
  <div class="dialog">
    <h2>Enter API Keys</h2>
    <label>Mapbox
      <input bind:value={localKeys.mapbox} placeholder="Mapbox key" />
    </label>
    <label>OpenWeatherMap
      <input bind:value={localKeys.openweather} placeholder="OWM key" />
    </label>
    <label>Esri
      <input bind:value={localKeys.esri} placeholder="Esri key" />
    </label>
    <button on:click={save}>Save</button>
  </div>
</div>
{/if}

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog {
  background: white;
  padding: 1rem;
  width: 300px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
