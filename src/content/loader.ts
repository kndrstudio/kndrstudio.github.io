import { parse as parseYaml } from 'yaml'
import type {
  ArtPiece, ArtProject, StandaloneArtPiece, ArtItem,
  Track, Album, StandaloneTrack, MusicItem,
  Poem, TeachingEntry,
} from './types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function matter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw.trim() }
  return {
    data: (parseYaml(match[1]) as Record<string, unknown>) ?? {},
    content: match[2].trim(),
  }
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}

// ─── Pure parsing functions (unit-tested) ────────────────────────────────────

export function parsePoem(slug: string, raw: string, rawRu?: string): Poem {
  const { data, content } = matter(raw)
  const ruParsed = rawRu ? matter(rawRu) : null
  return {
    slug,
    title: data.title as string,
    title_ru: ruParsed?.data.title as string | undefined,
    date: toDateString(data.date),
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
    date: toDateString(data.date),
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
    date: toDateString(data.date),
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
    date: toDateString(data.date),
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
    date: toDateString(data.date),
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

// ─── Glob-based loaders (not unit-tested, used by pages) ─────────────────────

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
