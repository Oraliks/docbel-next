import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — DocBel',
  description: "Contactez l'équipe DocBel pour toute question sur le chômage belge. Nous répondons sous 48 heures ouvrables.",
  openGraph: {
    title: 'Contact — DocBel',
    description: "Contactez l'équipe DocBel pour toute question sur le chômage belge. Nous répondons sous 48 heures ouvrables.",
    url: 'https://docbel.be/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
