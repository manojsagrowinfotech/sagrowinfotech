export default function ReviewCard({ name, testimonial }) {
  return (
    <div className="bg-white rounded-lg shadow-md sm:shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-lg sm:hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start mb-3 sm:mb-4 gap-3 sm:gap-4">
        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary-600 font-semibold text-base sm:text-lg">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{name}</h4>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed italic text-sm sm:text-base">"{testimonial}"</p>
    </div>
  )
}

