# kndrstudio Archive Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal React/TypeScript static site for kndrstudio hosted on GitHub Pages with four archive sections (Art, Music, Poetry, Teaching), bilingual EN/RU support, and a content workflow manageable via the GitHub web UI.

**Architecture:** Vite 5 + React 18 + TypeScript; content as Markdown files loaded via `import.meta.glob` at build time; React Router v6 with a `404.html` sessionStorage redirect for GitHub Pages; i18next for EN/RU.

**Tech Stack:** React 18, TypeScript 5, Vite 5, React Router v6, i18next, react-i18next, gray-matter, react-markdown, Vitest, @testing-library/react

---

## File Map

```
/
├── .github/workflows/deploy.yml
├── public/
│   └── 404.html                     # GitHub Pages SPA redirect
├── content/
│   ├── art/
│   │   ├── standalone-piece.md
│   │   └── example-project/
│   │       ├── index.md
│   │       └── 01-piece.md
│   ├── music/
│   │   ├── standalone-track.md
│   │   └── example-album/
│   │       ├── index.md
│   │       └── 01-track.md
│   ├── poetry/
│   │   ├── march.md
│   │   └── march.ru.md
│   └── teaching/
│       └── services.md
├── src/
│   ├── test/setup.ts
│   ├── content/
│   │   ├── types.ts
│   │   ├── loader.ts
│   │   └── loader.test.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── en.json
│   │   └── ru.json
│   ├── components/
│   │   ├── Nav.tsx + Nav.module.css
│   │   ├── ContentList.tsx + ContentList.module.css
│   │   ├── Lightbox.tsx + Lightbox.module.css
│   │   └── AudioPlayer.tsx + AudioPlayer.module.css
│   ├── pages/
│   │   ├── Home.tsx + Home.module.css
│   │   ├── ArtIndex.tsx
│   │   ├── ArtProject.tsx
│   │   ├── Art.module.css
│   │   ├── MusicIndex.tsx
│   │   ├── MusicAlbum.tsx
│   │   ├── Music.module.css
│   │   ├── PoetryIndex.tsx
│   │   ├── Poem.tsx
│   │   ├── Poetry.module.css
│   │   ├── Teaching.tsx
│   │   └── Teaching.module.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
└── tsconfig.json
```

---

### Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`
- Create: `public/404.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Initialize Vite project and install dependencies**

Run from `/Users/takoyaki/kndrstudio.github.io`:

```bash
npm create vite@latest . -- --template react-ts
```

When prompted "Current directory is not empty. Please choose how to proceed": select **Ignore files and continue**.

Then install all dependencies:

```bash
npm install react-router-dom i18next react-i18next gray-matter react-markdown
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 2: Configure `vite.config.ts`**

