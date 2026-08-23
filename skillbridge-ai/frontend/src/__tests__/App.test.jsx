import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { store } from '../app/store'
import router from '../routes'

describe('App', () => {
  it('renders SkillBridge AI heading', () => {
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )
    expect(screen.getAllByText(/SkillBridge AI/i).length).toBeGreaterThan(0)
  })
})
