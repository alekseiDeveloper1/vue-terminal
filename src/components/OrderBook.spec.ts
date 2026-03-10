import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import OrderBook from './OrderBook.vue';

const mockSeries = {
  update: vi.fn(),
  setData: vi.fn(),
};

const mockChart = {
  addSeries: vi.fn(() => mockSeries),
  remove: vi.fn(),
  applyOptions: vi.fn(),
  timeScale: vi.fn(() => ({
    scrollToRealTime: vi.fn(),
  })),
};

vi.mock('lightweight-charts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lightweight-charts')>();
  return {
    ...actual,
    createChart: vi.fn(() => mockChart),
  };
});

const mockWorkerInstance = {
  terminate: vi.fn(),
  onmessage: null as any,
  postMessage: vi.fn(),
};

const MockWorkerClass = vi.fn(function() {
  return mockWorkerInstance;
});

globalThis.Worker = MockWorkerClass as any;
globalThis.ResizeObserver = class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as any;

describe('OrderBook.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('инициализирует воркер и обновляет серию данных', async () => {
    const wrapper = mount(OrderBook);

    expect(MockWorkerClass).toHaveBeenCalled();
    expect(wrapper.find('.chart-holder').exists()).toBe(true);

    const mockCandle = {
      time: 1625097600,
      open: 60000,
      high: 61000,
      low: 59000,
      close: 60500
    };

    if (mockWorkerInstance.onmessage) {
      mockWorkerInstance.onmessage({ data: mockCandle } as MessageEvent);
    }

    expect(mockSeries.update).toHaveBeenCalledWith(mockCandle);
  });

  it('завершает работу воркера при размонтировании', () => {
    const wrapper = mount(OrderBook);
    wrapper.unmount();
    expect(mockWorkerInstance.terminate).toHaveBeenCalled();
    expect(mockChart.remove).toHaveBeenCalled();
  });
});
