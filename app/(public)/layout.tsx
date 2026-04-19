import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NotifBar from '@/components/NotifBar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NotifBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
