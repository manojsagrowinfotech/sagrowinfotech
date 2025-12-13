'use client'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 md:p-16">
          {/* Maintenance Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We&apos;re Under Maintenance
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
            We&apos;re currently working on improving our website to serve you better. 
            We&apos;ll be back online shortly.
          </p>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-base text-gray-600 mb-4">
              <strong className="text-gray-900">What&apos;s happening?</strong>
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our team is performing scheduled maintenance to enhance your experience. 
              We appreciate your patience and understanding.
            </p>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Need immediate assistance?
            </p>
            <div className="space-y-2">
              <a
                href="mailto:manojsagrowinfotech@gmail.com"
                className="text-primary-600 hover:text-primary-700 font-semibold text-base block"
              >
                manojsagrowinfotech@gmail.com
              </a>
              <a
                href="tel:+918838888143"
                className="text-primary-600 hover:text-primary-700 font-semibold text-base block"
              >
                +91 883 888 8143
              </a>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Estimated completion: Soon
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

