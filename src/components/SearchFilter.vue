<script setup lang="ts">
import type { CompletedFilter } from '../types/task'

const props = defineProps<{ search: string; filter: CompletedFilter }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:filter': [value: CompletedFilter]
}>()
</script>

<template>
  <div class="filter-bar">
    <input
      :value="props.search"
      type="text"
      class="search-input"
      placeholder="Search tasks..."
      @input="emit('update:search', ($event.target as HTMLInputElement).value)"
    />
    <div class="filter-btns">
      <button
        v-for="opt in ([['all', 'All'], ['false', 'Pending'], ['true', 'Completed']] as [CompletedFilter, string][])"
        :key="opt[0]"
        :class="['filter-btn', { active: props.filter === opt[0] }]"
        @click="emit('update:filter', opt[0])"
      >
        {{ opt[1] }}
      </button>
    </div>
  </div>
</template>
