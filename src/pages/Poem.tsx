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
