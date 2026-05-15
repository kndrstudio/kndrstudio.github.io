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
