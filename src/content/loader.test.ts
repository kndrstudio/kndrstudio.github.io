import { describe, it, expect } from 'vitest'
import {
  parsePoem,
  parseTrack,
  parseAlbum,
  parseArtPiece,
  parseArtProject,
  parseStandaloneArtPiece,
  parseStandaloneTrack,
  parseTeachingEntry,
} from './loader'

const POEM_EN = `---
title: "March"
date: 2024-03-15
tags:
  - spring
---
The ice goes out.
A crow on a wire.`

const POEM_RU = `---
title: "Март"
---
Лёд сходит.
Ворона на проводе.`

const TRACK_RAW = `---
title: "Opening"
track: 1
audio: "https://example.com/opening.mp3"
duration: "3:42"
---`

const ALBUM_INDEX = `---
title: "Slow Hours"
title_ru: "Медленные Часы"
date: 2024-06-01
tags:
  - ambient
description: "An album about stillness"
---`

const ART_PIECE_RAW = `---
title: "Sketch I"
image: /images/art/project/01-sketch.jpg
description: "Pencil on paper"
---`

const ART_PROJECT_INDEX = `---
title: "Field Studies"
title_ru: "Полевые Этюды"
date: 2024-03-01
cover: /images/art/field-studies/cover.jpg
tags:
  - painting
description: "A series of landscape studies"
---`

const STANDALONE_PIECE = `---
title: "Quiet Field"
date: 2024-03-01
image: /images/art/quiet-field.jpg
description: "Oil on canvas"
tags:
  - painting
---`

const STANDALONE_TRACK = `---
title: "Drift"
date: 2024-05-10
audio: "https://example.com/drift.mp3"
description: "Ambient piano"
tags:
  - ambient
---`

const TEACHING_RAW = `---
title: "Piano Lessons"
title_ru: "Уроки фортепиано"
---
Private piano lessons for all levels.`

describe('parsePoem', () => {
  it('extracts slug, title, date, tags, and body', () => {
    const poem = parsePoem('march', POEM_EN)
    expect(poem.slug).toBe('march')
    expect(poem.title).toBe('March')
    expect(poem.date).toBe('2024-03-15')
    expect(poem.tags).toEqual(['spring'])
    expect(poem.body).toBe('The ice goes out.\nA crow on a wire.')
  })

  it('attaches Russian body from sibling file', () => {
    const poem = parsePoem('march', POEM_EN, POEM_RU)
    expect(poem.title_ru).toBe('Март')
    expect(poem.body_ru).toBe('Лёд сходит.\nВорона на проводе.')
  })

  it('body_ru is undefined when no Russian file provided', () => {
    const poem = parsePoem('march', POEM_EN)
    expect(poem.body_ru).toBeUndefined()
  })
})

describe('parseTrack', () => {
  it('extracts slug, title, trackNumber, audio, duration', () => {
    const track = parseTrack('01-opening', TRACK_RAW)
    expect(track.slug).toBe('01-opening')
    expect(track.title).toBe('Opening')
    expect(track.trackNumber).toBe(1)
    expect(track.audio).toBe('https://example.com/opening.mp3')
    expect(track.duration).toBe('3:42')
  })
})

describe('parseAlbum', () => {
  it('assembles album from index and track files, sorted by trackNumber', () => {
    const track2 = `---\ntitle: "Second"\ntrack: 2\naudio: "https://example.com/2.mp3"\n---`
    const album = parseAlbum('slow-hours', ALBUM_INDEX, [
      ['02-second', track2],
      ['01-opening', TRACK_RAW],
    ])
    expect(album.slug).toBe('slow-hours')
    expect(album.title).toBe('Slow Hours')
    expect(album.title_ru).toBe('Медленные Часы')
    expect(album.tracks).toHaveLength(2)
    expect(album.tracks[0].title).toBe('Opening')
    expect(album.tracks[1].title).toBe('Second')
  })
})

describe('parseArtProject', () => {
  it('assembles project from index and piece files', () => {
    const project = parseArtProject('field-studies', ART_PROJECT_INDEX, [
      ['01-sketch', ART_PIECE_RAW],
    ])
    expect(project.slug).toBe('field-studies')
    expect(project.title).toBe('Field Studies')
    expect(project.title_ru).toBe('Полевые Этюды')
    expect(project.pieces).toHaveLength(1)
    expect(project.pieces[0].title).toBe('Sketch I')
    expect(project.pieces[0].image).toBe('/images/art/project/01-sketch.jpg')
  })
})

describe('parseStandaloneArtPiece', () => {
  it('extracts all fields', () => {
    const piece = parseStandaloneArtPiece('quiet-field', STANDALONE_PIECE)
    expect(piece.slug).toBe('quiet-field')
    expect(piece.title).toBe('Quiet Field')
    expect(piece.image).toBe('/images/art/quiet-field.jpg')
    expect(piece.tags).toEqual(['painting'])
  })
})

describe('parseStandaloneTrack', () => {
  it('extracts all fields', () => {
    const track = parseStandaloneTrack('drift', STANDALONE_TRACK)
    expect(track.slug).toBe('drift')
    expect(track.title).toBe('Drift')
    expect(track.audio).toBe('https://example.com/drift.mp3')
    expect(track.tags).toEqual(['ambient'])
  })
})

describe('parseTeachingEntry', () => {
  it('extracts title, title_ru, and body from markdown', () => {
    const entry = parseTeachingEntry('piano-lessons', TEACHING_RAW)
    expect(entry.slug).toBe('piano-lessons')
    expect(entry.title).toBe('Piano Lessons')
    expect(entry.title_ru).toBe('Уроки фортепиано')
    expect(entry.body).toBe('Private piano lessons for all levels.')
  })
})