Replace the generated `vite.config.ts` with:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['gray-matter'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
```

- [ ] **Step 3: Add `scripts` to `package.json`**

Open `package.json` and ensure the scripts block is:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 4: Create `public/404.html`**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>kndrstudio</title>
  <script>sessionStorage.redirect = location.href;</script>
  <meta http-equiv="refresh" content="0;URL='/'">
</head>
<body></body>
</html>
```

- [ ] **Step 5: Patch `index.html` with the sessionStorage redirect**

Open `index.html`. Add this script block immediately after `<head>`:

```html
<script>
  (function () {
    var r = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (r && r !== location.href) history.replaceState(null, null, r);
  })();
</script>
```

Full `index.html` should look like:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>
      (function () {
        var r = sessionStorage.redirect;
        delete sessionStorage.redirect;
        if (r && r !== location.href) history.replaceState(null, null, r);
      })();
    </script>
    <title>kndrstudio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create the content directory structure**

```bash
mkdir -p content/art content/music content/poetry content/teaching
mkdir -p public/images/art public/images/music
mkdir -p src/test src/content src/i18n src/components src/pages
```

- [ ] **Step 7: Create placeholder `src/App.tsx`**

```typescript
export default function App() {
  return <div>kndrstudio</div>
}
```

- [ ] **Step 8: Create `src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 9: Create `src/index.css`**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #6b6b6b;
  --color-border: #e5e5e5;
  --color-accent: #1a1a1a;
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-serif: Georgia, 'Times New Roman', serif;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 4rem;
  --max-width: 960px;
}

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  font-size: 1rem;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  display: block;
}
```

- [ ] **Step 10: Verify the dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts on `http://localhost:5173` with no errors.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + TypeScript project"
```

---

### Task 2: Testing infrastructure

**Files:**
- Create: `src/test/setup.ts`
- Create: `src/test/smoke.test.ts`

- [ ] **Step 1: Create `src/test/setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 2: Write a smoke test `src/test/smoke.test.ts`**

```typescript
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('passes', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 3: Run tests and verify they pass**

```bash
npm run test:run
```

Expected output:
```
✓ src/test/smoke.test.ts > smoke > passes
Test Files  1 passed (1)
Tests  1 passed (1)
```

- [ ] **Step 4: Commit**

```bash
git add src/test/
git commit -m "feat: add Vitest + React Testing Library setup"
```

---

### Task 3: Content types

**Files:**
- Create: `src/content/types.ts`

- [ ] **Step 1: Write the failing type-check test `src/content/types.test.ts`**

```typescript
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
```

- [ ] **Step 2: Run tests — expect TypeScript errors because types.ts doesn't exist**

```bash
npm run test:run
```

Expected: error `Cannot find module './types'`

- [ ] **Step 3: Create `src/content/types.ts`**

```typescript
export interface ArtPiece {
  slug: string
  title: string
  image: string
  description?: string
  description_ru?: string
}

export interface ArtProject {
  slug: string
  title: string
  title_ru?: string
  date: string
  cover: string
  description?: string
  description_ru?: string
  tags: string[]
  pieces: ArtPiece[]
}

export interface StandaloneArtPiece {
  slug: string
  title: string
  title_ru?: string
  date: string
  image: string
  description?: string
  description_ru?: string
  tags: string[]
}

export type ArtItem =
  | ({ type: 'project' } & ArtProject)
  | ({ type: 'piece' } & StandaloneArtPiece)

export interface Track {
  slug: string
  title: string
  trackNumber: number
  audio: string
  duration?: string
}

export interface Album {
  slug: string
  title: string
  title_ru?: string
  date: string
  cover?: string
  description?: string
  description_ru?: string
  tags: string[]
  tracks: Track[]
}

export interface StandaloneTrack {
  slug: string
  title: string
  title_ru?: string
  date: string
  audio: string
  duration?: string
  description?: string
  description_ru?: string
  tags: string[]
}

export type MusicItem =
  | ({ type: 'album' } & Album)
  | ({ type: 'track' } & StandaloneTrack)

export interface Poem {
  slug: string
  title: string
  title_ru?: string
  date: string
  tags: string[]
  body: string
  body_ru?: string
}

export interface TeachingEntry {
  slug: string
  title: string
  title_ru?: string
  body: string
  body_ru?: string
}
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npm run test:run
```

Expected:
```
✓ src/content/types.test.ts > content types > Poem has required fields
✓ src/content/types.test.ts > content types > Album has tracks array
```

- [ ] **Step 5: Commit**

```bash
git add src/content/types.ts src/content/types.test.ts
git commit -m "feat: add TypeScript content types"
```

---

### Task 4: Content loader — parsing functions

**Files:**
- Create: `src/content/loader.ts`
- Create: `src/content/loader.test.ts`

- [ ] **Step 1: Write the failing tests `src/content/loader.test.ts`**

```typescript
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
```

- [ ] **Step 2: Run tests — expect failures because loader.ts doesn't exist**

```bash
npm run test:run src/content/loader.test.ts
```

Expected: `Cannot find module './loader'`

- [ ] **Step 3: Create `src/content/loader.ts`**

```typescript
import matter from 'gray-matter'
import type {
  ArtPiece, ArtProject, StandaloneArtPiece, ArtItem,
  Track, Album, StandaloneTrack, MusicItem,
  Poem, TeachingEntry,
} from './types'

// ─── Pure parsing functions (unit-tested) ───────────────────────────────────

export function parsePoem(slug: string, raw: string, rawRu?: string): Poem {
  const { data, content } = matter(raw)
  const ruParsed = rawRu ? matter(rawRu) : null
  return {
    slug,
    title: data.title as string,
    title_ru: ruParsed?.data.title as string | undefined,
    date: String(data.date),
    tags: (data.tags as string[]) ?? [],
    body: content.trim(),
    body_ru: ruParsed ? ruParsed.content.trim() : undefined,
  }
}

export function parseTrack(slug: string, raw: string): Track {
  const { data } = matter(raw)
  return {
    slug,
    title: data.title as string,
    trackNumber: data.track as number,
    audio: data.audio as string,
    duration: data.duration as string | undefined,
  }
}

export function parseAlbum(
  slug: string,
  indexRaw: string,
  trackRaws: Array<[string, string]>
): Album {
  const { data } = matter(indexRaw)
  const tracks = trackRaws
    .map(([trackSlug, raw]) => parseTrack(trackSlug, raw))
    .sort((a, b) => a.trackNumber - b.trackNumber)
  return {
    slug,
    title: data.title as string,
    title_ru: data.title_ru as string | undefined,
    date: String(data.date),
    cover: data.cover as string | undefined,
    description: data.description as string | undefined,
    description_ru: data.description_ru as string | undefined,
    tags: (data.tags as string[]) ?? [],
    tracks,
  }
}

export function parseArtPiece(slug: string, raw: string): ArtPiece {
  const { data } = matter(raw)
  return {
    slug,
    title: data.title as string,
    image: data.image as string,
    description: data.description as string | undefined,
    description_ru: data.description_ru as string | undefined,
  }
}

export function parseArtProject(
  slug: string,
  indexRaw: string,
  pieceRaws: Array<[string, string]>
): ArtProject {
  const { data } = matter(indexRaw)
  return {
    slug,
    title: data.title as string,
    title_ru: data.title_ru as string | undefined,
    date: String(data.date),
    cover: data.cover as string,
    description: data.description as string | undefined,
    description_ru: data.description_ru as string | undefined,
    tags: (data.tags as string[]) ?? [],
    pieces: pieceRaws.map(([pieceSlug, raw]) => parseArtPiece(pieceSlug, raw)),
  }
}

export function parseStandaloneArtPiece(slug: string, raw: string): StandaloneArtPiece {
  const { data } = matter(raw)
  return {
    slug,
    title: data.title as string,
    title_ru: data.title_ru as string | undefined,
    date: String(data.date),
    image: data.image as string,
    description: data.description as string | undefined,
    description_ru: data.description_ru as string | undefined,
    tags: (data.tags as string[]) ?? [],
  }
}

export function parseStandaloneTrack(slug: string, raw: string): StandaloneTrack {
  const { data } = matter(raw)
  return {
    slug,
    title: data.title as string,
    title_ru: data.title_ru as string | undefined,
    date: String(data.date),
    audio: data.audio as string,
    duration: data.duration as string | undefined,
    description: data.description as string | undefined,
    description_ru: data.description_ru as string | undefined,
    tags: (data.tags as string[]) ?? [],
  }
}

export function parseTeachingEntry(slug: string, raw: string): TeachingEntry {
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title as string,
    title_ru: data.title_ru as string | undefined,
    body: content.trim(),
    body_ru: data.body_ru as string | undefined,
  }
}

