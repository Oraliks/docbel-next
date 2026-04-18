'use client'

import Link from 'next/link'
import { useLang } from './LanguageProvider'
import LanguageSelector from './LanguageSelector'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="footer-dark">
      <div className="container">
        <div className="footer-grid">

          <div>
            <div className="footer-logo">
              <span className="logo-name-gradient">DocBel</span>
            </div>
            <p className="footer-desc">{t('footer.about.desc')}</p>
            <div className="footer-disclaimer">
              ⚠️ <strong>{t('footer.legal')} :</strong> {t('footer.disclaimer')}
            </div>
          </div>

          <div>
            <div className="footer-col-title">{t('footer.nav')}</div>
            <ul className="footer-links">
              <li><Link href="/">{t('nav.home')}</Link></li>
              <li><Link href="/actualites">{t('nav.news')}</Link></li>
              <li><Link href="/simulation">{t('nav.simulations')}</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">{t('footer.orgs')}</div>
            <ul className="footer-links">
              <li><a href="https://www.onem.be" target="_blank" rel="noopener">ONEM</a></li>
              <li><a href="https://www.actiris.brussels" target="_blank" rel="noopener">Actiris</a></li>
              <li><a href="https://www.vdab.be" target="_blank" rel="noopener">VDAB</a></li>
              <li><a href="https://www.leforem.be" target="_blank" rel="noopener">FOREM</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">{t('footer.lang')}</div>
            <LanguageSelector variant="footer" />
          </div>

        </div>

        <div className="footer-bottom">
          <span>🇧🇪 © {year} DocBel — {t('footer.rights')}</span>
          <div className="footer-bottom-links">
            <Link href="#">{t('footer.privacy')}</Link>
            <Link href="#">{t('footer.a11y')}</Link>
            <Link href="/contact">{t('nav.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
