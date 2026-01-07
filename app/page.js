'use client'

import Link from 'next/link'
import FAQAccordion from '@/components/FAQAccordion'
import ReviewCard from '@/components/ReviewCard'
import RoleCategory from '@/components/RoleCategory'
import Services from '@/components/Services'
import ContactModal from '@/components/ContactModal'
import { useContactModal } from '@/components/ContactModalContext'

function HomeContent() {
  const { openModal } = useContactModal()
  
  const roleCategories = [
    {
      title: 'Technical Development Roles',
      roles: ['Java Developer', 'Frontend / Backend Developer', 'Full Stack Developer']
    },
    {
      title: 'Quality Assurance & Testing',
      roles: ['QA Engineer', 'Automation Test Engineer']
    },
    {
      title: 'Data & AI Roles',
      roles: ['Data Scientist', 'ML Engineer', 'AI Engineer']
    },
    {
      title: 'Cloud & DevOps Roles',
      roles: ['Cloud Engineer', 'DevOps Engineer', 'SRE']
    },
    {
      title: 'Mobile & Design',
      roles: ['Mobile App Developer', 'UI/UX Designer', 'Solutions Architect']
    },
    {
      title: 'Leadership & Management',
      roles: ['Product Manager', 'Scrum Master', 'Project Manager', 'Delivery Lead']
    },
    {
      title: 'IT Support & Infrastructure',
      roles: ['Technical Support Engineer', 'Network Engineer', 'System Administrator']
    },
    {
      title: 'Emerging Technologies',
      roles: ['Blockchain Developer', 'Embedded Systems Engineer', 'AR / VR Developer']
    }
  ]

  const freshersReviews = [
    {
      name: 'Priya Sharma',
      testimonial: 'The placement program was comprehensive and the support was exceptional. I landed my dream job as a Java Developer within 3 months of joining.'
    },
    {
      name: 'Rahul Kumar',
      testimonial: 'Coming from a non-technical background, I was nervous about switching careers. The structured technical guidance and personalized mentorship helped me secure a position as a Frontend Developer.'
    },
    {
      name: 'Anjali Patel',
      testimonial: 'The interview preparation sessions were incredibly helpful. The mentors provided real-world insights that gave me confidence during client interviews. Highly recommended!'
    },
    {
      name: 'Vikram Singh',
      testimonial: 'I completed the Full Stack Developer program and received multiple job offers. The placement team was supportive throughout the entire process.'
    }
  ]

  const experiencedReviews = [
    {
      name: 'Rajesh Mehta',
      testimonial: 'After 5 years in a different domain, I wanted to transition to Cloud Engineering. The advanced technical sessions and placement assistance helped me make a successful career switch.'
    },
    {
      name: 'Sneha Reddy',
      testimonial: 'The DevOps placement program exceeded my expectations. The hands-on projects and industry-relevant curriculum prepared me well for senior-level positions.'
    },
    {
      name: 'Amit Verma',
      testimonial: 'As an experienced professional, I needed targeted technical upskilling. The program was flexible and the placement team understood my career goals perfectly.'
    },
    {
      name: 'Deepika Nair',
      testimonial: 'The certification support and background verification assistance made the transition smooth. I successfully moved to a Product Manager role with better compensation.'
    }
  ]

  const faqs = [
    {
      question: 'What are the payment terms for the placement program?',
      answer: 'We offer flexible payment options to suit your needs. You can choose from upfront payment with discounts, installment plans, or pay-after-placement options. Our team will work with you to find the best payment structure that fits your financial situation.'
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No, we maintain complete transparency in our pricing. All fees are clearly communicated upfront, and there are no hidden charges. The quoted price includes technical sessions, technical resources, certification support, and placement assistance.'
    },
    {
      question: 'What placement programs are currently available?',
      answer: 'We offer a wide range of placement programs including Java Backend Development, Full Stack Development, Cloud & DevOps, Data Science, AI/ML, and many more. New programs are added regularly based on industry demand. Please contact us for the most current list of available placement programs.'
    },
    {
      question: 'How long does the placement process take?',
      answer: 'The placement duration varies based on individual performance and market conditions. Typically, our candidates receive placement opportunities within 3-6 months after completing the program. We provide continuous support until you secure a suitable position.'
    },
    {
      question: 'What experience levels are eligible for your programs?',
      answer: 'Our programs are designed for both freshers and experienced professionals. We have specialized tracks for entry-level candidates as well as advanced programs for professionals looking to upskill or transition to new roles. Whether you are a recent graduate or have years of experience, we have a program suited for you.'
    },
    {
      question: 'Do you provide PAN India placements?',
      answer: 'Yes, we have a strong network of partner companies across India. We provide placement opportunities in major cities including Bangalore, Hyderabad, Chennai, Mumbai, Pune, Delhi, Noida, and many other locations. Our placement team works to match you with opportunities in your preferred location.'
    },
    {
      question: 'What salary expectations should I have?',
      answer: 'Salary expectations vary based on your experience level, the role, location, and company. Freshers typically receive competitive entry-level packages, while experienced professionals can expect significant salary improvements. We provide market insights and salary negotiation guidance to help you secure the best compensation.'
    },
    {
      question: 'What roles and technologies are covered in your placement programs?',
      answer: 'We cover a comprehensive range of roles including Java Development, Full Stack Development, Cloud Engineering, DevOps, Data Science, AI/ML, QA Automation, UI/UX Design, Mobile Development, and many more. Our curriculum is regularly updated to include the latest technologies and industry best practices.'
    }
  ]

  const skillsMetrics = [
    { role: 'Java Developer', percentage: 92 },
    { role: 'UI/UX Designer', percentage: 88 },
    { role: 'Embedded Systems Engineer', percentage: 85 },
    { role: 'Network Engineer', percentage: 90 },
    { role: 'System Administrator', percentage: 87 },
    { role: 'Automation Test Engineer', percentage: 89 },
    { role: 'Mobile App Developer', percentage: 91 },
    { role: 'Cloud Engineer', percentage: 93 }
  ]

  const placementLocations = {
    'South India': ['Bangalore', 'Hyderabad', 'Chennai', 'Coimbatore', 'Kochi', 'Mysore'],
    'North India': ['Delhi', 'Noida', 'Gurgaon', 'Chandigarh', 'Jaipur', 'Lucknow'],
    'East India': ['Kolkata', 'Bhubaneswar', 'Patna', 'Ranchi', 'Guwahati'],
    'West India': ['Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Nagpur', 'Indore']
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Accelerate Your Career Growth with
                <span className="text-primary-600"> Professional Placements</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Transform your career with our comprehensive placement programs and expert technical guidance. 
                We provide the skills, knowledge, and support you need to succeed in today's competitive job market.
              </p>
              <Link href="/about" className="btn-primary inline-block">
                Get Started
              </Link>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-full h-96 relative rounded-2xl shadow-2xl overflow-hidden bg-white">
                <img
                  src="/images/it-services-illustration.svg"
                  alt="IT Services - Software Development, Cloud Computing, AI, and Cybersecurity"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white px-3 sm:px-4 md:px-6 lg:px-8" id="about">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center leading-tight">
              About Us
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
              SagrowInfotech is a leading placement and technical consulting organization dedicated to empowering 
              professionals and freshers with industry-relevant skills and career opportunities. We 
              understand the challenges of transitioning from education to industry, and we're here 
              to bridge that gap with comprehensive support at every step of your journey.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Our Guidance Services</h3>
                <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Selection rounds preparation and coaching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Client interview preparation and mock sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Assessments and certification support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Background verification and onboarding assistance</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Placement & Technical Details</h3>
                <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Placement support typically completed within 3-6 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Currently offering Java Backend Development placement support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Programs available for freshers to experienced professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Flexible technical schedules to accommodate working professionals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (embedded) */}
      <section id="services">
        <Services />
      </section>

      {/* Career Kickstart Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              Kickstart Your Career
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 px-2">
              The gap between academic learning and industry requirements can be challenging to bridge. 
              Our skill-based placement programs are specifically designed to equip you with practical, 
              job-ready skills that employers value. We don't just guide you; we support you throughout 
              your placement journey, ensuring you're well-prepared for interviews and confident in your abilities.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed px-2">
              Whether you're starting fresh or looking to advance your career, our comprehensive approach 
              combines expert instruction, hands-on projects, and dedicated placement assistance to help 
              you achieve your professional goals.
            </p>
          </div>
        </div>
      </section>

      {/* Roles & Career Paths Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Roles & Career Paths
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
              Explore diverse career opportunities across multiple domains and technologies
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {roleCategories.map((category, index) => (
              <RoleCategory key={index} title={category.title} roles={category.roles} />
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Reviews Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 px-3 sm:px-4 md:px-6 lg:px-8" id="alumni-review">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Alumni Reviews
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
              Hear from our successful candidates who have transformed their careers
            </p>
          </div>

          {/* Freshers Reviews */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">Freshers Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {freshersReviews.map((review, index) => (
                <ReviewCard key={index} name={review.name} testimonial={review.testimonial} />
              ))}
            </div>
          </div>

          {/* Experienced Professionals Reviews */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">Experienced Professionals Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {experiencedReviews.map((review, index) => (
                <ReviewCard key={index} name={review.name} testimonial={review.testimonial} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white px-3 sm:px-4 md:px-6 lg:px-8" id="faq">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg text-gray-700 px-2">
                Find answers to common questions about our placement and technical services
              </p>
            </div>
            <div>
              {faqs.map((faq, index) => (
                <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-primary-600 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
              Why Choose Us
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-primary-100 leading-relaxed px-2">
              We are committed to your success. Our proven track record, industry expertise, and 
              personalized approach ensure that you receive the best placement and technical support. 
              We build confidence in our candidates through comprehensive preparation, real-world 
              projects, and continuous mentorship.
            </p>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-100 leading-relaxed px-2">
              Join thousands of successful professionals who have transformed their careers with us. 
              Your journey to a rewarding career starts here.
            </p>
            <button 
              onClick={openModal}
              className="bg-white text-primary-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block text-sm sm:text-base"
            >
              Start Your Career Journey
            </button>
          </div>
        </div>
      </section>

      {/* Skills/Success Metrics Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Success Metrics
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
              Our placement success rates across various roles and technologies
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 sm:space-y-6">
              {skillsMetrics.map((skill, index) => (
                <div key={index} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <span className="font-semibold text-sm sm:text-base text-gray-900">{skill.role}</span>
                    <span className="text-primary-600 font-bold text-sm sm:text-base">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                    <div
                      className="bg-primary-600 h-2 sm:h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white px-3 sm:px-4 md:px-6 lg:px-8" id="contact">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">Get in Touch</h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed px-2">Ready to take the next step in your career? We're here to help. Reach out to us and let's discuss how we can support your professional growth.</p>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200">
              <div className="space-y-4 sm:space-y-6 text-left">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Address</h3>
<p className="text-sm sm:text-base text-gray-700">
  Sagrow Infotech,<br />
  2nd Floor, Kesavan Apartment,<br />
  Opposite AARTI Scan Hospital,<br />
  Velachery, Chennai – 600042
</p>

                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Email</h3>
                  <a href="mailto:manoj@sagrowinfotech.com" className="text-primary-600 hover:text-primary-700 text-sm sm:text-base">manoj@sagrowinfotech.com</a>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Phone</h3>
                  <a href="tel:+91 883 888 8143" className="text-primary-600 hover:text-primary-700 text-sm sm:text-base">+91 861 037 1565</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placement Locations Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Placement Locations
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
              We provide PAN India placement coverage with opportunities across major cities
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Object.entries(placementLocations).map(([region, cities]) => (
              <div key={region} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-primary-600 mb-3 sm:mb-4">{region}</h3>
                <ul className="space-y-2">
                  {cities.map((city, index) => (
                    <li key={index} className="flex items-center text-gray-700 text-sm sm:text-base gap-2">
                      <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></span>
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-600 italic text-xs sm:text-sm px-2">
              * Additional cities and locations are added regularly based on opportunities
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  return <HomeContent />
}
