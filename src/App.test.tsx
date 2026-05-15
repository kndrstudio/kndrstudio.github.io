import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import './i18n/index'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  )
}

describe('routing', () => {
  it('renders home at /', () => {
    renderAt('/')
    expect(screen.getByRole('navigation', { name: 'main navigation' })).toBeInTheDocument()
  })

  it('renders art index at /art', () => {
    renderAt('/art')
    expect(screen.getByRole('heading', { name: /art/i })).toBeInTheDocument()
  })

  it('renders music index at /music', () => {
    renderAt('/music')
    expect(screen.getByRole('heading', { name: /music/i })).toBeInTheDocument()
  })

  it('renders poetry index at /poetry', () => {
    renderAt('/poetry')
    expect(screen.getByRole('heading', { name: /poetry/i })).toBeInTheDocument()
  })

  it('renders teaching at /teaching', () => {
    renderAt('/teaching')
    expect(screen.getByRole('heading', { name: /teaching/i })).toBeInTheDocument()
  })
})
