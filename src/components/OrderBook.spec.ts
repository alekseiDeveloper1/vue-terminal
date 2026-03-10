import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderBook from './OrderBook.vue'

// 1. Мокаем чарт
const mockSeries = {
  update: vi.fn(),
  setData: vi.fn(),
}

const mockChart = {
  addSeries: vi.fn(() => mockSeries),
  remove: vi.fn(),
  applyOptions: vi.fn(),
  timeScale: vi.fn(() => ({
    scrollToRealTime: vi.fn(),
  })),
}

vi.mock('lightweight-charts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lightweight-charts')>()
  return {
    ...actual,
    createChart: vi.fn(() => mockChart),
  }
})

// 2. Реализуем полный класс для Worker
class MockWorker implements Worker {
  onmessage: ((this: Worker, ev: MessageEvent) => void) | null = null
  onmessageerror: null = null
  onerror: null = null
  postMessage = vi.fn()
  terminate = vi.fn()
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  dispatchEvent = vi.fn(() => true)
}

const mockWorkerInstance = new MockWorker()

// 3. Используем ОБЫЧНУЮ функцию (не стрелочную!), чтобы она работала как конструктор
const MockWorkerConstructor = vi.fn(function (this: Worker) {
  return mockWorkerInstance
})

Object.defineProperty(globalThis, 'Worker', {
  value: MockWorkerConstructor,
  writable: true,
})

Object.defineProperty(globalThis, 'ResizeObserver', {
  value: class implements ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  },
  writable: true,
})

describe('OrderBook.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWorkerInstance.onmessage = null
  })

  it('инициализирует воркер и обновляет серию данных', async () => {
    const wrapper = mount(OrderBook)

    expect(MockWorkerConstructor).toHaveBeenCalled()
    expect(wrapper.find('.chart-holder').exists()).toBe(true)

    const mockCandle = {
      time: 1625097600,
      open: 60000,
      high: 61000,
      low: 59000,
      close: 60500,
    }

    if (mockWorkerInstance.onmessage) {
      mockWorkerInstance.onmessage.call(mockWorkerInstance, {
        data: mockCandle,
      } as MessageEvent)
    }

    expect(mockSeries.update).toHaveBeenCalledWith(mockCandle)
  })

  it('завершает работу воркера при размонтировании', () => {
    const wrapper = mount(OrderBook)
    wrapper.unmount()

    expect(mockWorkerInstance.terminate).toHaveBeenCalled()
    expect(mockChart.remove).toHaveBeenCalled()
  })
})
