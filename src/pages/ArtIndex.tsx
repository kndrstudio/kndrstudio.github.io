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
