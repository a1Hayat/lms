// components/lms/hero-banner.tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroBanner() {
  return (
    <section id="home" className="container py-24 text-center sm:py-32">
      <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        The Future of Learning is Here
      </h1>
      <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
        Unlock your potential with our expert-led courses, hands-on workshops,
        and powerful AI tools.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button asChild size="lg">
          <Link href="#courses">Explore Courses</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="#about">Learn More</Link>
        </Button>
      </div>
    </section>
  )
}