'use client'

import { useState, useEffect } from 'react'
import { useLang } from './LanguageProvider'

const STORAGE_KEY = 'docbel-notif-dismissed'

export default function NotifBar() {
  const { t } = useLang()
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid flash

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) setDismissed(false)
  }, [])

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  if (dismissed) return null

  return (
    <div className="notif-bar">
      <div className="container">
        <div className="notif-inner">
          <div className="notif-left">
            <span className="notif-icon">💛</span>
            <span className="notif-text">
              <strong>{t('notif.strong')}</strong> — {t('notif.text')}
            </span>
          </div>
          <div className="notif-right">
            <a href="#" className="notif-link">{t('notif.cta')} →</a>
            <button className="notif-close" onClick={dismiss} aria-label={t('notif.close')}>
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
