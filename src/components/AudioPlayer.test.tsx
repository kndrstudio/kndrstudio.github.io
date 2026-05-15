import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AudioPlayer from './AudioPlayer'
import '../i18n/index'

beforeEach(() => {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  window.HTMLMediaElement.prototype.pause = vi.fn()
  Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', {
    get: () => 180,
    configurable: true,
  })
})

describe('AudioPlayer', () => {
  it('renders the track title', () => {
    render(<AudioPlayer title="Drift" src="test.mp3" />)
    expect(screen.getByText('Drift')).toBeInTheDocument()
  })

  it('renders a play button', () => {
    render(<AudioPlayer title="Drift" src="test.mp3" />)
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
  })

  it('shows pause button after clicking play', async () => {
    const user = userEvent.setup()
    render(<AudioPlayer title="Drift" src="test.mp3" />)
    await user.click(screen.getByRole('button', { name: /play/i }))
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('renders duration when provided', () => {
    render(<AudioPlayer title="Drift" src="test.mp3" duration="3:42" />)
    expect(screen.getByText('3:42')).toBeInTheDocument()
  })
})
