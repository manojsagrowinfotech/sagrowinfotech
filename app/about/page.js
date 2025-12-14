import About, { metadata as aboutMetadata } from '@/components/About'

export const metadata = aboutMetadata || {
  title: 'About',
}

export default function AboutPage() {
  return <About />
}
