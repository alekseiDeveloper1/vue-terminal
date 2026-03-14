import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Trade from './Trade.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('Trade.vue', () => {
  setActivePinia(createPinia())
  it('renders the component', () => {
    const wrapper = mount(Trade)
    expect(wrapper.find('h2').text()).toBe('Place a Test Order')
  })
})
