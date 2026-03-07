import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from './App.vue'

describe('App.vue', () => {
  it('renders a chart', () => {
    const wrapper = mount(App)
    expect(wrapper.find('div').exists()).toBe(true)
  })
})
