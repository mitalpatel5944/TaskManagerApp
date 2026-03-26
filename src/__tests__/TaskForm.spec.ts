import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskForm from '../components/TaskForm.vue'

describe('TaskForm', () => {
  it('renders input and submit button', () => {
    const wrapper = mount(TaskForm, { props: { loading: false, error: null } })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows Add Task when not loading', () => {
    const wrapper = mount(TaskForm, { props: { loading: false, error: null } })
    expect(wrapper.find('button[type="submit"]').text()).toBe('Add Task')
  })

  it('shows Adding… and disables button when loading', () => {
    const wrapper = mount(TaskForm, { props: { loading: true, error: null } })
    expect(wrapper.find('button[type="submit"]').text()).toBe('Adding…')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('displays error message when error prop is set', () => {
    const wrapper = mount(TaskForm, { props: { loading: false, error: 'Title is required' } })
    expect(wrapper.find('.field-error').text()).toBe('Title is required')
  })

  it('hides error message when error is null', () => {
    const wrapper = mount(TaskForm, { props: { loading: false, error: null } })
    expect(wrapper.find('.field-error').exists()).toBe(false)
  })

  it('emits submit with input value on form submit', async () => {
    const wrapper = mount(TaskForm, { props: { loading: false, error: null } })
    await wrapper.find('input').setValue('New Task')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')?.[0]).toEqual(['New Task'])
  })
})
