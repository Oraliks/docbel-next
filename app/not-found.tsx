'use client'

import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

export default function NotFound() {
  const { t } = useLang()

  return (
    <main className="page-main error-container">
      <section className="error-hero">
        <div className="error-decoration">
          <span className="error-frites" aria-hidden>🍟</span>
          <span className="error-frites" aria-hidden style={{ animationDelay: '.3s' }}>🍟</span>
          <span className="error-beer" aria-hidden>🍺</span>
        </div>

        <div className="error-content">
          <p className="error-code" aria-hidden>404</p>
          <h1 className="error-title">{t('error.404.title')}</h1>
          <p className="error-sub">{t('error.404.sub')}</p>
          <p className="error-detail">{t('error.404.detail')}</p>
          <p className="error-belgian">{t('error.belgian')}</p>

          <div className="error-btn-group">
            <Link href="/" className="btn-primary">
              <span aria-hidden>🏠</span> {t('404.home')}
            </Link>
            <Link href="/faq" className="btn-secondary">
              <span aria-hidden>❓</span> {t('404.faq')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
