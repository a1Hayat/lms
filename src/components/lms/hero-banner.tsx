// components/lms/hero-banner.tsx
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import banner_2 from "@/components/images/banners/banner_2.png"

export function HeroBanner() {
  return (
    <section id="home" className="mt-10">
      {/* <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
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
      </div> */}
      <Image 
        src={banner_2} alt="banner" 
        height={400}
        className="rounded-lg flex justify-self-center"/>
    </section>
  )
}