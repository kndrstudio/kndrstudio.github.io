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