// ─── Glob-based loaders (not unit-tested, used by pages) ────────────────────

function filename(path: string): string {
  return path.split('/').pop() ?? ''
}

function slugFrom(path: string): string {
  return filename(path).replace(/\.ru\.md$/, '').replace(/\.md$/, '')
}

function parentDir(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 2] ?? ''
}

export function loadPoems(): Poem[] {
  const all = import.meta.glob('../../content/poetry/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  const en: Record<string, string> = {}
  const ru: Record<string, string> = {}

  for (const [path, raw] of Object.entries(all)) {
    const file = filename(path)
    if (file.endsWith('.ru.md')) ru[file.replace('.ru.md', '')] = raw
    else en[file.replace('.md', '')] = raw
  }

  return Object.entries(en)
    .map(([slug, raw]) => parsePoem(slug, raw, ru[slug]))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function loadArtItems(): ArtItem[] {
  const indexFiles = import.meta.glob('../../content/art/*/index.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  const pieceFiles = import.meta.glob('../../content/art/*/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  const standaloneFiles = import.meta.glob('../../content/art/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  const projects: ArtItem[] = Object.entries(indexFiles).map(([path, raw]) => {
    const projectSlug = parentDir(path)
    const pieces = Object.entries(pieceFiles)
      .filter(([p]) => parentDir(p) === projectSlug && filename(p) !== 'index.md')
      .map(([p, r]): [string, string] => [slugFrom(p), r])
    return { type: 'project', ...parseArtProject(projectSlug, raw, pieces) }
  })

  const standalones: ArtItem[] = Object.entries(standaloneFiles).map(([path, raw]) => ({
    type: 'piece',
    ...parseStandaloneArtPiece(slugFrom(path), raw),
  }))

  return [...projects, ...standalones].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function loadArtProject(slug: string): ArtProject | undefined {
  return loadArtItems()
    .filter((item): item is { type: 'project' } & ArtProject => item.type === 'project')
    .find((p) => p.slug === slug)
}

export function loadMusicItems(): MusicItem[] {
  const indexFiles = import.meta.glob('../../content/music/*/index.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  const trackFiles = import.meta.glob('../../content/music/*/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  const standaloneFiles = import.meta.glob('../../content/music/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  const albums: MusicItem[] = Object.entries(indexFiles).map(([path, raw]) => {
    const albumSlug = parentDir(path)
    const tracks = Object.entries(trackFiles)
      .filter(([p]) => parentDir(p) === albumSlug && filename(p) !== 'index.md')
      .map(([p, r]): [string, string] => [slugFrom(p), r])
    return { type: 'album', ...parseAlbum(albumSlug, raw, tracks) }
  })

  const standalones: MusicItem[] = Object.entries(standaloneFiles).map(([path, raw]) => ({
    type: 'track',
    ...parseStandaloneTrack(slugFrom(path), raw),
  }))

  return [...albums, ...standalones].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function loadAlbum(slug: string): Album | undefined {
  return loadMusicItems()
    .filter((item): item is { type: 'album' } & Album => item.type === 'album')
    .find((a) => a.slug === slug)
}

export function loadTeachingEntries(): TeachingEntry[] {
  const files = import.meta.glob('../../content/teaching/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  return Object.entries(files).map(([path, raw]) =>
    parseTeachingEntry(slugFrom(path), raw)
  )
}
```

- [ ] **Step 4: Run tests and verify all parsing function tests pass**

```bash
npm run test:run src/content/loader.test.ts
```

Expected: all 11 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "feat: add content types and parsing functions"
```

---

### Task 5: i18n setup

**Files:**
- Create: `src/i18n/index.ts`, `src/i18n/en.json`, `src/i18n/ru.json`

- [ ] **Step 1: Create `src/i18n/en.json`**

```json
{
  "nav": {
    "art": "Art",
    "music": "Music",
    "poetry": "Poetry",
    "teaching": "Teaching"
  },
  "home": {
    "tagline": "Archive"
  },
  "common": {
    "back": "← Back",
    "tags": "Tags",
    "date": "Date",
    "sortByDate": "Date",
    "sortByTitle": "Title"
  },
  "art": {
    "title": "Art",
    "project": "Project",
    "piece": "Piece"
  },
  "music": {
    "title": "Music",
    "album": "Album",
    "track": "Track",
    "play": "Play",
    "pause": "Pause"
  },
  "poetry": {
    "title": "Poetry"
  },
  "teaching": {
    "title": "Teaching"
  }
}
```

- [ ] **Step 2: Create `src/i18n/ru.json`**

```json
{
  "nav": {
    "art": "Искусство",
    "music": "Музыка",
    "poetry": "Поэзия",
    "teaching": "Обучение"
  },
  "home": {
    "tagline": "Архив"
  },
  "common": {
    "back": "← Назад",
    "tags": "Теги",
    "date": "Дата",
    "sortByDate": "По дате",
    "sortByTitle": "По названию"
  },
  "art": {
    "title": "Искусство",
    "project": "Проект",
    "piece": "Работа"
  },
  "music": {
    "title": "Музыка",
    "album": "Альбом",
    "track": "Трек",
    "play": "Воспроизвести",
    "pause": "Пауза"
  },
  "poetry": {
    "title": "Поэзия"
  },
  "teaching": {
    "title": "Обучение"
  }
}
```

- [ ] **Step 3: Create `src/i18n/index.ts`**

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ru from './ru.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: localStorage.getItem('lang') ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng)
})

export default i18n
```

- [ ] **Step 4: Import i18n in `src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n/index'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 5: Verify build passes**

```bash
npm run build
```

Expected: no TypeScript or Vite errors.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ src/main.tsx
git commit -m "feat: add i18n with EN/RU support"
```

---

### Task 6: App shell and routing

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the routing test `src/App.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import '../i18n/index'

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
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders art index at /art', () => {
    renderAt('/art')
    expect(screen.getByText(/art/i)).toBeInTheDocument()
  })

  it('renders music index at /music', () => {
    renderAt('/music')
    expect(screen.getByText(/music/i)).toBeInTheDocument()
  })

  it('renders poetry index at /poetry', () => {
    renderAt('/poetry')
    expect(screen.getByText(/poetry/i)).toBeInTheDocument()
  })

  it('renders teaching at /teaching', () => {
    renderAt('/teaching')
    expect(screen.getByText(/teaching/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npm run test:run src/App.test.tsx
```

Expected: failures because App.tsx is a placeholder with no routes.

- [ ] **Step 3: Create all placeholder page components**

Create `src/pages/Home.tsx`:
```typescript
export default function Home() {
  return <main><h1>kndrstudio</h1></main>
}
```

Create `src/pages/ArtIndex.tsx`:
```typescript
export default function ArtIndex() {
  return <main><h1>Art</h1></main>
}
```

Create `src/pages/ArtProject.tsx`:
```typescript
export default function ArtProject() {
  return <main><h1>Art Project</h1></main>
}
```

Create `src/pages/MusicIndex.tsx`:
```typescript
export default function MusicIndex() {
  return <main><h1>Music</h1></main>
}
```

Create `src/pages/MusicAlbum.tsx`:
```typescript
export default function MusicAlbum() {
  return <main><h1>Album</h1></main>
}
```

Create `src/pages/PoetryIndex.tsx`:
```typescript
export default function PoetryIndex() {
  return <main><h1>Poetry</h1></main>
}
```

Create `src/pages/Poem.tsx`:
```typescript
export default function Poem() {
  return <main><h1>Poem</h1></main>
}
```

Create `src/pages/Teaching.tsx`:
```typescript
export default function Teaching() {
  return <main><h1>Teaching</h1></main>
}
```

- [ ] **Step 4: Create `src/components/Nav.tsx` stub**

```typescript
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav aria-label="main navigation">
      <Link to="/">kndrstudio</Link>
      <Link to="/art">Art</Link>
      <Link to="/music">Music</Link>
      <Link to="/poetry">Poetry</Link>
      <Link to="/teaching">Teaching</Link>
    </nav>
  )
}
```

- [ ] **Step 5: Rewrite `src/App.tsx` with all routes**

```typescript
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import ArtIndex from './pages/ArtIndex'
import ArtProject from './pages/ArtProject'
import MusicIndex from './pages/MusicIndex'
import MusicAlbum from './pages/MusicAlbum'
import PoetryIndex from './pages/PoetryIndex'
import Poem from './pages/Poem'
import Teaching from './pages/Teaching'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/art" element={<ArtIndex />} />
        <Route path="/art/:slug" element={<ArtProject />} />
        <Route path="/music" element={<MusicIndex />} />
        <Route path="/music/:slug" element={<MusicAlbum />} />
        <Route path="/poetry" element={<PoetryIndex />} />
        <Route path="/poetry/:slug" element={<Poem />} />
        <Route path="/teaching" element={<Teaching />} />
      </Routes>
    </>
  )
}
```

- [ ] **Step 6: Update `src/main.tsx` to wrap App with BrowserRouter**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './i18n/index'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 7: Run tests and verify they pass**

```bash
npm run test:run src/App.test.tsx
```

Expected: all 5 routing tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/main.tsx src/pages/ src/components/Nav.tsx
git commit -m "feat: add React Router shell with all routes"
```

---

### Task 7: Nav component

**Files:**
- Modify: `src/components/Nav.tsx`
- Create: `src/components/Nav.module.css`
- Create: `src/components/Nav.test.tsx`

- [ ] **Step 1: Write the failing test `src/components/Nav.test.tsx`**

```typescript
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
```

- [ ] **Step 2: Run tests — language switcher test fails**

```bash
npm run test:run src/components/Nav.test.tsx
```

Expected: "has a language switcher button" fails.

- [ ] **Step 3: Implement `src/components/Nav.tsx`**

```typescript
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './Nav.module.css'

export default function Nav() {
  const { t, i18n } = useTranslation()
  const otherLang = i18n.language === 'en' ? 'ru' : 'en'

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="main navigation">
        <Link to="/" className={styles.logo}>kndrstudio</Link>
        <div className={styles.links}>
          <Link to="/art">{t('nav.art')}</Link>
          <Link to="/music">{t('nav.music')}</Link>
          <Link to="/poetry">{t('nav.poetry')}</Link>
          <Link to="/teaching">{t('nav.teaching')}</Link>
        </div>
        <button
          className={styles.langSwitch}
          onClick={() => i18n.changeLanguage(otherLang)}
          aria-label={otherLang.toUpperCase()}
        >
          {otherLang.toUpperCase()}
        </button>
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Create `src/components/Nav.module.css`**

```css
.header {
  position: sticky;
  top: 0;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
}

.nav {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-xs) var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo {
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.875rem;
  margin-right: auto;
}

.links {
  display: flex;
  gap: var(--spacing-md);
  font-size: 0.875rem;
}

.langSwitch {
  background: none;
  border: 1px solid var(--color-border);
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  font-family: var(--font-sans);
  color: var(--color-text-muted);
}

.langSwitch:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}
```

- [ ] **Step 5: Run tests and verify they pass**

```bash
npm run test:run src/components/Nav.test.tsx
```

Expected: both tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.tsx src/components/Nav.module.css src/components/Nav.test.tsx
git commit -m "feat: add Nav with language switcher"
```

