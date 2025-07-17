<script>
  import { onMount } from 'svelte';
  import Map2D from '$lib/components/Map2D.svelte';
  import Map3D from '$lib/components/Map3D.svelte';
  import Drawer from '$lib/components/Drawer.svelte';
  import { apiKeys } from '$lib/stores/apiKeys';

  let viewMode = '2d';
  let dataMode = 'distance';
  let drawerOpen = false;
  let courseId = '';
  let courseData = null;

  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    courseId = params.get('course') || 'course1';
    await loadCourse();
    await fetchWeather();
  });

  async function loadCourse() {
    const res = await fetch(`/courses/${courseId}.json`);
    courseData = await res.json();
  }

  let weather = null;
  async function fetchWeather() {
    let key;
    apiKeys.subscribe(k => key = k.openweather)();
    if (!key) return;
    const { centroid } = courseData || { centroid: [0,0] };
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${centroid[1]}&lon=${centroid[0]}&appid=${key}&units=metric`);
    if (res.ok) weather = await res.json();
  }
</script>

<h1>Planner</h1>
  <div class="toolbar">
    <button on:click={() => viewMode = '2d'} class:active={viewMode==='2d'}>2D</button>
    <button on:click={() => viewMode = '3d'} class:active={viewMode==='3d'}>3D</button>
    <button on:click={() => dataMode = 'distance'} class:active={dataMode==='distance'}>Distance</button>
    <button on:click={() => dataMode = 'dispersion'} class:active={dataMode==='dispersion'}>Dispersion</button>
    <button on:click={() => drawerOpen = !drawerOpen}>Holes ▸</button>
  </div>

{#if viewMode === '2d'}
  <Map2D {dataMode} {courseData} wind={weather ? weather.wind : null} />
{:else}
  <Map3D {dataMode} {courseData} wind={weather ? weather.wind : null} />
  <Map2D {dataMode} {courseData} />
{:else}
  <Map3D {dataMode} {courseData} />
<div class="controls">
  <button on:click={() => viewMode = '2d'} disabled={viewMode==='2d'}>2D</button>
  <button on:click={() => viewMode = '3d'} disabled={viewMode==='3d'}>3D</button>
  <button on:click={() => dataMode = 'distance'} disabled={dataMode==='distance'}>Distance</button>
  <button on:click={() => dataMode = 'dispersion'} disabled={dataMode==='dispersion'}>Dispersion</button>
  <button on:click={() => drawerOpen = !drawerOpen}>Details</button>
</div>

{#if viewMode === '2d'}
  <Map2D {dataMode} />
{:else}
  <Map3D {dataMode} />

{/if}

<Drawer open={drawerOpen}>
  {#if courseData}
    <h2>{courseData.name}</h2>
    <ul>
      {#each Array(courseData.holes) as _, i}
        <li>Hole {i + 1}</li>
      {/each}
    </ul>
    {#if weather}
      <p>Wind: {weather.wind.speed} m/s</p>


      <p>Wind: {weather.wind.speed} m/s 
        <span style="display:inline-block; transform:rotate({weather.wind.deg}deg);">↑</span>
      </p>
    {#if weather}
      <p>Wind: {weather.wind.speed} m/s ↑ <span style="display:inline-block; transform:rotate({weather.wind.deg}deg);">&#8593;</span></p>

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

.controls button {
  margin-right: 0.5rem;
}
</style>



<script>
  import Map2D from '$lib/components/Map2D.svelte';
</script>

<h1>Planner</h1>
<Map2D />


<h1>Planner</h1>


