<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ submit: [title: string] }>()
const props = defineProps<{ loading: boolean; error: string | null }>()

const title = ref('')

function handleSubmit() {
  emit('submit', title.value)
  if (!props.error) title.value = ''
}
</script>

<template>
  <form class="add-form" @submit.prevent="handleSubmit">
    <div class="input-wrap">
      <input
        v-model="title"
        type="text"
        placeholder="Enter task title..."
        :disabled="loading"
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Adding…' : 'Add Task' }}
      </button>
    </div>
    <p v-if="error" class="field-error">{{ error }}</p>
  </form>
</template>
