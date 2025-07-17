<script>
  import { onMount } from 'svelte';
  import { initPlanner } from '$lib/legacy/2dplanner';
  let container;
  export let dataMode = 'distance';
  onMount(() => {
    initPlanner(container, dataMode);
  });
</script>

<div bind:this={container} class="map2d">Loading map... ({dataMode})</div>

<style>
.map2d {
  width: 100%;
  height: 400px;
  background: #eef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}
</style>
