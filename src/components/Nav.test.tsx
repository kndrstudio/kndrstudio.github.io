import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Nav from './Nav'
import '../i18n/index'

function renderNav() {
  return render(<MemoryRouter><Nav /></MemoryRouter>)
}

describe('Nav', () => {
  it('renders all section links', () => {
    renderNav()
    expect(screen.getByRole('link', { name: /art/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /music/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /poetry/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /teaching/i })).toBeInTheDocument()
  })

  it('has a language switcher button', () => {
    renderNav()
    expect(screen.getByRole('button', { name: /ru|en/i })).toBeInTheDocument()
  })
})
