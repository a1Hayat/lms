// components/lms/feature-tree.tsx
"use client"

import { useRef } from "react"
import {
  Book,
  Bot,
  Box,
  LayoutGrid,
  Presentation,
  BookOpen,
} from "lucide-react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { FeatureItem } from "./feature-item" // (You should still have this)

// --- 1. MOVED STATS LOGIC HERE ---

// Stats data
const stats = [
  { value: "10,000+", label: "Students Enrolled" },
  { value: "50+", label: "Expert Instructors" },
  { value: "1,200+", label: "Hours of Content" },
  { value: "98%", label: "Completion Rate" },
]

// Animated Stats Component (for the "push" effect)
function StatsAnimated({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>
}) {
  // We'll animate the stats in at the very end of the scroll
  // When scrollYProgress is between 85% and 100%
  const opacity = useTransform(scrollYProgress, [0.85, 1], [0, 1])
  const scale = useTransform(scrollYProgress, [0.85, 1], [0.95, 1])

  return (
    <motion.div
      className="container py-24" // Added padding here
      style={{ opacity, scale }}
    >
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
        {stats.map((stat) => (
          // --- 2. BLUE BORDER STYLING ---
          <div
            key={stat.label}
            className="rounded-xl border border-blue-500/30 bg-background p-6 text-center shadow-sm transition-all hover:shadow-blue-500/10"
          >
            <h3 className="text-3xl font-bold tracking-tighter text-blue-500 sm:text-4xl">
              {stat.value}
            </h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// --- Original FeatureTree components below ---

// Features data
const features = [
  // ... (same as before)
  {
    icon: <LayoutGrid className="h-8 w-8 text-blue-500" />,
    title: "Courses",
    description: "In-depth video courses on every topic.",
  },
  {
    icon: <Book className="h-8 w-8 text-blue-500" />,
    title: "Resources",
    description: "Downloadable guides, notes, and assets.",
  },
  {
    icon: <Box className="h-8 w-8 text-blue-500" />,
    title: "Discounted Bundles",
    description: "Get the best value with curated bundles.",
  },
  {
    icon: <Bot className="h-8 w-8 text-blue-500" />,
    title: "AI Assistant",
    description: "Your personal AI tutor. (Coming Soon)",
  },
  {
    icon: <Presentation className="h-8 w-8 text-blue-500" />,
    title: "Physical Workshops",
    description: "Hands-on, in-person learning experiences.",
  },
]

// Main animated line
function AnimatedLine({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>
}) {
  // --- 3. ANIMATION TWEAK ---
  // Animate main line from 5% scroll to 90%
  // This lets it "finish" at the stats
  const scaleY = useTransform(scrollYProgress, [0.05, 0.9], [0, 1])
  return (
    <motion.div
      style={{ scaleY, transformOrigin: "top" }}
      className="absolute left-1/2 top-0 rounded -z-10 h-full w-1 -translate-x-1/2 bg-blue-500 "
    />
  )
}

// Main Component
export function FeatureTree() {
  const targetRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    // --- 4. OFFSET TWEAK ---
    // Track from when the top hits center, to when the *bottom* hits *end*
    // This gives us full scroll tracking for the longer component
    offset: ["start center", "end end"],
  })

  // Calculate "time slot" for each feature
  const numFeatures = features.length
  
  // --- 5. ANIMATION TWEAK ---
  // We'll run the feature animations between 15% and 85%
  // This leaves the last 15% for the stats animation
  const animationStartPoint = 0.15
  const animationEndPoint = 0.85 // <-- Was 0.95
  const totalAnimationDuration = animationEndPoint - animationStartPoint
  const step = totalAnimationDuration / numFeatures

  return (
    // This section now contains the Tree AND the Stats
    <section ref={targetRef} className="container relative py-24 sm:py-32">
      {/* Central Logo */}
      <div className="absolute left-1/2 top-16 z-10 -translate-x-1/2 rounded-full bg-background p-4 shadow-lg ring-2 ring-blue-500">
        <BookOpen className="h-12 w-12 text-blue-500" />
      </div>

      {/* The Animated Main Line */}
      <AnimatedLine scrollYProgress={scrollYProgress} />
      {/* Background static line (spans the whole section) */}
      <div className="absolute left-1/2 top-0 -z-20 h-full w-1 rounded -translate-x-1/2 bg-muted" />

      {/* Feature Items Grid */}
      <div className="relative pt-32">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12  md:grid-cols-2">
          {features.map((feature, index) => {
            const isRightSide = index % 2 !== 0
            const start = animationStartPoint + index * step
            const end = start + step
            const animationRange: [number, number] = [start, end]

            return (
              <FeatureItem
                key={feature.title}
                feature={feature}
                isRightSide={isRightSide}
                scrollYProgress={scrollYProgress}
                animationRange={animationRange}
              />
            )
          })}
        </div>
      </div>

      {/* --- 6. ADDED STATS COMPONENT --- */}
      {/* This is at the bottom of the section, sharing the same scrollYProgress */}
      <StatsAnimated scrollYProgress={scrollYProgress} />
    </section>
  )
}