import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Réforme chômage 2025 — DocBel',
  description: "Tout comprendre sur la réforme du chômage belge 2025 : dégressivité renforcée, nouvelles durées, impact selon votre profil.",
  openGraph: {
    title: 'Réforme chômage 2025 — DocBel',
    description: "Tout comprendre sur la réforme du chômage belge 2025 : dégressivité renforcée, nouvelles durées, impact selon votre profil.",
    url: 'https://docbel.be/reforme',
  },
}

export default function ReformeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
