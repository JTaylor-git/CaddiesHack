
<script>
  import { onMount } from 'svelte';
  let courses = [];
  onMount(async () => {
    const res = await fetch('/courses/list.json');
    courses = await res.json();
  });
</script>

<h1>Courses</h1>
<ul>
  {#each courses as c}
    <li><a href={`/planner?course=${c.id}`}>{c.name}</a></li>
  {/each}
</ul>

<h1>Courses</h1>
<p>Course directory placeholder.</p>
