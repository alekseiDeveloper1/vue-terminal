<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import {
  createChart,
  type ISeriesApi,
  type LineData,
  type Time,
  LineSeries,
} from 'lightweight-charts'
import { useChartStore } from './stores/chart'
import { io } from 'socket.io-client'
import { Socket } from 'socket.io-client'

const chartContainer = ref<HTMLElement | null>(null)
const chartStore = useChartStore()
let lineSeries: ISeriesApi<'Line'>
let chart: ReturnType<typeof createChart>
let socket: Socket

const handleResize = () => {
  if (chartContainer.value && chart) {
    chart.applyOptions({ width: chartContainer.value.clientWidth })
  }
}

onMounted(async () => {
  await nextTick()
  if (chartContainer.value) {
    chart = createChart(chartContainer.value, {
      width: chartContainer.value.clientWidth || 900,
      height: 600,
    })
    lineSeries = chart.addSeries(LineSeries)
    const initialData = [
      { time: 1554940800 as Time, value: 80.01 },
      { time: 1555027200 as Time, value: 96.63 },
      { time: 1555113600 as Time, value: 76.64 },
      { time: 1555200000 as Time, value: 81.89 },
      { time: 1555286400 as Time, value: 74.43 },
      { time: 1555372800 as Time, value: 80.01 },
      { time: 1555459200 as Time, value: 96.63 },
      { time: 1555545600 as Time, value: 76.64 },
      { time: 1555632000 as Time, value: 81.89 },
      { time: 1555718400 as Time, value: 74.43 },
    ].sort((a, b) => (a.time as number) - (b.time as number))
    chartStore.setChartData(initialData)
    lineSeries.setData(chartStore.chartData)
  }

  socket = io('http://localhost:3000')

  socket.on('chartData', (data: LineData) => {
    chartStore.setChartData([...chartStore.chartData, data])
    lineSeries.update(data)
  })
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (socket) socket.disconnect()
  if (chart) chart.remove()
})
</script>

<template>
  <div ref="chartContainer" />
</template>

<style scoped></style>
