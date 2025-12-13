'use client'

import { useState, useEffect } from 'react'

export default function MaintenancePopup() {
  const [showPopup, setShowPopup] = useState(true)
  const [timeLeft, setTimeLeft] = useState(10)

  useEffect(() => {
    if (!showPopup) return

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowPopup(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Auto-close after 10 seconds
    const autoClose = setTimeout(() => {
      setShowPopup(false)
    }, 10000)

    return () => {
      clearInterval(timer)
      clearTimeout(autoClose)
    }
  }, [showPopup])

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Website Under Maintenance
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We&apos;re currently performing scheduled maintenance to improve our services. 
            Some features may be temporarily unavailable.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            This popup will close automatically in <span className="font-semibold text-primary-600">{timeLeft}</span> seconds
          </p>
          <button
            onClick={() => setShowPopup(false)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Continue to Website
          </button>
        </div>
      </div>
    </div>
  )
}

