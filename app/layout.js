import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MaintenancePopupWrapper from '@/components/MaintenancePopupWrapper'
import { ContactModalProvider } from '@/components/ContactModalContext'

export const metadata = {
  title: 'SAGROINFOTECH - Professional Training & Placement Services',
  description: 'Transform your career with our comprehensive training programs and placement assistance. We bridge the gap between education and industry.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ContactModalProvider>
          <MaintenancePopupWrapper />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ContactModalProvider>
      </body>
    </html>
  )
}

