'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LoginModal from './LoginModal'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo: icon + uppercase text */}
          <Link href="/" className="flex items-center space-x-4">
            <img src="/images/logo-sagrowinfotech-badge.svg" alt="Sagrow Infotech" className="h-14 w-auto md:h-16" />
            <span className="text-2xl md:text-3xl font-extrabold tracking-widest text-primary-600">SAGROWINFOTECH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Services
            </Link>
            <Link href="#alumni-review" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Alumni Review
            </Link>
            <Link href="#faq" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              FAQ
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Contact
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A4 4 0 019 15h6a4 4 0 013.879 2.804M15 11a3 3 0 10-6 0 3 3 0 006 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{user.fullName || 'Profile'}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); router.push('/dashboard') }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      View profile
                    </button>
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); const e = new CustomEvent('openUpdateProfile'); window.dispatchEvent(e); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Update profile
                    </button>
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); const e = new CustomEvent('openChangePassword'); window.dispatchEvent(e); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Change password
                    </button>
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3 mt-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                Home
              </Link>
              <Link
                href="#about"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                About
              </Link>
              <Link
                href="#services"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                Services
              </Link>
              <Link
                href="#alumni-review"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                Alumni Review
              </Link>
              <Link
                href="#faq"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                FAQ
              </Link>
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                Contact
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true)
                    setIsOpen(false)
                  }}
                  className="text-left text-primary-600 hover:text-primary-800 transition-colors font-medium py-2 font-bold"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  )
}

