<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { createChart, ColorType, CandlestickSeries, type IChartApi, type ISeriesApi } from 'lightweight-charts';

const chartContainer = ref<HTMLElement | null>(null);
let chart: IChartApi | null = null;
let series: ISeriesApi<"Candlestick"> | null = null;
let worker: Worker | null = null;

onMounted(() => {
  if (!chartContainer.value) return;

  chart = createChart(chartContainer.value, {
    layout: {
      textColor: 'black',
      background: { type: ColorType.Solid, color: 'white' },
    },
    height: 400,
    timeScale: {
      timeVisible: true,
      secondsVisible: true,
    }
  });

  series = chart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
  });

  worker = new Worker(new URL('../workers/socket.worker.ts', import.meta.url), {
    type: 'module'
  });

  worker.onmessage = (event) => {
    const candleData = event.data;
    if (series) {
      series.update(candleData);
    }
  };

  const resizeObserver = new ResizeObserver(entries => {
    if (chart && entries[0]?.contentRect) {
      chart.applyOptions({ width: entries[0]?.contentRect.width });
    }
  });
  resizeObserver.observe(chartContainer.value);
});

const scrollToRealTime = () => {
  chart?.timeScale().scrollToRealTime();
};

onUnmounted(() => {
  worker?.terminate();
  chart?.remove();
});
</script>

<template>
  <div class="wrapper">
    <div class="buttons-container">
      <button @click="scrollToRealTime">Go to realtime</button>
    </div>
    <div ref="chartContainer" class="chart-holder"></div>
  </div>
</template>

<style scoped>
.wrapper { font-family: sans-serif; }
.chart-holder { width: 100%; height: 400px; margin-top: 10px; }

.buttons-container {
  display: flex;
  gap: 8px;
}
.buttons-container button {
  font-size: 16px;
  padding: 8px 24px;
  color: #131722;
  background-color: #f0f3fa;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.buttons-container button:hover { background-color: #e0e3eb; }
</style>
