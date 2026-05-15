import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Lightbox from './Lightbox'

describe('Lightbox', () => {
  it('renders the image with alt text', () => {
    render(<Lightbox src="/test.jpg" alt="Test image" onClose={() => {}} />)
    expect(screen.getByRole('img', { name: 'Test image' })).toBeInTheDocument()
  })

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<Lightbox src="/test.jpg" alt="Test" onClose={onClose} />)
    await user.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<Lightbox src="/test.jpg" alt="Test" onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
