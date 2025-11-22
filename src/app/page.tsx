// app/page.tsx
import { Navbar } from "@/components/lms/navbar"
import { HeroBanner } from "@/components/lms/hero-banner"
import FeatureTree  from "@/components/lms/feature-tree" // <--- It lives here now
import { FeatureSection } from "@/components/lms/feature-section"
import { FounderMessage } from "@/components/lms/founder-message"
import { Testimonials } from "@/components/lms/testimonials"
import { Footer } from "@/components/lms/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col px-7">
      <Navbar />
      <HeroBanner />
      <FeatureTree/>
      {/* <FeatureTree /> */}
      <FeatureSection />
      <FounderMessage />
      <Testimonials />
      <Footer />
    </main>
  )
}