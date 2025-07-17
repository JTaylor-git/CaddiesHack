<script>
  import { onMount } from 'svelte';
  import { initPlanner } from '$lib/legacy/2dplanner';
  import { apiKeys } from '$lib/stores/apiKeys';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let container;
  export let dataMode = 'distance';
  export let courseData = null;
  export let wind = null;

  let map;
  let windMarker;

  function loadMap() {
    let keys;
    const unsub = apiKeys.subscribe((k) => (keys = k));
    unsub();
    map = initPlanner(container, dataMode, courseData, keys);
  }

  onMount(() => {
    if (courseData) loadMap();
  });

  $: if (container && courseData && dataMode) {
    loadMap();
  }

  $: if (map && wind && courseData) {
    if (windMarker) {
      map.removeLayer(windMarker);
    }
    const arrowHtml = `\n      <div style="\n        transform: rotate(${wind.deg}deg);\n        font-size: 24px;\n        color: red;\n        text-shadow: 0 0 2px #000;\n      ">\u2191</div>`;

    const icon = L.divIcon({
      html: arrowHtml,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const [lon, lat] = courseData.centroid;
    windMarker = L.marker([lat, lon], {
      icon,
      interactive: false
    }).addTo(map);
  }
</script>

<div bind:this={container} class="map2d"></div>
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
    initPlanner(container, dataMode, courseData, keys);
  });
</script>

<div bind:this={container} class="map2d">
  Loading map... ({dataMode})
  {#if wind}
    <div class="wind" style="transform: rotate({wind.deg}deg);">↑</div>
  {/if}
</div>
  let container;

  export let dataMode = 'distance';
  onMount(() => {
    initPlanner(container, dataMode);
  });
</script>

<div bind:this={container} class="map2d">Loading map... ({dataMode})</div>

  onMount(() => {
    initPlanner(container);
  });
</script>

<div bind:this={container} class="map2d">Loading map...</div>

<style>
.map2d {
  width: 100%;
  height: 400px;
  position: relative;
}
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
