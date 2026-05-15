import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ContentList from './ContentList'

const items = [
  { slug: 'alpha', title: 'Alpha', date: '2024-03-01', href: '/poetry/alpha' },
  { slug: 'beta', title: 'Beta', date: '2024-01-01', href: '/poetry/beta' },
  { slug: 'gamma', title: 'Gamma', date: '2024-06-01', href: '/poetry/gamma' },
]

describe('ContentList', () => {
  it('renders all items', () => {
    render(<MemoryRouter><ContentList items={items} /></MemoryRouter>)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('each item is a link to its href', () => {
    render(<MemoryRouter><ContentList items={items} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /alpha/i })).toHaveAttribute('href', '/poetry/alpha')
  })

  it('sorts by date descending by default', () => {
    render(<MemoryRouter><ContentList items={items} /></MemoryRouter>)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveTextContent('Gamma')
    expect(links[1]).toHaveTextContent('Alpha')
    expect(links[2]).toHaveTextContent('Beta')
  })
})
