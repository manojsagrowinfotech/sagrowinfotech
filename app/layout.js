import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ContactModalProvider } from '@/components/ContactModalContext'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'SAGROWINFOTECH - Professional Placement Services',
  description: 'Transform your career with our comprehensive placement assistance. We bridge the gap between education and industry.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
            <Head>
              {/* Google Site Verification */}
              <meta name="google-site-verification" content="yU4K7LxnzmfG9jaBcD9ZPRW0NjssiTXtrT85vQM1ink" />
      
              {/* Site-wide SEO */}
              <link rel="canonical" href="https://www.sagrowinfotech.com/" />
            </Head>
      <body className="antialiased">
        <AuthProvider>
          <ContactModalProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ContactModalProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