---

### Task 8: Landing page

**Files:**
- Modify: `src/pages/Home.tsx`
- Create: `src/pages/Home.module.css`

- [ ] **Step 1: Write the failing test `src/pages/Home.test.tsx`**

```typescript
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
```

- [ ] **Step 2: Run tests — they fail**

```bash
npm run test:run src/pages/Home.test.tsx
```

Expected: "renders links to all four sections" fails.

- [ ] **Step 3: Implement `src/pages/Home.tsx`**

```typescript
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './Home.module.css'

const sections = [
  { key: 'art', path: '/art' },
  { key: 'music', path: '/music' },
  { key: 'poetry', path: '/poetry' },
  { key: 'teaching', path: '/teaching' },
] as const

export default function Home() {
  const { t } = useTranslation()

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>kndrstudio</h1>
      <p className={styles.tagline}>{t('home.tagline')}</p>
      <nav className={styles.sections}>
        {sections.map(({ key, path }) => (
          <Link key={key} to={path} className={styles.sectionLink}>
            {t(`nav.${key}`)}
          </Link>
        ))}
      </nav>
    </main>
  )
}
```

- [ ] **Step 4: Create `src/pages/Home.module.css`**

```css
.main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-sm);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  margin-bottom: var(--spacing-xs);
}

.tagline {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-lg);
}

.sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sectionLink {
  font-size: 1.25rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-sm);
  display: block;
}

.sectionLink:hover {
  text-decoration: none;
  color: var(--color-text-muted);
}
```

