<script setup lang="ts">
import moment from 'moment'
import type { Task } from '../types/task'

defineProps<{ task: Task }>()
const emit = defineEmits<{
  toggle: [task: Task]
  delete: [id: number]
}>()
</script>

<template>
  <li class="task-item">
    <label class="task-main">
      <input
        v-if="!task.completed"
        type="checkbox"
        @change="emit('toggle', task)"
      />
      <div class="column">
        <span class="task-title">{{ task.title }}</span>
        <span class="due">{{ moment(task.created_at).format('MMM D, YYYY') }}</span>
      </div>
    </label>

    <div class="task-meta">
      <span class="badge" :class="task.completed ? 'completed' : 'pending'">
        {{ task.completed ? 'Completed' : 'Pending' }}
      </span>
      <button class="delete-btn" @click="emit('delete', task.id)">Delete</button>
    </div>
  </li>
</template>
