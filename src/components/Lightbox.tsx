import { useEffect } from 'react'
import styles from './Lightbox.module.css'

interface LightboxProps {
  src: string
  alt: string
  onClose: () => void
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="image lightbox"
      className={styles.overlay}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className={styles.image}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
