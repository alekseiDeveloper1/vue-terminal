import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi } from 'vitest'
import App from './App.vue'
import { nextTick } from 'vue'
vi.mock('lightweight-charts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lightweight-charts')>()
  return {
    ...actual,
    createChart: vi.fn(() => ({
      addSeries: vi.fn(() => ({
        update: vi.fn(),
        setData: vi.fn(),
        applyOptions: vi.fn(),
      })),
      remove: vi.fn(),
      applyOptions: vi.fn(),
      timeScale: vi.fn(() => ({
        fitContent: vi.fn(),
        scrollToRealTime: vi.fn(),
        getVisibleRange: vi.fn(() => ({ from: 0, to: 0 })),
      })),
      priceScale: vi.fn(() => ({
        applyOptions: vi.fn(),
      })),
    })),
  }
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  },
})

Object.defineProperty(globalThis, 'Worker', {
  writable: true,
  value: class implements Worker {
    onmessage: ((this: Worker, ev: MessageEvent) => void) | null = null
    onmessageerror: ((this: Worker, ev: MessageEvent) => void) | null = null
    onerror: ((this: AbstractWorker, ev: ErrorEvent) => void) | null = null

    postMessage = vi.fn()
    terminate = vi.fn()
    addEventListener = vi.fn()
    removeEventListener = vi.fn()
    dispatchEvent = vi.fn(() => true)
  },
})

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: class implements ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  },
})

describe('App.vue', () => {
  it('renders a chart', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              chart: { chartData: [] },
            },
            stubActions: false,
          }),
        ],
      },
    })

    await nextTick()
    await nextTick()

    const container = wrapper.find('.chart-holder')

    expect(container.exists()).toBe(true)
  })
})
