import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LineData } from 'lightweight-charts'

export const useChartStore = defineStore('chart', () => {
  const chartData = ref<LineData[]>([])

  function setChartData(data: LineData[]) {
    chartData.value = data
  }

  return { chartData, setChartData }
})
