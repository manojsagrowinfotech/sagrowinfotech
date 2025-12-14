'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

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
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

