import { describe, it, expect } from 'vitest'
import ENDPOINTS from '../src/api/endpoints'

describe('API endpoints', () => {
  it('has auth endpoints defined with trailing slashes for Django DRF', () => {
    expect(ENDPOINTS.AUTH.LOGIN).toBe('/auth/login/')
    expect(ENDPOINTS.AUTH.REGISTER).toBe('/auth/register/')
    expect(ENDPOINTS.AUTH.ME).toBe('/auth/me/')
    expect(ENDPOINTS.AUTH.REFRESH).toBe('/auth/token/refresh/')
  })

  it('has profile endpoints defined', () => {
    expect(ENDPOINTS.STUDENTS.PROFILE).toBe('/students/profile/')
    expect(ENDPOINTS.COMPANIES.PROFILE).toBe('/companies/profile/')
    expect(ENDPOINTS.INSTITUTES.PROFILE).toBe('/institutes/profile/')
  })
})
