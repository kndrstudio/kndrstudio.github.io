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
