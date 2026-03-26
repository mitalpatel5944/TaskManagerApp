<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API_GET_TASKS, API_CREATE_TASK, API_UPDATE_TASK } from './constant.js'
import moment from 'moment'
import { getErrorMessage } from './utils/errorHandler'

type Task = {
  id: number
  title: string
  completed: string
  created_at: string
}

const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const newTitle = ref('')
const titleError = ref<string | null>(null)
const submitLoader = ref(false)
const search = ref('')
const completedFilter = ref<'all' | 'true' | 'false'>('all')

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
    console.log('API response:', response)
    if(response.data === undefined) {
      error.value = 'Something Went Wrong. Please try again later.'
    }
    tasks.value = response.data ?? []
  } catch (e: any) {
    error.value = e instanceof Error ? e.message : 'Failed to load tasks'
  } finally {
    loading.value = false
  }
}

function applyFilter(val: 'all' | 'true' | 'false') {
  completedFilter.value = val
  fetchTasks()
}





async function toggleTask(task: Task) {
  const newStatus = !task.completed

  try {
 const res = await fetch(API_UPDATE_TASK(task.id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newStatus }),
    })
    const response = await res.json()
    console.log('Toggle response:', response)
    if (!res.ok) {
      error.value = getErrorMessage(res.status, 'Failed to update task')
      return
    }
    await fetchTasks()
  } catch {
  }
}

async function createTask() {
  titleError.value = null

  if (!newTitle.value.trim()) {
    titleError.value = 'Title is required'
    return
  }

  submitLoader.value = true
  try {
    const res = await fetch(API_CREATE_TASK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.value.trim() }),
    })
    if (!res.ok) { titleError.value = getErrorMessage(res.status, 'Failed to create task'); return }
    newTitle.value = ''
    await fetchTasks()
  } catch (e: any) {
    titleError.value = e instanceof Error ? e.message : 'Failed to create task'
  } finally {
    submitLoader.value = false
  }
}

async function deleteTask(id: number) {
  try {
    const res = await fetch(API_UPDATE_TASK(id), {
      method: 'DELETE',
    })
    if (!res.ok) {
      error.value = getErrorMessage(res.status, 'Failed to delete task')
      return
    }
    await fetchTasks()
  } catch (e: any) {
    error.value = e instanceof Error ? e.message : 'Failed to delete task'
  }
}
</script>

<template>
  <main class="task-page">
    <section class="task-panel" aria-label="Task overview">
      <header class="panel-header">
          <h1>Task List</h1>
      </header>

    
      <form class="add-form" @submit.prevent="createTask">
        <div class="input-wrap">
          <input
            v-model="newTitle"
            type="text"
            placeholder="Enter task title..."
            :disabled="submitLoader"
          />
          <button type="submit" :disabled="submitLoader">
            {{ submitLoader ? 'Adding…' : 'Add Task' }}
          </button>
        </div>
        <p v-if="titleError" class="field-error">{{ titleError }}</p>
      </form>

      <div class="filter-bar">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search tasks..."
          @input="fetchTasks"
        />
        <div class="filter-btns">
          <button :class="['filter-btn', { active: completedFilter === 'all' }]" @click="applyFilter('all')">All</button>
          <button :class="['filter-btn', { active: completedFilter === 'false' }]" @click="applyFilter('false')">Pending</button>
          <button :class="['filter-btn', { active: completedFilter === 'true' }]" @click="applyFilter('true')">Completed</button>
        </div>
      </div>

      <div v-if="loading" class="state-message">
        <span class="spinner"></span>
        Loading tasks…
      </div>

      <div v-else-if="error" class="state-message error">
        {{ error }}
        <button class="retry-btn" @click="fetchTasks">Retry</button>
      </div>

      <ul v-else class="task-list">
        <li
          v-for="task in tasks"
          :key="task.id"
          class="task-item"
        >
          <label class="task-main">
            <input
              v-if="!task.completed"
              type="checkbox"
              @change="toggleTask(task)"
            />
            <div class="column">

            <span class="task-title">{{ task.title }}</span>
            <span class="due">{{ moment(task.created_at).format('MMM D, YYYY') }}</span>
            </div>

          </label>

          <div class="task-meta">
            <span class="badge" :class="task.completed === 'completed' ? 'completed' : 'pending'">
              {{ task.completed ? 'Completed' : 'Pending' }}
            </span>
             <button type="submit" class="delete-btn" @click="deleteTask(task.id)">
            Delete
          </button>

          </div>
        </li>
      </ul>
    </section>
  </main>
</template>
