import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AudioPlayer.module.css'

interface AudioPlayerProps {
  title: string
  src: string
  duration?: string
  trackNumber?: number
}

export default function AudioPlayer({ title, src, duration, trackNumber }: AudioPlayerProps) {
  const { t } = useTranslation()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [total, setTotal] = useState(0)

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  function formatTime(s: number): string {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setTotal(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <button
        className={styles.playBtn}
        onClick={toggle}
        aria-label={playing ? t('music.pause') : t('music.play')}
      >
        {playing ? '▐▐' : '▶'}
      </button>
      <div className={styles.info}>
        {trackNumber !== undefined && (
          <span className={styles.trackNum}>{trackNumber}.</span>
        )}
        <span className={styles.title}>{title}</span>
      </div>
      <span className={styles.time}>
        {total > 0 ? `${formatTime(elapsed)} / ${formatTime(total)}` : (duration ?? '')}
      </span>
    </div>
  )
}
