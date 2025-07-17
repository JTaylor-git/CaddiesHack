<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { initPlanner } from '$lib/legacy/2dplanner.js';
  import { apiKeys } from '$lib/stores/apiKeys.js';

  let container;
  export let dataMode = 'distance';
  export let courseData = null;
  export let wind = null;

  let map;
  let windMarker;

  onMount(() => {
    // grab keys once
    let keys;
    const unsub = apiKeys.subscribe((k) => (keys = k));
    unsub();
    map = initPlanner(container, dataMode, courseData, keys);
  });

  $: if (map && wind && courseData) {
    if (windMarker) {
      map.removeLayer(windMarker);
    }

    const arrowHtml = `
      <div style="
        transform: rotate(${wind.deg}deg);
        font-size: 24px;
        color: red;
        text-shadow: 0 0 2px #000;
      ">
        &#8593;
      </div>`;

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

<style>
  .map2d { width: 100%; height: 400px; }
</style>
