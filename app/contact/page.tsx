'use client'

import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

export default function ContactPage() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', subject: 'info', message: '' })
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid var(--border)', borderRadius: '10px',
    background: 'var(--surface-2)', color: 'var(--text)',
    fontSize: '.92rem', fontFamily: 'inherit', outline: 'none',
  }

  return (
    <div style={{ padding: '72px 0', minHeight: 'calc(100vh - 62px)' }}>
      <div className="container" style={{ maxWidth: '980px' }}>

        <div style={{ marginBottom: '44px' }}>
          <div className="eyebrow">{t('contact.eyebrow')}</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '10px' }}>{t('contact.title')}</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '1rem', maxWidth: '620px' }}>
            {t('contact.sub')}
          </p>
        </div>

        <div style={{ display: 'grid', gap: '28px', gridTemplateColumns: '1.3fr 1fr' }}>

          {/* Form */}
          <div className="card" style={{ padding: '32px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ fontSize: '3rem' }}>✅</div>
                <h2 style={{ marginTop: '14px' }}>{t('contact.sent')}</h2>
                <p style={{ color: 'var(--text-3)' }}>{t('contact.sent.sub')}</p>
                <button className="btn btn-ghost" style={{ marginTop: '16px' }} onClick={() => { setSent(false); setForm({ name: '', email: '', subject: 'info', message: '' }) }}>
                  {t('contact.sent.again')}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label={t('contact.name')}>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                </Field>
                <Field label={t('contact.email')}>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                </Field>
                <Field label={t('contact.subject')}>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle}>
                    <option value="info">{t('contact.subj.info')}</option>
                    <option value="bug">{t('contact.subj.bug')}</option>
                    <option value="press">{t('contact.subj.press')}</option>
                    <option value="other">{t('contact.subj.other')}</option>
                  </select>
                </Field>
                <Field label={t('contact.message')}>
                  <textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                </Field>
                <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
                  {t('contact.send')}
                </button>
                <p style={{ fontSize: '.78rem', color: 'var(--text-3)', margin: 0 }}>
                  {t('contact.privacy')}
                </p>
              </form>
            )}
          </div>

          {/* Info side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InfoCard icon="📧" title={t('contact.info.email.title')} lines={['contact@docbel.be']} />
            <InfoCard icon="💬" title={t('contact.info.time.title')} lines={[t('contact.info.time.l1'), t('contact.info.time.l2')]} />
            <InfoCard icon="⚠️" title={t('contact.info.urgent.title')} lines={[t('contact.info.urgent.l1'), t('contact.info.urgent.l2')]} />
            <InfoCard icon="🏛️" title={t('contact.info.orgs.title')} lines={['ONEM — onem.be', 'Actiris — actiris.brussels', 'VDAB — vdab.be', 'FOREM — leforem.be']} />
          </div>

        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-2)' }}>{label}</span>
      {children}
    </label>
  )
}

function InfoCard({ icon, title, lines }: { icon: string; title: string; lines: string[] }) {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{icon}</div>
      <div style={{ fontWeight: 800, marginBottom: '6px' }}>{title}</div>
      {lines.map(l => (
        <div key={l} style={{ color: 'var(--text-3)', fontSize: '.85rem', lineHeight: 1.6 }}>{l}</div>
      ))}
    </div>
  )
}
