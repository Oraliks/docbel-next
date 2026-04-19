'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

export default function SimulationPage() {
  const { t } = useLang()
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [done, setDone]       = useState(false)

  const STEPS = [
    { id: 1, question: t('sim.q1'), options: [{ label: t('sim.q1.o1'), value: 'yes' }, { label: t('sim.q1.o2'), value: 'no' }] },
    { id: 2, question: t('sim.q2'), options: [{ label: t('sim.q2.o1'), value: '<36' }, { label: t('sim.q2.o2'), value: '36-49' }, { label: t('sim.q2.o3'), value: '50+' }] },
    { id: 3, question: t('sim.q3'), options: [{ label: t('sim.q3.o1'), value: 'chef' }, { label: t('sim.q3.o2'), value: 'isole' }, { label: t('sim.q3.o3'), value: 'cohab' }] },
    { id: 4, question: t('sim.q4'), options: [{ label: t('sim.q4.o1'), value: 'yes' }, { label: t('sim.q4.o2'), value: 'no' }, { label: t('sim.q4.o3'), value: 'unknown' }] },
    { id: 5, question: t('sim.q5'), options: [{ label: t('sim.q5.o1'), value: 'yes' }, { label: t('sim.q5.o2'), value: 'no' }, { label: t('sim.q5.o3'), value: 'refuse' }] },
  ]

  const current = STEPS[step]

  const handleAnswer = (value: string) => {
    const next = { ...answers, [current.id]: value }
    setAnswers(next)
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else setDone(true)
  }

  const restart = () => { setStep(0); setAnswers({}); setDone(false) }

  const isEligible = answers[1] === 'yes' && answers[4] !== 'refuse'
  const minDays    = answers[2] === '<36' ? 312 : answers[2] === '36-49' ? 468 : 624
  const taux       = answers[3] === 'chef' ? t('sim.res.taux.chef') : answers[3] === 'isole' ? t('sim.res.taux.isole') : t('sim.res.taux.cohab')
  const refMonths  = answers[2] === '<36' ? t('sim.res.months', { n: 27 }) : answers[2] === '36-49' ? t('sim.res.months', { n: 36 }) : t('sim.res.months', { n: 42 })

  return (
    <div style={{ minHeight: 'calc(100vh - 62px)', background: 'var(--bg)', padding: '72px 0' }}>
      <div className="container" style={{ maxWidth: '640px' }}>

        {!done ? (
          <>
            {/* Header */}
            <div style={{ marginBottom: '40px' }}>
              <div className="eyebrow">{t('sim.eyebrow')}</div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '10px' }}>
                {t('sim.title')}
              </h1>
              <p style={{ color: 'var(--text-3)', fontSize: '.97rem' }}>
                {t('sim.sub', { count: STEPS.length })}
              </p>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', color: 'var(--text-3)', marginBottom: '8px' }}>
                <span>{t('sim.progress', { n: step + 1, total: STEPS.length })}</span>
                <span>{Math.round((step / STEPS.length) * 100)} %</span>
              </div>
              <div style={{ height: '4px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(step / STEPS.length) * 100}%`, background: 'linear-gradient(90deg, var(--primary), #C4A3F0)', borderRadius: '100px', transition: 'width .4s ease' }} />
              </div>
            </div>

            {/* Question card */}
            <div className="card" style={{ padding: '32px 28px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.4 }}>
                {current.question}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {current.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    style={{
                      padding: '14px 18px', borderRadius: '12px', textAlign: 'left',
                      border: '1.5px solid var(--border)', background: 'var(--surface-2)',
                      fontSize: '.92rem', fontWeight: 600, color: 'var(--text-2)',
                      cursor: 'pointer', transition: 'all .18s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'
                      ;(e.currentTarget as HTMLElement).style.background = 'var(--primary-xlight)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--primary)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                      ;(e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-2)'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {t('sim.back')}
              </button>
            )}
          </>
        ) : (
          <>
            {/* Results */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>{isEligible ? '✅' : '⚠️'}</div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '12px' }}>
                {isEligible ? t('sim.res.eligible') : t('sim.res.noteligible')}
              </h1>
              <p style={{ color: 'var(--text-3)', fontSize: '.97rem', maxWidth: '480px', margin: '0 auto' }}>
                {isEligible ? t('sim.res.eligible.sub') : t('sim.res.noteligible.sub')}
              </p>
            </div>

            {isEligible && (
              <div className="card" style={{ padding: '28px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '18px', color: 'var(--text)' }}>{t('sim.res.card.title')}</h3>
                {[
                  { label: t('sim.res.row1'), val: t('sim.res.days', { n: minDays }), good: true },
                  { label: t('sim.res.row2'), val: taux, good: true },
                  { label: t('sim.res.row3'), val: refMonths, good: true },
                  { label: t('sim.res.row4'), val: answers[5] === 'yes' ? t('sim.res.c4.yes') : t('sim.res.c4.no'), good: answers[5] === 'yes' },
                  { label: t('sim.res.row5'), val: answers[4] === 'yes' ? t('sim.res.ins.yes') : t('sim.res.ins.no'), good: answers[4] === 'yes' },
                ].map(r => (
                  <div key={r.label} className="profile-row" style={{ marginBottom: '8px' }}>
                    <span className="pr-label">{r.label}</span>
                    <span className={`pr-val${r.good ? ' good' : ' warn'}`}>{r.val}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/faq" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
                {t('sim.res.faq')}
              </Link>
              <Link href="/reforme" className="btn btn-ghost btn-lg" style={{ justifyContent: 'center' }}>
                {t('sim.res.reforme')}
              </Link>
              <button onClick={restart} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '.86rem', cursor: 'pointer', marginTop: '4px' }}>
                {t('sim.res.restart')}
              </button>
            </div>

            <div style={{ marginTop: '24px', padding: '14px 18px', borderRadius: '12px', background: 'var(--primary-xlight)', borderLeft: '3px solid var(--primary)', fontSize: '.82rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
              ⚠️ <strong style={{ color: 'var(--text-2)' }}>{t('sim.res.warn.strong')}</strong> {t('sim.res.warn')}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
