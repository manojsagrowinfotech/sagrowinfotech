'use client'

import Link from 'next/link'
import { useState } from 'react'
import FAQAccordion from '@/components/FAQAccordion'
import ReviewCard from '@/components/ReviewCard'
import RoleCategory from '@/components/RoleCategory'
import Services from '@/components/Services'
import ContactModal from '@/components/ContactModal'
import { useContactModal } from '@/components/ContactModalContext'

function HomeContent() {
  const { openModal } = useContactModal()
  const [heroImageError, setHeroImageError] = useState(false)
  
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
  
const placementLogos = [
  { name: "TCS", src: "/images/logos/tcs.svg" },
  { name: "Infosys", src: "/images/logos/infosys.svg" },
  { name: "Wipro", src: "/images/logos/wipro.svg" },
  { name: "Tech Mahindra", src: "/images/logos/tech-mahindra.svg" },
  { name: "Accenture", src: "/images/logos/accenture.svg" },
  { name: "Amazon", src: "/images/logos/amazon.svg" },
  { name: "Flipkart", src: "/images/logos/flipkart.svg" },
];

  return (
    <div>
      {/* Hero Section */}
<section className="relative min-h-[90vh] md:min-h-[100vh] flex flex-col justify-center px-4 sm:px-6 lg:px-12 overflow-hidden">
  
  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="/images/ai-placement-ecosystem.png"
      alt="AI Placement Ecosystem"
      className="w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-800/70 to-primary-700/60" />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto w-full">
    <div className="max-w-2xl text-center md:text-left">

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
        Accelerate Your Career Growth with
        <span className="block text-primary-200">
          Precision Talent Placements
        </span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
        Our placement infrastructure integrates technical skill verification,
        domain intelligence, and enterprise hiring pipelines to deliver scalable,
        high-confidence talent placements.
      </p>

      {/* CTA */}
      <div className="flex justify-center md:justify-start">
        <button
          onClick={openModal}
          className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 shadow-lg transition-all duration-200"
        >
          Get Started
        </button>
      </div>

    </div>
  </div>
</section>

<section className="bg-white py-2 sm:py-3 overflow-hidden w-full">
  <div className="relative w-full overflow-hidden">

    <div className="flex w-max animate-marquee items-center">
      {[...placementLogos, ...placementLogos].map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-center px-3 sm:px-5"
        >
          <img
            src={item.src}
            alt={item.name}
            className="
              h-5           /* Mobile */
              sm:h-6        /* Small tablets */
              md:h-7      /* Desktop */
              lg:h-8      /* Large screens */
              w-auto
              opacity-85
              hover:opacity-100
              transition-opacity duration-300
            "
            loading="lazy"
            onError={(e) =>
              (e.currentTarget.src = "/images/logo-full.svg")
            }
          />
        </div>
      ))}
    </div>

  </div>

  <style jsx>{`
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    .animate-marquee {
      animation: marquee 45s linear infinite;
      will-change: transform;
    }

    @media (max-width: 640px) {
      .animate-marquee {
        animation-duration: 65s;
      }
    }
  `}</style>
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
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Get in Touch</h2>
            <p className="text-base sm:text-lg text-gray-700 mt-3 sm:mt-4 leading-relaxed px-2">
              Ready to take the next step in your career? We're here to help. Reach out to us and let's discuss how we can support your professional growth.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200">
              <div className="space-y-4 sm:space-y-6 text-left">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Address</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700">
                    Sagrow Infotech,<br />
                    2nd Floor, Kesavan Apartment,<br />
                    Opposite AARTI Scan Hospital,<br />
                    Velachery, Chennai – 600042
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Email</h3>
                  </div>
                  <a href="mailto:manoj@sagrowinfotech.com" className="text-primary-600 hover:text-primary-700 text-sm sm:text-base">manoj@sagrowinfotech.com</a>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2a2 2 0 012 2v3a2 2 0 01-2 2H4l-1 1a12 12 0 006 6l1-1v-1a2 2 0 012-2h3a2 2 0 012 2v2a2 2 0 01-2 2h-1C10.477 21 3 13.523 3 5z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Phone</h3>
                  </div>
                  <a href="tel:+91 883 888 8143" className="text-primary-600 hover:text-primary-700 text-sm sm:text-base">+91 861 037 1565</a>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  title="Sagrow Infotech Location"
                  src="https://maps.google.com/maps?q=Velachery%20Chennai%20600042&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-3 sm:p-4 text-right">
                <a
                  href="https://maps.app.goo.gl/tf73zQeSSjucmZnu5?g_st=awb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm sm:text-base"
                >
                  Open in Google Maps
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 3h7v7M21 3l-9 9" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21H3v-7" />
                  </svg>
                </a>
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