- [ ] **Step 5: Run tests and verify they pass**

```bash
npm run test:run src/pages/Home.test.tsx
```

Expected: both tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.tsx src/pages/Home.module.css src/pages/Home.test.tsx
git commit -m "feat: add landing page with section links"
```

---

### Task 9: ContentList component

**Files:**
- Create: `src/components/ContentList.tsx`
- Create: `src/components/ContentList.module.css`
- Create: `src/components/ContentList.test.tsx`

- [ ] **Step 1: Write the failing test `src/components/ContentList.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
```

- [ ] **Step 2: Run tests — all fail**

```bash
npm run test:run src/components/ContentList.test.tsx
```

Expected: all 3 tests fail.

- [ ] **Step 3: Implement `src/components/ContentList.tsx`**

```typescript
import { Link } from 'react-router-dom'
import styles from './ContentList.module.css'

interface ContentItem {
  slug: string
  title: string
  date: string
  href: string
  subtitle?: string
}

interface ContentListProps {
  items: ContentItem[]
}

export default function ContentList({ items }: ContentListProps) {
  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <ul className={styles.list}>
      {sorted.map((item) => (
        <li key={item.slug} className={styles.item}>
          <Link to={item.href} className={styles.link}>
            <span className={styles.title}>{item.title}</span>
            {item.subtitle && (
              <span className={styles.subtitle}>{item.subtitle}</span>
            )}
            <span className={styles.date}>{item.date}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 4: Create `src/components/ContentList.module.css`**

```css
.list {
  list-style: none;
  max-width: var(--max-width);
  margin: 0 auto;
}

.item {
  border-bottom: 1px solid var(--color-border);
}

.link {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.link:hover {
  text-decoration: none;
  color: var(--color-text-muted);
}

.title {
  flex: 1;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.date {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}
```

- [ ] **Step 5: Run tests and verify they pass**

```bash
npm run test:run src/components/ContentList.test.tsx
```

Expected: all 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/ContentList.tsx src/components/ContentList.module.css src/components/ContentList.test.tsx
git commit -m "feat: add reusable ContentList component"
```

---

### Task 10: Audio player component

**Files:**
- Create: `src/components/AudioPlayer.tsx`
- Create: `src/components/AudioPlayer.module.css`
- Create: `src/components/AudioPlayer.test.tsx`

- [ ] **Step 1: Write the failing test `src/components/AudioPlayer.test.tsx`**

```typescript
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
```

- [ ] **Step 2: Run tests — all fail**

```bash
npm run test:run src/components/AudioPlayer.test.tsx
```

Expected: all 4 tests fail.

- [ ] **Step 3: Implement `src/components/AudioPlayer.tsx`**

```typescript
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AudioPlayer.module.css'

interface AudioPlayerProps {
  title: string
  src: string
  duration?: string
  trackNumber?: number
}

export default function AudioPlayer({ title, src, duration, trackNumber }: AudioPlayerProps) {
  const { t } = useTranslation()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [total, setTotal] = useState(0)

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true))
    }
  }

  function formatTime(s: number): string {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setTotal(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <button
        className={styles.playBtn}
        onClick={toggle}
        aria-label={playing ? t('music.pause') : t('music.play')}
      >
        {playing ? '▐▐' : '▶'}
      </button>
      <div className={styles.info}>
        {trackNumber !== undefined && (
          <span className={styles.trackNum}>{trackNumber}.</span>
        )}
        <span className={styles.title}>{title}</span>
      </div>
      <span className={styles.time}>
        {total > 0 ? `${formatTime(elapsed)} / ${formatTime(total)}` : (duration ?? '')}
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/AudioPlayer.module.css`**

```css
.player {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--color-border);
}

.playBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--color-text);
  width: 2rem;
  text-align: center;
  flex-shrink: 0;
}

.playBtn:hover {
  color: var(--color-text-muted);
}

