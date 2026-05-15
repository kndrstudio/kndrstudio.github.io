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
