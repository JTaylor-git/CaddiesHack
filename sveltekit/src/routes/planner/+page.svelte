<script>
  import { onMount } from 'svelte';
  import Map2D from '$lib/components/Map2D.svelte';
  import Map3D from '$lib/components/Map3D.svelte';
  import Drawer from '$lib/components/Drawer.svelte';
  import { apiKeys } from '$lib/stores/apiKeys.js';

  let viewMode = '2d';
  let dataMode = 'distance';
  let drawerOpen = false;
  let courseId = '';
  let courseData = null;
  let weather = null;

  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    courseId = params.get('course') || 'course1';
    await loadCourse();
    await fetchWeather();
  });

  async function loadCourse() {
    const res = await fetch(`/courses/${courseId}.json`);
    if (res.ok) courseData = await res.json();
  }

  async function fetchWeather() {
    let key;
    const unsub = apiKeys.subscribe(k => (key = k.openweather));
    unsub();
    if (!key || !courseData) return;
    const [lon, lat] = courseData.centroid;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
    );
    if (res.ok) weather = await res.json();
  }
</script>

<h1>Planner</h1>

<div class="toolbar">
  <button on:click={() => (viewMode = '2d')} class:active={viewMode === '2d'}>2D</button>
  <button on:click={() => (viewMode = '3d')} class:active={viewMode === '3d'}>3D</button>
  <button on:click={() => (dataMode = 'distance')} class:active={dataMode === 'distance'}>Distance</button>
  <button on:click={() => (dataMode = 'dispersion')} class:active={dataMode === 'dispersion'}>Dispersion</button>
  <button on:click={() => (drawerOpen = !drawerOpen)}>Holes ▸</button>
</div>

{#if viewMode === '2d'}
  <Map2D {dataMode} {courseData} wind={weather?.wind ?? null} />
{:else}
  <Map3D {dataMode} {courseData} />
{/if}

<Drawer {open}>
  {#if courseData}
    <h2>{courseData.name}</h2>
    <ul>
      {#each Array(courseData.holes) as _, i}
        <li>Hole {i + 1}</li>
      {/each}
    </ul>
    {#if weather}
      <p>Wind: {weather.wind.speed} m/s</p>
    {/if}
  {/if}
</Drawer>

<style>
  .toolbar button {
    margin-right: 0.5rem;
  }
  .toolbar button.active {
    font-weight: bold;
  }
</style>
