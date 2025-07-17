<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  let carry = 200;
  let roll = 20;
  let dispersion = 15;
  let canvas;
  let chart;
  onMount(() => {
    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Carry', 'Roll'],
        datasets: [{
          data: [carry, roll],
          backgroundColor: ['#4caf50', '#2196f3']
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        }
      }
    });
  });
</script>

<h1>Profile</h1>
<form on:submit|preventDefault={() => chart.update()}>
  <label>Carry <input type="number" bind:value={carry}></label>
  <label>Roll <input type="number" bind:value={roll}></label>
  <label>Dispersion <input type="number" bind:value={dispersion}></label>
  <button type="submit">Update</button>
</form>
<canvas bind:this={canvas} width="400" height="200"></canvas>
<p>Dispersion: {dispersion} yds</p>
