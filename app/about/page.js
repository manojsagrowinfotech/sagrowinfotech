export const metadata = {
  title: 'About Us - SagroInfotech',
  description: 'Learn about SagroInfotech and our mission to bridge the gap between education and industry.',
}

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-lg sm:text-xl text-primary-600 font-semibold">Transforming Careers, Empowering Futures</p>
        </div>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="flex flex-col justify-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-primary-600">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At SagroInfotech, we are committed to bridging the gap between education and industry. Our mission is to empower professionals by providing comprehensive training programs that equip them with in-demand skills needed in today's competitive job market.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe that quality education combined with practical industry experience leads to successful careers. That's why we've designed our programs to include hands-on projects, real-world scenarios, and personalized placement assistance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-primary-600">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To become the leading training and placement organization that transforms lives by enabling professionals to achieve their career aspirations through quality education, industry mentorship, and unwavering support.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center text-primary-600">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⭐', title: 'Excellence', desc: 'We strive for excellence in every aspect of our training and placement services.' },
              { icon: '🤝', title: 'Integrity', desc: 'We maintain the highest standards of honesty and ethical conduct.' },
              { icon: '💡', title: 'Innovation', desc: 'We continuously update our curriculum to reflect the latest industry trends.' },
              { icon: '👥', title: 'Student-Centric', desc: 'We provide personalized attention and guidance to each student.' }
            ].map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary-600 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 sm:p-10 lg:p-12 border border-primary-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Choose SagroInfotech?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Industry-experienced trainers with 10+ years of expertise',
              'Comprehensive curriculum aligned with current market demands',
              'Hands-on projects and real-world problem-solving',
              '100% placement assistance and career guidance',
              'Flexible learning schedules to fit your lifestyle',
              'Lifetime community access and ongoing support'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
