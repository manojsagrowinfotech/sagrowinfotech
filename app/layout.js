import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContactModalProvider } from "@/components/ContactModalContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Sagrowinfotech - Professional Placement Services",
  description:
    "Transform your career with our comprehensive placement assistance. We bridge the gap between education and industry.",

  verification: {
    google: "yU4K7LxnzmfG9jaBcD9ZPRW0NjssiTXtrT85vQM1ink",
  },

  alternates: {
    canonical: "https://sagrowinfotech.com/",
  },
  openGraph: {
    title: "Sagrowinfotech - Professional Placement Services",
    description:
      "Transform your career with our comprehensive placement assistance. We bridge the gap between education and industry.",
    url: "https://sagrowinfotech.com/",
    siteName: "Sagrowinfotech",
    images: [
      {
        url: "https://sagrowinfotech.com/images/ai-placement-ecosystem.png",
        width: 1200,
        height: 630,
        alt: "Sagrowinfotech",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagrowinfotech - Professional Placement Services",
    description:
      "Transform your career with our comprehensive placement assistance. We bridge the gap between education and industry.",
    images: ["https://sagrowinfotech.com/images/ai-placement-ecosystem.png"],
  },
  icons: {
    icon: "/images/logo-sagrowinfotech-badge.svg",
    shortcut: "/images/logo-sagrowinfotech-badge.svg",
    apple: "/images/logo-sagrowinfotech-badge.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ContactModalProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ContactModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
