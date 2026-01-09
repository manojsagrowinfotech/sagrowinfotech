"use client";

import { useState } from "react";

export default function FAQAccordion({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-3 sm:mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors gap-3"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">
          {question}
        </span>
        <svg
          className={`w-4 sm:w-5 h-4 sm:h-5 text-primary-600 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-gray-700 leading-relaxed text-sm sm:text-base">
          {answer}
        </div>
      )}
    </div>
  );
}
