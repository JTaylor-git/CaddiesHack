<script>
  import { onMount } from 'svelte';
  import { init3D } from '$lib/legacy/3dplanner';
  import { apiKeys } from '$lib/stores/apiKeys';

  let container;
  export let dataMode = 'distance';
  export let courseData = null;

  let viewer;

  function loadViewer() {
    let keys;
    const unsub = apiKeys.subscribe((k) => (keys = k));
    unsub();
    viewer = init3D(container, dataMode, courseData, keys);
  }

  onMount(() => {
    if (courseData) loadViewer();
  });

  $: if (container && courseData && dataMode) {
    loadViewer();
  }
</script>

<div bind:this={container} class="map3d"></div>
  let container;
  export let dataMode = 'distance';
  export let courseData = null;
  export let wind = null;
  onMount(() => {
    let keys;
    const unsub = apiKeys.subscribe((k) => (keys = k));
    unsub();
  let container;
  export let dataMode = 'distance';
  export let courseData = null;
  onMount(() => {
    let keys;
    apiKeys.subscribe(k => (keys = k))();
    init3D(container, dataMode, courseData, keys);
  });
</script>

<div bind:this={container} class="map3d">
  Loading 3D map... ({dataMode})
  {#if wind}
    <div class="wind" style="transform: rotate({wind.deg}deg);">↑</div>
  {/if}
</div>
  let container;
  export let dataMode = 'distance';
  onMount(() => {
    init3D(container, dataMode);
  });
</script>

<div bind:this={container} class="map3d">Loading 3D map... ({dataMode})</div>

<style>
.map3d {
  width: 100%;
  height: 400px;
  background: #fee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  position: relative;
}
.wind {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
