import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', {
  state: () => ({
    chartData: [],
  }),
  actions: {
    setChartData(data) {
      this.chartData = data
    },
  },
})
