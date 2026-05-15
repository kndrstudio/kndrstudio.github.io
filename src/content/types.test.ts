import { describe, it, expectTypeOf } from 'vitest'
import type { Poem, Album, ArtProject, TeachingEntry } from './types'

describe('content types', () => {
  it('Poem has required fields', () => {
    const p: Poem = {
      slug: 'march',
      title: 'March',
      date: '2024-03-15',
      tags: ['spring'],
      body: 'The ice goes out.',
    }
    expectTypeOf(p.slug).toBeString()
    expectTypeOf(p.body).toBeString()
    expectTypeOf(p.tags).toBeArray()
  })

  it('Album has tracks array', () => {
    const a: Album = {
      slug: 'slow-hours',
      title: 'Slow Hours',
      date: '2024-06-01',
      tags: [],
      tracks: [],
    }
    expectTypeOf(a.tracks).toBeArray()
  })
})
