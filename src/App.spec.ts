import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi } from 'vitest'
import App from './App.vue'
import { nextTick } from 'vue'

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

const globalAny = globalThis as any;
globalAny.ResizeObserver = class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};

globalAny.Worker = class {
  onmessage = vi.fn();
  postMessage = vi.fn();
  terminate = vi.fn();
} as any;

// 2. Мокаем библиотеку графиков с сохранением ColorType
vi.mock('lightweight-charts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lightweight-charts')>();
  return {
    ...actual,
    createChart: vi.fn(() => ({
      addSeries: vi.fn(() => ({
        setData: vi.fn(),
        update: vi.fn(),
      })),
      remove: vi.fn(),
      applyOptions: vi.fn(),
      timeScale: vi.fn(() => ({
        fitContent: vi.fn(),
        scrollToRealTime: vi.fn(),
      })),
    })),
  };
});

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
    });

    await nextTick();
    await nextTick();

    const container = wrapper.find('.chart-holder');

    expect(container.exists()).toBe(true);
  });
});
