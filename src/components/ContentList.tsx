import { Link } from 'react-router-dom'
import styles from './ContentList.module.css'

interface ContentItem {
  slug: string
  title: string
  date: string
  href: string
  subtitle?: string
}

interface ContentListProps {
  items: ContentItem[]
}

export default function ContentList({ items }: ContentListProps) {
  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <ul className={styles.list}>
      {sorted.map((item) => (
        <li key={item.slug} className={styles.item}>
          <Link to={item.href} className={styles.link}>
            <span className={styles.title}>{item.title}</span>
            {item.subtitle && (
              <span className={styles.subtitle}>{item.subtitle}</span>
            )}
            <span className={styles.date}>{item.date}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
