"use client";

export default function Services() {
  const serviceCategories = [
    {
      title: "Technical Development Roles",
      description: "Master core programming languages and frameworks",
      roles: [
        { name: "Java Developer", duration: "6 months", level: "Intermediate" },
        { name: "Frontend Developer", duration: "5 months", level: "Beginner" },
        {
          name: "Backend Developer",
          duration: "6 months",
          level: "Intermediate",
        },
        {
          name: "Full Stack Developer",
          duration: "8 months",
          level: "Advanced",
        },
      ],
    },
    {
      title: "Quality Assurance & Testing",
      description: "Build expertise in testing methodologies and automation",
      roles: [
        { name: "QA Engineer", duration: "4 months", level: "Beginner" },
        {
          name: "Automation Test Engineer",
          duration: "5 months",
          level: "Intermediate",
        },
        {
          name: "Performance Testing",
          duration: "3 months",
          level: "Advanced",
        },
        {
          name: "Manual Testing Specialist",
          duration: "3 months",
          level: "Beginner",
        },
      ],
    },
    {
      title: "Data & AI Roles",
      description: "Dive into data science and machine learning",
      roles: [
        { name: "Data Scientist", duration: "7 months", level: "Advanced" },
        { name: "ML Engineer", duration: "7 months", level: "Advanced" },
        { name: "AI Engineer", duration: "8 months", level: "Advanced" },
        { name: "Data Analyst", duration: "5 months", level: "Intermediate" },
      ],
    },
    {
      title: "Cloud & DevOps Roles",
      description: "Architect cloud infrastructure and deployment strategies",
      roles: [
        { name: "Cloud Engineer", duration: "6 months", level: "Intermediate" },
        {
          name: "DevOps Engineer",
          duration: "6 months",
          level: "Intermediate",
        },
        { name: "SRE", duration: "7 months", level: "Advanced" },
        { name: "Cloud Architect", duration: "8 months", level: "Advanced" },
      ],
    },
    {
      title: "Mobile & Design",
      description: "Create amazing user experiences",
      roles: [
        {
          name: "Mobile App Developer",
          duration: "6 months",
          level: "Intermediate",
        },
        { name: "UI/UX Designer", duration: "5 months", level: "Intermediate" },
        { name: "iOS Developer", duration: "6 months", level: "Intermediate" },
        {
          name: "Android Developer",
          duration: "6 months",
          level: "Intermediate",
        },
      ],
    },
    {
      title: "Leadership & Management",
      description: "Develop leadership and project management skills",
      roles: [
        { name: "Product Manager", duration: "4 months", level: "Advanced" },
        { name: "Scrum Master", duration: "2 months", level: "Beginner" },
        {
          name: "Project Manager",
          duration: "4 months",
          level: "Intermediate",
        },
        { name: "Delivery Lead", duration: "4 months", level: "Advanced" },
      ],
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
            Services
          </h1>
          <p className="text-lg sm:text-xl text-primary-600 font-semibold">
            Expert Placement Programs for Every Career Path
          </p>
          <p className="text-gray-600 mt-2">
            Comprehensive programs across diverse technology domains
          </p>
        </div>

        {/* Service Categories */}
        <div className="space-y-6 sm:space-y-8 mb-16">
          {serviceCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 group relative"
            >

              <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-blue-600 p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {category.title}
                    </h2>
                  </div>
                  <p className="text-primary-100 text-sm sm:text-base">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.roles.map((role, roleIndex) => (
                    <div
                      key={roleIndex}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-4 sm:p-5 hover:from-primary-50 hover:to-blue-50 hover:border-primary-400 transition-all duration-200 group relative overflow-hidden"
                    >
                      {/* Match Indicator */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {role.name}
                          </h3>
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Duration:
                            </span>
                            <span className="font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full text-xs">
                              {role.duration}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Level:
                            </span>
                            <span
                              className={`font-semibold px-3 py-1 rounded-full text-xs transition-colors ${
                                role.level === "Beginner"
                                  ? "bg-green-100 text-green-800"
                                  : role.level === "Intermediate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {role.level}
                            </span>
                          </div>
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
        <section className="bg-gradient-to-r from-primary-50 via-blue-50 to-primary-50 rounded-2xl p-8 sm:p-10 md:p-12 border-2 border-primary-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Additional Support Services
              </h2>
              <p className="text-gray-600">
                We offer comprehensive support beyond placement assistance
              </p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Career Counseling",
                desc: "Personalized guidance to help you choose the right career path based on your skills and interests.",
              },
              {
                icon: "💼",
                title: "Interview Preparation",
                desc: "Comprehensive coaching for technical interviews, HR rounds, and salary negotiations.",
              },
              {
                icon: "🖼️",
                title: "Portfolio Building",
                desc: "Help creating impressive portfolios and GitHub profiles to showcase your projects.",
              },
              {
                icon: "📄",
                title: "Resume Optimization",
                desc: "Professional resume reviews and optimization to catch recruiter's attention.",
              },
              {
                icon: "🤝",
                title: "Networking Events",
                desc: "Regular meetups and networking sessions with industry professionals and alumni.",
              },
              {
                icon: "⭐",
                title: "Lifetime Support",
                desc: "Ongoing support and access to resources even after placement completion.",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-primary-600 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-3xl group-hover:scale-110 transition-transform">{service.icon}</div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>
      </div>
    </div>
  );
}
