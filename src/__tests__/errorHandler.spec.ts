import { describe, it, expect } from 'vitest'
import { getErrorMessage } from '../utils/errorHandler'

describe('getErrorMessage', () => {
  it('returns message for 400', () => {
    expect(getErrorMessage(400, 'fallback')).toBe('Invalid request. Please check your input.')
  })

  it('returns message for 404', () => {
    expect(getErrorMessage(404, 'fallback')).toBe('Task not found.')
  })

  it('returns fallback for unknown status', () => {
    expect(getErrorMessage(500, 'Server error')).toBe('Server error')
  })
})
