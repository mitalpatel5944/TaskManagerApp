<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API_GET_TASKS, API_CREATE_TASK, API_UPDATE_TASK } from './constant.js'
import { getErrorMessage } from './utils/errorHandler'
import TaskItem from './components/TaskItem.vue'
import TaskForm from './components/TaskForm.vue'
import SearchFilter from './components/SearchFilter.vue'
import type { Task, CompletedFilter } from './types/task'

const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const titleError = ref<string | null>(null)
const submitLoader = ref(false)
const search = ref('')
const completedFilter = ref<CompletedFilter>('all')

onMounted(fetchTasks)

async function fetchTasks() {
  loading.value = true
  error.value = null
  try {
    const params = new URLSearchParams()
    if (search.value.trim()) params.set('search', search.value.trim())
    if (completedFilter.value !== 'all') params.set('completed', completedFilter.value)
    const url = params.toString() ? `${API_GET_TASKS}?${params}` : API_GET_TASKS

    const res = await fetch(url)
    const response = await res.json()
    if (response.data === undefined) {
      error.value = 'Something Went Wrong. Please try again later.'
    }
    tasks.value = response.data ?? []
  } catch (e: any) {
    error.value = e instanceof Error ? e.message : 'Failed to load tasks'
  } finally {
    loading.value = false
  }
}

async function createTask(title: string) {
  titleError.value = null
  if (!title.trim()) { titleError.value = 'Title is required'; return }
  submitLoader.value = true
  try {
    const res = await fetch(API_CREATE_TASK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim() }),
    })
    if (!res.ok) { titleError.value = getErrorMessage(res.status, 'Failed to create task'); return }
    await fetchTasks()
  } catch (e: any) {
    titleError.value = e instanceof Error ? e.message : 'Failed to create task'
  } finally {
    submitLoader.value = false
  }
}

async function toggleTask(task: Task) {
  const newStatus = !task.completed
  try {
    const res = await fetch(API_UPDATE_TASK(task.id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newStatus }),
    })
    if (!res.ok) { error.value = getErrorMessage(res.status, 'Failed to update task'); return }
    await fetchTasks()
  } catch {}
}

async function deleteTask(id: number) {
  try {
    const res = await fetch(API_UPDATE_TASK(id), { method: 'DELETE' })
    if (!res.ok) { error.value = getErrorMessage(res.status, 'Failed to delete task'); return }
    await fetchTasks()
  } catch (e: any) {
    error.value = e instanceof Error ? e.message : 'Failed to delete task'
  }
}

function onSearchUpdate(val: string) {
  search.value = val
  fetchTasks()
}

function onFilterUpdate(val: CompletedFilter) {
  completedFilter.value = val
  fetchTasks()
}
</script>

<template>
  <main class="task-page">
    <section class="task-panel" aria-label="Task overview">
      <header class="panel-header">
        <h1>Task List</h1>
      </header>

      <TaskForm :loading="submitLoader" :error="titleError" @submit="createTask" />

      <SearchFilter
        :search="search"
        :filter="completedFilter"
        @update:search="onSearchUpdate"
        @update:filter="onFilterUpdate"
      />

      <div v-if="loading" class="state-message">
        <span class="spinner"></span>
        Loading tasks…
      </div>

      <div v-else-if="error" class="state-message error">
        {{ error }}
        <button class="retry-btn" @click="fetchTasks">Retry</button>
      </div>

      <ul v-else class="task-list">
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @toggle="toggleTask"
          @delete="deleteTask"
        />
      </ul>
    </section>
  </main>
</template>
