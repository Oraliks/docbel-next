import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lexique juridique — DocBel',
  description: "Définitions des termes administratifs et juridiques du chômage belge : ONEM, C4, dégressivité, stage d'insertion et plus.",
  openGraph: {
    title: 'Lexique juridique — DocBel',
    description: "Définitions des termes administratifs et juridiques du chômage belge : ONEM, C4, dégressivité, stage d'insertion et plus.",
    url: 'https://docbel.be/lexique',
  },
}

export default function LexiqueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
