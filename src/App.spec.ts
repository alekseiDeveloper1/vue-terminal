import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi } from 'vitest'
import App from './App.vue'
import { nextTick } from "vue";

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

vi.mock('lightweight-charts', () => ({
  createChart: vi.fn(() => ({
    addSeries: vi.fn(() => ({
      setData: vi.fn(),
      update: vi.fn(),
    })),
    applyOptions: vi.fn(),
    remove: vi.fn(),
    timeScale: vi.fn(() => ({
      fitContent: vi.fn(),
    })),
  })),
  LineSeries: {},
}))

describe('App.vue', () => {
  it('renders a chart', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              chart: { chartData: [] }
            },
            stubActions: false,
          })
        ]
      }
    })
    await nextTick()
    await nextTick()

    const container = wrapper.find({ ref: 'chartContainer' })

    expect(container.exists()).toBe(true)
  })
})
