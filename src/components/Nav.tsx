import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './Nav.module.css'

export default function Nav() {
  const { t, i18n } = useTranslation()
  const otherLang = i18n.language === 'en' ? 'ru' : 'en'

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="main navigation">
        <Link to="/" className={styles.logo}>kndrstudio</Link>
        <div className={styles.links}>
          <Link to="/art">{t('nav.art')}</Link>
          <Link to="/music">{t('nav.music')}</Link>
          <Link to="/poetry">{t('nav.poetry')}</Link>
          <Link to="/teaching">{t('nav.teaching')}</Link>
        </div>
        <button
          className={styles.langSwitch}
          onClick={() => i18n.changeLanguage(otherLang)}
          aria-label={otherLang.toUpperCase()}
        >
          {otherLang.toUpperCase()}
        </button>
      </nav>
    </header>
  )
}