.info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.trackNum {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.title {
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}
```

- [ ] **Step 5: Run tests and verify they pass**

```bash
npm run test:run src/components/AudioPlayer.test.tsx
```

Expected: all 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/AudioPlayer.tsx src/components/AudioPlayer.module.css src/components/AudioPlayer.test.tsx
git commit -m "feat: add HTML5 AudioPlayer component"
```

---

### Task 11: Lightbox component

**Files:**
- Create: `src/components/Lightbox.tsx`
- Create: `src/components/Lightbox.module.css`
- Create: `src/components/Lightbox.test.tsx`

- [ ] **Step 1: Write the failing test `src/components/Lightbox.test.tsx`**

```typescript
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
```

- [ ] **Step 2: Run tests — all fail**

```bash
npm run test:run src/components/Lightbox.test.tsx
```

Expected: all 3 tests fail.

- [ ] **Step 3: Implement `src/components/Lightbox.tsx`**

```typescript
import { useEffect } from 'react'
import styles from './Lightbox.module.css'

interface LightboxProps {
  src: string
  alt: string
  onClose: () => void
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-label="image lightbox"
      className={styles.overlay}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className={styles.image}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/Lightbox.module.css`**

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  cursor: zoom-out;
}

.image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  cursor: default;
}
```

- [ ] **Step 5: Run tests and verify they pass**

```bash
npm run test:run src/components/Lightbox.test.tsx
```

Expected: all 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/Lightbox.tsx src/components/Lightbox.module.css src/components/Lightbox.test.tsx
git commit -m "feat: add Lightbox component"
```

---

### Task 12: Art section pages

**Files:**
- Modify: `src/pages/ArtIndex.tsx`
- Modify: `src/pages/ArtProject.tsx`
- Create: `src/pages/Art.module.css`

- [ ] **Step 1: Implement `src/pages/ArtIndex.tsx`**

```typescript
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loadArtItems } from '../content/loader'
import type { ArtProject, StandaloneArtPiece } from '../content/types'
import styles from './Art.module.css'

export default function ArtIndex() {
  const { t, i18n } = useTranslation()
  const items = loadArtItems()
  const ru = i18n.language === 'ru'

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>{t('art.title')}</h1>
      <div className={styles.grid}>
        {items.map((item) => {
          if (item.type === 'project') {
            const p = item as { type: 'project' } & ArtProject
            return (
              <Link key={p.slug} to={`/art/${p.slug}`} className={styles.card}>
                {p.cover && <img src={p.cover} alt={p.title} className={styles.cover} />}
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{ru && p.title_ru ? p.title_ru : p.title}</span>
                  <span className={styles.cardMeta}>{p.date.slice(0, 4)}</span>
                </div>
              </Link>
            )
          }
          const p = item as { type: 'piece' } & StandaloneArtPiece
          return (
            <div key={p.slug} className={styles.card}>
              <img src={p.image} alt={p.title} className={styles.cover} />
              <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>{ru && p.title_ru ? p.title_ru : p.title}</span>
                <span className={styles.cardMeta}>{p.date.slice(0, 4)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Implement `src/pages/ArtProject.tsx`**

```typescript
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { loadArtProject } from '../content/loader'
import Lightbox from '../components/Lightbox'
import styles from './Art.module.css'

export default function ArtProject() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const project = loadArtProject(slug!)
  const ru = i18n.language === 'ru'

  if (!project) {
    return <main className={styles.main}><p>Not found</p></main>
  }

  return (
    <main className={styles.main}>
      <Link to="/art" className={styles.back}>{t('common.back')}</Link>
      <h1 className={styles.heading}>
        {ru && project.title_ru ? project.title_ru : project.title}
      </h1>
      {project.description && (
        <p className={styles.description}>
          {ru && project.description_ru ? project.description_ru : project.description}
        </p>
      )}
      <div className={styles.grid}>
        {project.pieces.map((piece) => (
          <button
            key={piece.slug}
            className={styles.thumbBtn}
            onClick={() => setLightbox({ src: piece.image, alt: piece.title })}
          >
            <img src={piece.image} alt={piece.title} className={styles.thumb} />
            {piece.description && (
              <span className={styles.thumbCaption}>
                {ru && piece.description_ru ? piece.description_ru : piece.description}
              </span>
            )}
          </button>
        ))}
      </div>
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </main>
  )
}
```

- [ ] **Step 3: Create `src/pages/Art.module.css`**

```css
.main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-sm);
}

.heading {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: var(--spacing-md);
}

.back {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.description {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
  max-width: 60ch;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-sm);
}

