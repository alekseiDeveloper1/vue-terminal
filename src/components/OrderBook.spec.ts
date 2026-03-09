import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import OrderBook from './OrderBook.vue';

vi.mock('lightweight-charts', () => ({
  createChart: vi.fn(() => ({
    addLineSeries: vi.fn(() => ({
      setData: vi.fn(),
    })),
    remove: vi.fn(),
  })),
}));

global.Worker = vi.fn().mockImplementation(() => ({
  postMessage: vi.fn(),
  onmessage: vi.fn(),
  terminate: vi.fn(),
}));

describe('OrderBook.vue', () => {
  it('renders without crashing and initializes worker and chart', () => {
    const wrapper = shallowMount(OrderBook);

    expect(wrapper.exists()).toBe(true);

    expect(wrapper.find('h2').text()).toContain('Order Book');

    expect(wrapper.find('.chart-container').exists()).toBe(true);

    expect(global.Worker).toHaveBeenCalledWith(expect.any(URL), { type: 'module' });
  });
});
