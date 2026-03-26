<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BASE_URL } from './constant.js'
import moment from 'moment'

type Task = {
  id: number
  title: string
  status: string
  created_at: string
}

const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const newTitle = ref('')
const titleError = ref<string | null>(null)
const submitLoader = ref(false)

onMounted(fetchTasks)

async function fetchTasks() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${BASE_URL}/tasks`)
    const response = await res.json()
    console.log('API response:', response)
    if(response.data === undefined) {
error.value = 'Something Went Wrong. Please try again later.'
    }
    tasks.value =  response.data ?? []
  } catch (e: any) {
    error.value = e instanceof Error ? e.message : 'Failed to load tasks'
  } finally {
    loading.value = false
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
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.value.trim() }),
    })
    if (!res.ok)  titleError.value = 'Failed to create task'
    newTitle.value = ''
    await fetchTasks()
  } catch (e: any) {
    titleError.value = e instanceof Error ? e.message : 'Failed to create task'
  } finally {
    submitLoader.value = false
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

      <div v-if="loading" class="state-message">Loading tasks…</div>

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
          <div>
            <span class="task-title">{{ task.title }}</span>
          </div>

          <div class="task-meta">
            <span class="badge" :class="task.status === 'completed' ? 'completed' : 'pending'">
              {{ task.status === 'completed' ? 'Completed' : 'Pending' }}
            </span>
            <span class="due">{{ moment(task.created_at).format('MMM D, YYYY') }}</span>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>
