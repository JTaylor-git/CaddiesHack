<script>
  import { onMount } from 'svelte';
  import { initPlanner } from '$lib/legacy/2dplanner';
  import { apiKeys } from '$lib/stores/apiKeys';
  let container;
  export let dataMode = 'distance';
  export let courseData = null;
  export let wind = null;
  onMount(() => {
    let keys;
    apiKeys.subscribe(k => (keys = k))();
    initPlanner(container, dataMode, courseData, keys);
  });
</script>

<div bind:this={container} class="map2d">
  Loading map... ({dataMode})
  {#if wind}
    <div class="wind" style="transform: rotate({wind.deg}deg);">↑</div>
  {/if}
</div>

<style>
.map2d {
  width: 100%;
  height: 400px;
  background: #eef;
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
