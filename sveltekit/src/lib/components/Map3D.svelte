<script>
  import { onMount } from 'svelte';
  import { init3D } from '$lib/legacy/3dplanner';
  let container;
  export let dataMode = 'distance';
  export let courseData = null;
  onMount(() => {
    let keys;
    apiKeys.subscribe(k => (keys = k))();
    init3D(container, dataMode, courseData, keys);
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
}
</style>
