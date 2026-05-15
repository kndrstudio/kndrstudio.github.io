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
