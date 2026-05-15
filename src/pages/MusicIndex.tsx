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
