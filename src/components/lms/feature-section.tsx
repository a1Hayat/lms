// components/lms/feature-section.tsx
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import dashboard_dark from "@/components/images/dashboard_dark.png"
import dashboard_ligth from "@/components/images/dashboard_ligth.png"

export function FeatureSection() {


  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left Text */}
        <div className="space-y-6">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500">
            Learn Your Way
          </span>
          <h2 className="text-3xl font-bold tracking-tighter mt-2 sm:text-4xl">
            A Dashboard Built for Focus
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform is designed to be simple, intuitive, and powerful.
            Track your progress, resume your lessons, and interact with your
            peers all in one place.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-blue-500" />
              <span>Intuitive progress tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-blue-500" />
              <span>Access to all resources</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-blue-500" />
              <span>Community discussion forums</span>
            </li>
          </ul>
          <Button asChild size="lg">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>

          {/* Right Image */}
          <div className="relative">
            {/* Light mode image */}
            <Image
              src={dashboard_ligth}
              alt="dashboard light mode"
              className="rounded-lg dark:hidden border border-gray-200 hover:border-blue-300"
            />

            {/* Dark mode image */}
            <Image
              src={dashboard_dark}
              alt="dashboard dark mode"
              className="rounded-lg hidden dark:block border border-[#1f1f1f] hover:border-blue-900/30"
            />
          </div>
      </div>
    </section>
  )
}