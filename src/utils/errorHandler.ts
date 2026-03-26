export function getErrorMessage(status: number, fallback: string): string {
  if (status === 400) return 'Invalid request. Please check your input.'
  if (status === 404) return 'Task not found.'
  return fallback
}