.card {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card:hover .cardTitle {
  text-decoration: underline;
}

.cover {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  background: var(--color-border);
}

.cardInfo {
  padding: var(--spacing-xs) 0;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.cardTitle {
  font-size: 0.9rem;
}

.cardMeta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.thumbBtn {
  background: none;
  border: none;
  padding: 0;
  cursor: zoom-in;
  text-align: left;
}

.thumb {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  background: var(--color-border);
}

.thumbCaption {
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  padding-top: var(--spacing-xs);
}
```

- [ ] **Step 4: Verify the build compiles without TypeScript errors**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ArtIndex.tsx src/pages/ArtProject.tsx src/pages/Art.module.css
git commit -m "feat: add Art section pages with lightbox"
```

---

### Task 13: Music section pages

**Files:**
- Modify: `src/pages/MusicIndex.tsx`
- Modify: `src/pages/MusicAlbum.tsx`
- Create: `src/pages/Music.module.css`

- [ ] **Step 1: Implement `src/pages/MusicIndex.tsx`**

```typescript
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loadMusicItems } from '../content/loader'
import type { Album, StandaloneTrack } from '../content/types'
import AudioPlayer from '../components/AudioPlayer'
import styles from './Music.module.css'

export default function MusicIndex() {
  const { t, i18n } = useTranslation()
  const items = loadMusicItems()
  const ru = i18n.language === 'ru'

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>{t('music.title')}</h1>
      <div className={styles.list}>
        {items.map((item) => {
          if (item.type === 'album') {
            const a = item as { type: 'album' } & Album
            return (
              <Link key={a.slug} to={`/music/${a.slug}`} className={styles.albumRow}>
                {a.cover && <img src={a.cover} alt={a.title} className={styles.albumCover} />}
                <div className={styles.albumInfo}>
                  <span className={styles.albumTitle}>
                    {ru && a.title_ru ? a.title_ru : a.title}
                  </span>
                  <span className={styles.albumMeta}>
                    {a.tracks.length} {t('music.track')}{a.tracks.length !== 1 ? 's' : ''} · {a.date.slice(0, 4)}
                  </span>
                </div>
              </Link>
            )
          }
          const tr = item as { type: 'track' } & StandaloneTrack
          return (
            <AudioPlayer
              key={tr.slug}
              title={ru && tr.title_ru ? tr.title_ru : tr.title}
              src={tr.audio}
              duration={tr.duration}
            />
          )
        })}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Implement `src/pages/MusicAlbum.tsx`**

```typescript
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loadAlbum } from '../content/loader'
import AudioPlayer from '../components/AudioPlayer'
import styles from './Music.module.css'

export default function MusicAlbum() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const album = loadAlbum(slug!)
  const ru = i18n.language === 'ru'

  if (!album) {
    return <main className={styles.main}><p>Not found</p></main>
  }

  return (
    <main className={styles.main}>
      <Link to="/music" className={styles.back}>{t('common.back')}</Link>
      <div className={styles.albumHeader}>
        {album.cover && <img src={album.cover} alt={album.title} className={styles.albumCoverLarge} />}
        <div>
          <h1 className={styles.heading}>
            {ru && album.title_ru ? album.title_ru : album.title}
          </h1>
          {album.description && (
            <p className={styles.description}>
              {ru && album.description_ru ? album.description_ru : album.description}
            </p>
          )}
          <p className={styles.albumMeta}>{album.date.slice(0, 4)}</p>
        </div>
      </div>
      <div className={styles.trackList}>
        {album.tracks.map((track) => (
          <AudioPlayer
            key={track.slug}
            title={track.title}
            src={track.audio}
            duration={track.duration}
            trackNumber={track.trackNumber}
          />
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Create `src/pages/Music.module.css`**

```css
.main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-sm);
}

.heading {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: var(--spacing-md);
}

.back {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.description {
  color: var(--color-text-muted);
  max-width: 60ch;
  margin-bottom: var(--spacing-sm);
}

.list {
  display: flex;
  flex-direction: column;
}

.albumRow {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
  text-decoration: none;
  color: inherit;
}

.albumRow:hover .albumTitle {
  text-decoration: underline;
}

.albumCover {
  width: 56px;
  height: 56px;
  object-fit: cover;
  background: var(--color-border);
  flex-shrink: 0;
}

.albumInfo {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.albumTitle {
  font-size: 0.95rem;
}

.albumMeta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.albumHeader {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.albumCoverLarge {
  width: 160px;
  height: 160px;
  object-fit: cover;
  background: var(--color-border);
  flex-shrink: 0;
}

.trackList {
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/MusicIndex.tsx src/pages/MusicAlbum.tsx src/pages/Music.module.css
git commit -m "feat: add Music section pages"
```

---

### Task 14: Poetry section pages

**Files:**
- Modify: `src/pages/PoetryIndex.tsx`
- Modify: `src/pages/Poem.tsx`
- Create: `src/pages/Poetry.module.css`

- [ ] **Step 1: Implement `src/pages/PoetryIndex.tsx`**

```typescript
import { useTranslation } from 'react-i18next'
import { loadPoems } from '../content/loader'
import ContentList from '../components/ContentList'
import styles from './Poetry.module.css'

export default function PoetryIndex() {
  const { t, i18n } = useTranslation()
  const poems = loadPoems()
  const ru = i18n.language === 'ru'

  const items = poems.map((p) => ({
    slug: p.slug,
    title: ru && p.title_ru ? p.title_ru : p.title,
    date: p.date,
    href: `/poetry/${p.slug}`,
  }))

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>{t('poetry.title')}</h1>
      <ContentList items={items} />
    </main>
  )
}
```

- [ ] **Step 2: Implement `src/pages/Poem.tsx`**

```typescript
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loadPoems } from '../content/loader'
import styles from './Poetry.module.css'

export default function Poem() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const poem = loadPoems().find((p) => p.slug === slug)
  const ru = i18n.language === 'ru'

  if (!poem) {
    return <main className={styles.main}><p>Not found</p></main>
  }

  const title = ru && poem.title_ru ? poem.title_ru : poem.title
  const body = ru && poem.body_ru ? poem.body_ru : poem.body

  return (
    <main className={styles.main}>
      <Link to="/poetry" className={styles.back}>{t('common.back')}</Link>
      <article className={styles.poem}>
        <h1 className={styles.poemTitle}>{title}</h1>
        <p className={styles.poemDate}>{poem.date}</p>
        <pre className={styles.poemBody}>{body}</pre>
      </article>
    </main>
  )
}
```

- [ ] **Step 3: Create `src/pages/Poetry.module.css`**

```css
.main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-sm);
}

.heading {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: var(--spacing-md);
}

.back {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.poem {
  max-width: 40ch;
}

.poemTitle {
  font-size: 1.25rem;
  font-weight: 400;
  margin-bottom: var(--spacing-xs);
}

.poemDate {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.poemBody {
  font-family: var(--font-serif);
  font-size: 1rem;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/PoetryIndex.tsx src/pages/Poem.tsx src/pages/Poetry.module.css
git commit -m "feat: add Poetry section pages"
```

---

### Task 15: Teaching page

**Files:**
- Modify: `src/pages/Teaching.tsx`
- Create: `src/pages/Teaching.module.css`

- [ ] **Step 1: Implement `src/pages/Teaching.tsx`**

```typescript
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { loadTeachingEntries } from '../content/loader'
import styles from './Teaching.module.css'

export default function Teaching() {
  const { t, i18n } = useTranslation()
  const entries = loadTeachingEntries()
  const ru = i18n.language === 'ru'

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>{t('teaching.title')}</h1>
      {entries.map((entry) => (
        <section key={entry.slug} className={styles.entry}>
          <h2 className={styles.entryTitle}>
            {ru && entry.title_ru ? entry.title_ru : entry.title}
          </h2>
          <div className={styles.entryBody}>
            <ReactMarkdown>
              {ru && entry.body_ru ? entry.body_ru : entry.body}
            </ReactMarkdown>
          </div>
        </section>
      ))}
    </main>
  )
}
```

- [ ] **Step 2: Create `src/pages/Teaching.module.css`**

```css
.main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-sm);
}

.heading {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: var(--spacing-lg);
}

.entry {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.entry:last-child {
  border-bottom: none;
}

.entryTitle {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
}

.entryBody {
  max-width: 65ch;
  color: var(--color-text);
}

.entryBody p {
  margin-bottom: var(--spacing-sm);
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Teaching.tsx src/pages/Teaching.module.css
git commit -m "feat: add Teaching section page"
```

---

### Task 16: Sample content

**Files:**
- Create: `content/poetry/march.md`, `content/poetry/march.ru.md`
- Create: `content/music/slow-hours/index.md`, `content/music/slow-hours/01-opening.md`
- Create: `content/art/field-studies/index.md`, `content/art/field-studies/01-sketch.md`
- Create: `content/teaching/services.md`

- [ ] **Step 1: Create `content/poetry/march.md`**

```markdown
---
title: "March"
date: 2024-03-15
tags:
  - spring
---
The ice goes out.
A crow on a wire.
Nothing to say.
```

- [ ] **Step 2: Create `content/poetry/march.ru.md`**

```markdown
---
title: "Март"
lang: ru
---
Лёд сходит.
Ворона на проводе.
Нечего сказать.
```

- [ ] **Step 3: Create `content/music/slow-hours/index.md`**

```markdown
---
title: "Slow Hours"
title_ru: "Медленные Часы"
date: 2024-06-01
description: "An album about stillness"
description_ru: "Альбом о тишине"
tags:
  - ambient
  - piano
---
```

- [ ] **Step 4: Create `content/music/slow-hours/01-opening.md`**

```markdown
---
title: "Opening"
track: 1
audio: "https://github.com/kndrstudio/kndrstudio.github.io/releases/download/slow-hours/01-opening.mp3"
duration: "3:42"
---
```

- [ ] **Step 5: Create `content/art/field-studies/index.md`**

```markdown
---
title: "Field Studies"
title_ru: "Полевые Этюды"
date: 2024-03-01
cover: /images/art/field-studies/cover.jpg
description: "A series of landscape studies"
description_ru: "Серия пейзажных зарисовок"
tags:
  - painting
  - series
---
```

- [ ] **Step 6: Create `content/art/field-studies/01-sketch.md`**

```markdown
---
title: "Sketch I"
image: /images/art/field-studies/01-sketch.jpg
description: "Pencil on paper"
description_ru: "Карандаш на бумаге"
---
```

- [ ] **Step 7: Create `content/teaching/services.md`**

```markdown
---
title: "Piano Lessons"
title_ru: "Уроки фортепиано"
---
Private piano lessons for students of all levels, from beginners to advanced.

Lessons are tailored to your goals: classical technique, improvisation, composition, or music theory. Sessions are 60 minutes, held weekly.

To inquire, contact via email.
```

- [ ] **Step 8: Verify the dev server shows content**

```bash
npm run dev
```

Open `http://localhost:5173`. Verify:
- Home page shows all four section links
- `/poetry` shows "March" in the list
- `/poetry/march` shows the poem text
- `/music` shows "Slow Hours" album
- `/art` shows "Field Studies" project
- `/teaching` shows piano lessons content
- Language switcher toggles EN/RU

- [ ] **Step 9: Commit**

```bash
git add content/
git commit -m "feat: add sample content for all sections"
```

---

### Task 17: GitHub Actions deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 2: Enable GitHub Pages in the repository settings**

Go to: `https://github.com/kndrstudio/kndrstudio.github.io/settings/pages`

Set **Source** to **GitHub Actions**.

- [ ] **Step 3: Run the full test suite and build one final time**

```bash
npm run test:run && npm run build
```

Expected: all tests pass, build succeeds with no errors.

- [ ] **Step 4: Commit and push**

```bash
git add .github/
git commit -m "feat: add GitHub Actions deployment workflow"
git push origin main
```

- [ ] **Step 5: Verify deployment**

Go to `https://github.com/kndrstudio/kndrstudio.github.io/actions`. The **Deploy to GitHub Pages** workflow should run automatically. Once it completes (green check), the site will be live at `https://kndrstudio.github.io`.

---

## Summary

17 tasks in total. Foundation (Tasks 1–6) must be done in order. Component tasks (7–11) can be done in any order after Task 6. Section pages (12–15) depend on their respective components. Sample content (16) and deployment (17) come last.
