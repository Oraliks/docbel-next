import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Outils — DocBel',
  description: "Tous les outils DocBel : simulateurs de chômage, guides pratiques, lexique juridique et calendrier des démarches.",
  openGraph: {
    title: 'Outils — DocBel',
    description: "Tous les outils DocBel : simulateurs de chômage, guides pratiques, lexique juridique et calendrier des démarches.",
    url: 'https://docbel.be/outils',
  },
}

export default function OutilsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
