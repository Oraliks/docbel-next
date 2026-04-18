import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Actualités chômage — DocBel',
  description: "Suivez les dernières actualités sur le chômage belge : réformes, décisions ONEM, changements législatifs et conseils pratiques.",
  openGraph: {
    title: 'Actualités chômage — DocBel',
    description: "Suivez les dernières actualités sur le chômage belge : réformes, décisions ONEM, changements législatifs et conseils pratiques.",
    url: 'https://docbel.be/actualites',
  },
}

export default function ActualitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
