export default function RoleCategory({ title, roles }) {
  return (
    <div className="bg-white rounded-lg shadow-md sm:shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-lg sm:hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-primary-600 line-clamp-2">{title}</h3>
      <ul className="space-y-1.5 sm:space-y-2">
        {roles.map((role, index) => (
          <li key={index} className="flex items-start text-gray-700 text-sm sm:text-base gap-2">
            <span className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
            <span>{role}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

