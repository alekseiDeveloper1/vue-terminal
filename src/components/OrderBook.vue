<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, ref } from 'vue';
import * as LightweightCharts from 'lightweight-charts';
import { type IChartApi, LineSeries } from 'lightweight-charts';

const orderBookData = shallowRef<any[]>([]);
const chartContainer = ref<HTMLElement | null>(null);
let chart: IChartApi | null = null;
let worker: Worker | null = null;

onMounted(() => {
  worker = new Worker(new URL('../workers/socket.worker.ts', import.meta.url), {
    type: 'module',
  });

  worker.onmessage = (event) => {
    orderBookData.value = [...orderBookData.value, ...event.data];
    if (orderBookData.value.length > 1000) {
      orderBookData.value = orderBookData.value.slice(-1000);
    }
  };

  if (chartContainer.value) {
    chart = LightweightCharts.createChart(chartContainer.value, {
      width: chartContainer.value.clientWidth,
      height: 300,
      layout: {
        background: { color: '#f0f0f0' },
        textColor: '#333',
      },
      grid: {
        vertLines: {
          color: '#e0e0e0',
        },
        horzLines: {
          color: '#e0e0e0',
        },
      },
    });
    
    const lineSeries = chart.addSeries(LineSeries);
    lineSeries.setData([
        { time: '2019-04-11', value: 80.01 },
        { time: '2019-04-12', value: 96.63 },
        { time: '2019-04-13', value: 76.64 },
    ]);
  }
});

onUnmounted(() => {
  if (worker) {
    worker.terminate();
  }
  if (chart) {
    chart.remove();
  }
});
</script>

<template>
  <div>
    <h2>Order Book (Real-Time via WebWorker)</h2>
    <div ref="chartContainer" class="chart-container"></div>
    <pre class="data-dump">{{ orderBookData.length }} updates received</pre>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
}
.data-dump {
  margin-top: 1rem;
  background-color: #282c34;
  color: #abb2bf;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.8em;
  border-radius: 4px;
}
</style>
