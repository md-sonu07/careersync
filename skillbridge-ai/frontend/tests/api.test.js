import { describe, it, expect } from 'vitest'
import ENDPOINTS from '../src/api/endpoints'

describe('API endpoints', () => {
  it('has auth endpoints defined', () => {
    expect(ENDPOINTS.AUTH.LOGIN).toBe('/auth/login')
    expect(ENDPOINTS.AUTH.REGISTER).toBe('/auth/register')
  })
})
