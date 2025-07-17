<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import annotationPlugin from 'chartjs-plugin-annotation';
  let carry = 200;
  let roll = 20;
  let dispersion = 15;
  let canvas;
  let chart;
  onMount(() => {
    Chart.register(annotationPlugin);
    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Shot'],
        datasets: [
          {
            label: 'Carry',
            data: [carry],
            backgroundColor: '#4caf50',
            stack: 'total'
          },
          {
            label: 'Roll',
            data: [roll],
            backgroundColor: '#2196f3',
            stack: 'total'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { stacked: true },
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: false },
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                xMin: 0,
                xMax: 0,
                yMin: dispersion,
                yMax: dispersion,
                borderColor: 'red',
                borderWidth: 2
              }
            }
          }
        }
      }
    });
  });

  function updateChart() {
    chart.data.datasets[0].data = [carry];
    chart.data.datasets[1].data = [roll];
    chart.options.plugins.annotation.annotations.line1.yMin = dispersion;
    chart.options.plugins.annotation.annotations.line1.yMax = dispersion;
    chart.update();
  }
</script>

<h1>Profile</h1>
<form on:submit|preventDefault={updateChart}>
  <label>Carry <input type="number" bind:value={carry}></label>
  <label>Roll <input type="number" bind:value={roll}></label>
  <label>Dispersion <input type="number" bind:value={dispersion}></label>
  <button type="submit">Update</button>
</form>
<canvas bind:this={canvas} width="400" height="200"></canvas>
<p>Dispersion: {dispersion} yds</p>
