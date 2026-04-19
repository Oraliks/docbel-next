import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — DocBel',
  description: 'Réponses aux questions fréquentes sur le chômage belge : éligibilité, indemnités, dégressivité, formulaires C4 et ONEM.',
  openGraph: {
    title: 'FAQ — DocBel',
    description: 'Réponses aux questions fréquentes sur le chômage belge : éligibilité, indemnités, dégressivité, formulaires C4 et ONEM.',
    url: 'https://docbel.be/faq',
  },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
