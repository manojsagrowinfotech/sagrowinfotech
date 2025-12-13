import RoleCategory from '@/components/RoleCategory'

export const metadata = {
  title: 'Services',
  description: 'Explore our comprehensive training programs across multiple technology domains.',
}

export default function Services() {
  const serviceCategories = [
    {
      title: 'Technical Development Roles',
      description: 'Master core programming languages and frameworks',
      roles: [
        { name: 'Java Developer', duration: '6 months', level: 'Intermediate' },
        { name: 'Frontend Developer', duration: '5 months', level: 'Beginner' },
        { name: 'Backend Developer', duration: '6 months', level: 'Intermediate' },
        { name: 'Full Stack Developer', duration: '8 months', level: 'Advanced' }
      ]
    },
    {
      title: 'Quality Assurance & Testing',
      description: 'Build expertise in testing methodologies and automation',
      roles: [
        { name: 'QA Engineer', duration: '4 months', level: 'Beginner' },
        { name: 'Automation Test Engineer', duration: '5 months', level: 'Intermediate' },
        { name: 'Performance Testing', duration: '3 months', level: 'Advanced' },
        { name: 'Manual Testing Specialist', duration: '3 months', level: 'Beginner' }
      ]
    },
    {
      title: 'Data & AI Roles',
      description: 'Dive into data science and machine learning',
      roles: [
        { name: 'Data Scientist', duration: '7 months', level: 'Advanced' },
        { name: 'ML Engineer', duration: '7 months', level: 'Advanced' },
        { name: 'AI Engineer', duration: '8 months', level: 'Advanced' },
        { name: 'Data Analyst', duration: '5 months', level: 'Intermediate' }
      ]
    },
    {
      title: 'Cloud & DevOps Roles',
      description: 'Learn cloud infrastructure and deployment strategies',
      roles: [
        { name: 'Cloud Engineer', duration: '6 months', level: 'Intermediate' },
        { name: 'DevOps Engineer', duration: '6 months', level: 'Intermediate' },
        { name: 'SRE', duration: '7 months', level: 'Advanced' },
        { name: 'Cloud Architect', duration: '8 months', level: 'Advanced' }
      ]
    },
    {
      title: 'Mobile & Design',
      description: 'Create amazing user experiences',
      roles: [
        { name: 'Mobile App Developer', duration: '6 months', level: 'Intermediate' },
        { name: 'UI/UX Designer', duration: '5 months', level: 'Intermediate' },
        { name: 'iOS Developer', duration: '6 months', level: 'Intermediate' },
        { name: 'Android Developer', duration: '6 months', level: 'Intermediate' }
      ]
    },
    {
      title: 'Leadership & Management',
      description: 'Develop leadership and project management skills',
      roles: [
        { name: 'Product Manager', duration: '4 months', level: 'Advanced' },
        { name: 'Scrum Master', duration: '2 months', level: 'Beginner' },
        { name: 'Project Manager', duration: '4 months', level: 'Intermediate' },
        { name: 'Delivery Lead', duration: '4 months', level: 'Advanced' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Services</h1>
          <p className="text-lg sm:text-xl text-primary-600 font-semibold">Expert Training Programs for Every Career Path</p>
          <p className="text-gray-600 mt-2">Comprehensive programs across diverse technology domains</p>
        </div>

        {/* Service Categories */}
        <div className="space-y-6 sm:space-y-8 mb-16">
          {serviceCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200">
              <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-blue-600 p-6 sm:p-8 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{category.title}</h2>
                <p className="text-primary-100 text-sm sm:text-base">{category.description}</p>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-4 sm:p-5 hover:from-primary-50 hover:to-blue-50 hover:border-primary-400 transition-all duration-200 group">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{role.name}</h3>
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm font-medium">Duration:</span>
                          <span className="font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full text-xs">{role.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm font-medium">Level:</span>
                          <span className={`font-semibold px-3 py-1 rounded-full text-xs transition-colors ${
                            role.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                            role.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {role.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <section className="bg-gradient-to-r from-primary-50 via-blue-50 to-primary-50 rounded-2xl p-8 sm:p-10 md:p-12 border-2 border-primary-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Additional Support Services</h2>
          <p className="text-center text-gray-600 mb-10">We offer comprehensive support beyond training</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Career Counseling', desc: 'Personalized guidance to help you choose the right career path based on your skills and interests.' },
              { icon: '💼', title: 'Interview Preparation', desc: 'Comprehensive coaching for technical interviews, HR rounds, and salary negotiations.' },
              { icon: '🖼️', title: 'Portfolio Building', desc: 'Help creating impressive portfolios and GitHub profiles to showcase your projects.' },
              { icon: '📄', title: 'Resume Optimization', desc: 'Professional resume reviews and optimization to catch recruiter\'s attention.' },
              { icon: '🤝', title: 'Networking Events', desc: 'Regular meetups and networking sessions with industry professionals and alumni.' },
              { icon: '⭐', title: 'Lifetime Support', desc: 'Ongoing support and access to resources even after course completion.' }
            ].map((service, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-primary-600">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
