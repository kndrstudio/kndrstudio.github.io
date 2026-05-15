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
