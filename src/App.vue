<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createChart } from 'lightweight-charts'
import { useChartStore } from './stores/chart'
import { io } from "socket.io-client"

const chartContainer = ref(null)
const chartStore = useChartStore()

let lineSeries

onMounted(() => {
  if (chartContainer.value) {
    const chart = createChart(chartContainer.value)
    lineSeries = chart.addLineSeries()
    chartStore.setChartData([
      { time: '2019-04-11', value: 80.01 },
      { time: '2019-04-12', value: 96.63 },
      { time: '2019-04-13', value: 76.64 },
      { time: '2019-04-14', value: 81.89 },
      { time: '2019-04-15', value: 74.43 },
      { time: '2019-04-16', value: 80.01 },
      { time: '2019-04-17', value: 96.63 },
      { time: '2019-04-18', value: 76.64 },
      { time: '2019-04-19', value: 81.89 },
      { time: '2019-04-20', value: 74.43 },
    ])
    lineSeries.setData(chartStore.chartData)
  }

  const socket = io("http://localhost:3000");

  socket.on("chartData", (data) => {
    chartStore.setChartData([...chartStore.chartData, data])
    lineSeries.update(data)
  });

})
</script>

<template>
  <div ref="chartContainer" style="width: 100%; height: 500px"></div>
</template>

<style scoped>
</style>
