import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulation chômage — DocBel',
  description: 'Vérifiez votre éligibilité aux allocations de chômage et estimez le montant de vos indemnités en 5 questions.',
  openGraph: {
    title: 'Simulation chômage — DocBel',
    description: 'Vérifiez votre éligibilité aux allocations de chômage et estimez le montant de vos indemnités en 5 questions.',
    url: 'https://docbel.be/simulation',
  },
}

export default function SimulationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
