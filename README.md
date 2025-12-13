# SAGROINFOTECH - Professional Training & Placement Services Website

A modern, responsive website built with Next.js for SAGROINFOTECH, offering comprehensive training programs and placement assistance services.

## 🚀 Features

- **Responsive Design**: Fully responsive website that works seamlessly on all devices
- **Modern UI**: Built with Tailwind CSS for a clean and professional look
- **Contact Form**: Integrated contact form with email functionality using Nodemailer
- **Multiple Pages**:
  - Home page with hero section, services overview, and testimonials
  - About page with mission, vision, and core values
  - Services page showcasing training programs across various domains
- **Interactive Components**:
  - FAQ Accordion
  - Contact Modal
  - Review Cards
  - Role Categories

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **React**: 18.2.0
- **Styling**: Tailwind CSS 3.3.5
- **Email Service**: Nodemailer 6.9.7
- **Language**: JavaScript

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/manojsagrowinfotech/sagrowinfotech.git
cd sagrowinfotech
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
CONTACT_RECEIVER=receiver@example.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

```
sagrowinfotech-website-main/
├── app/
│   ├── about/
│   │   └── page.js          # About page
│   ├── api/
│   │   └── contact/
│   │       └── route.js     # Contact form API endpoint
│   ├── services/
│   │   └── page.js          # Services page
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout
│   └── page.js              # Home page
├── components/
│   ├── ContactForm.js       # Contact form component
│   ├── ContactModal.js      # Contact modal component
│   ├── FAQAccordion.js      # FAQ accordion component
│   ├── Footer.js            # Footer component
│   ├── Navbar.js            # Navigation bar component
│   ├── ReviewCard.js        # Review card component
│   └── RoleCategory.js      # Role category component
├── public/
│   └── images/              # Static images and assets
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── jsconfig.json
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables in Vercel dashboard:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `CONTACT_RECEIVER` (optional)
6. Click "Deploy"

Vercel will automatically detect Next.js and configure the build settings.

### Build for Production

```bash
npm run build
npm start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

The following environment variables are required for the contact form to work:

| Variable | Description | Required |
|----------|-------------|----------|
| `SMTP_HOST` | SMTP server hostname | Yes |
| `SMTP_PORT` | SMTP server port (e.g., 587, 465) | Yes |
| `SMTP_USER` | SMTP authentication username/email | Yes |
| `SMTP_PASS` | SMTP authentication password | Yes |
| `CONTACT_RECEIVER` | Email address to receive contact form submissions | No (defaults to SMTP_USER) |

## 📧 Contact Form

The contact form sends emails using Nodemailer. If SMTP is not configured, the form will still accept submissions but won't send emails (useful for development).

## 🎨 Customization

- **Colors**: Edit `tailwind.config.js` to customize the color scheme
- **Content**: Update page components in the `app/` directory
- **Components**: Modify reusable components in the `components/` directory
- **Styling**: Global styles can be modified in `app/globals.css`

## 📄 License

This project is private and proprietary.

## 👥 Contact

For inquiries, please contact:
- Email: manojsagrowinfotech@gmail.com
- Website: [SAGROINFOTECH](https://sagrowinfotech.com)

---

Built with ❤️ using Next.js

