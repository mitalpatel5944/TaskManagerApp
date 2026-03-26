export type Task = {
  id: number
  title: string
  completed: string
  created_at: string
}

export type CompletedFilter = 'all' | 'true' | 'false'
