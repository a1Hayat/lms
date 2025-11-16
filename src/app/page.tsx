// app/page.tsx

import { Navbar } from "@/components/lms/navbar"
import { HeroBanner } from "@/components/lms/hero-banner"
import { FeatureTree } from "@/components/lms/feature-tree" // This now includes stats
// import { Stats } from "@/components/lms/stats" // <-- 1. REMOVE THIS
import { FeatureSection } from "@/components/lms/feature-section"
import { FounderMessage } from "@/components/lms/founder-message"
import { Testimonials } from "@/components/lms/testimonials"
import { Footer } from "@/components/lms/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col px-7">
      <Navbar />
      <HeroBanner />
      <FeatureTree /> {/* 2. This is all you need */}
      {/* <Stats /> */}{" "}
      {/* 3. REMOVE THIS LINE */}
      <FeatureSection />
      <FounderMessage />
      <Testimonials />
      <Footer />
    </main>
  )
}