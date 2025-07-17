<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  let course = null;
  let id = '';
  page.subscribe(p => (id = p.params.id));
  onMount(async () => {
    const res = await fetch(`/courses/${id}.json`);
    if (res.ok) course = await res.json();
  });
</script>

{#if course}
  <h1>{course.name}</h1>
  <p>Holes: {course.holes}</p>
  <a href={`/planner?course=${id}`}>Load in Planner</a>
{:else}
  <p>Loading...</p>
{/if}
<h1>Course Details</h1>
<p>Placeholder for individual course pages.</p>
