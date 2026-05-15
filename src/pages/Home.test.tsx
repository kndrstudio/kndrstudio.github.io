import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import '../i18n/index'

describe('Home', () => {
  it('renders the site name', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText('kndrstudio')).toBeInTheDocument()
  })

  it('renders links to all four sections', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /art/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /music/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /poetry/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /teaching/i })).toBeInTheDocument()
  })
})
