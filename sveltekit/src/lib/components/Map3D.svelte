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

<style>
.map3d {
  width: 100%;
  height: 400px;
}
</style>
