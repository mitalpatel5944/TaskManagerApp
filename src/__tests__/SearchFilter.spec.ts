import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchFilter from '../components/SearchFilter.vue'

describe('SearchFilter', () => {
  it('renders search input and 3 filter buttons', () => {
    const wrapper = mount(SearchFilter, { props: { search: '', filter: 'all' } })
    expect(wrapper.find('.search-input').exists()).toBe(true)
    expect(wrapper.findAll('.filter-btn').length).toBe(3)
  })

  it('reflects search prop value in input', () => {
    const wrapper = mount(SearchFilter, { props: { search: 'hello', filter: 'all' } })
    expect((wrapper.find('.search-input').element as HTMLInputElement).value).toBe('hello')
  })

  it('marks active filter button', () => {
    const wrapper = mount(SearchFilter, { props: { search: '', filter: 'true' } })
    const active = wrapper.findAll('.filter-btn').filter(b => b.classes('active'))
    expect(active.length).toBe(1)
    expect(active[0].text()).toBe('Completed')
  })

  it('emits update:search on input', async () => {
    const wrapper = mount(SearchFilter, { props: { search: '', filter: 'all' } })
    await wrapper.find('.search-input').setValue('test')
    await wrapper.find('.search-input').trigger('input')
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['test'])
  })

  it('emits update:filter when Pending clicked', async () => {
    const wrapper = mount(SearchFilter, { props: { search: '', filter: 'all' } })
    const btns = wrapper.findAll('.filter-btn')
    await btns[1].trigger('click') // Pending
    expect(wrapper.emitted('update:filter')?.[0]).toEqual(['false'])
  })

  it('emits update:filter when Completed clicked', async () => {
    const wrapper = mount(SearchFilter, { props: { search: '', filter: 'all' } })
    const btns = wrapper.findAll('.filter-btn')
    await btns[2].trigger('click') // Completed
    expect(wrapper.emitted('update:filter')?.[0]).toEqual(['true'])
  })
})
