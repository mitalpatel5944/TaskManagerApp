import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskItem from '../components/TaskItem.vue'
import type { Task } from '../types/task'

const pendingTask: Task = { id: 1, title: 'Buy milk', completed: '', created_at: '2024-01-15T00:00:00Z' }
const completedTask: Task = { id: 2, title: 'Read book', completed: 'completed', created_at: '2024-01-16T00:00:00Z' }

describe('TaskItem', () => {
  it('renders task title', () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })
    expect(wrapper.text()).toContain('Buy milk')
  })

  it('shows Pending badge for incomplete task', () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })
    expect(wrapper.find('.badge').text()).toBe('Pending')
    expect(wrapper.find('.badge').classes()).toContain('pending')
  })

  it('shows Completed badge for completed task', () => {
    const wrapper = mount(TaskItem, { props: { task: completedTask } })
    expect(wrapper.find('.badge').text()).toBe('Completed')
    expect(wrapper.find('.badge').classes()).toContain('completed')
  })

  it('shows checkbox only for pending task', () => {
    const pendingWrapper = mount(TaskItem, { props: { task: pendingTask } })
    const completedWrapper = mount(TaskItem, { props: { task: completedTask } })
    expect(pendingWrapper.find('input[type="checkbox"]').exists()).toBe(true)
    expect(completedWrapper.find('input[type="checkbox"]').exists()).toBe(false)
  })

  it('emits toggle when checkbox changes', async () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(wrapper.emitted('toggle')?.[0]).toEqual([pendingTask])
  })

  it('emits delete when Delete button clicked', async () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })
    await wrapper.find('.delete-btn').trigger('click')
    expect(wrapper.emitted('delete')?.[0]).toEqual([1])
  })

  it('formats created_at date', () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })
    expect(wrapper.find('.due').text()).toBe('Jan 15, 2024')
  })
})
