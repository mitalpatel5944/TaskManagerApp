const BASE_URL = '/api'

export const API_GET_TASKS = `${BASE_URL}/tasks`
export const API_CREATE_TASK = `${BASE_URL}/tasks`
export const API_UPDATE_TASK = (id) => `${BASE_URL}/tasks/${id}`
