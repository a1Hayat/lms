// components/lms/feature-item.tsx
"use client"

import { motion, MotionValue } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AnimatedSubBranch } from "./animated-sub-branch"

// Define a type for the feature object
type Feature = {
  icon: React.ReactNode
  title: string
  description: string
}

interface Props {
  feature: Feature
  isRightSide: boolean
  scrollYProgress: MotionValue<number>
  animationRange: [number, number] // The scroll range to animate in
}

export function FeatureItem({
  feature,
  isRightSide,
  scrollYProgress,
  animationRange,
}: Props) {
  return (
    // This is the main container that handles the fade-in
    <motion.div
      className={`relative ${isRightSide ? "md:pl-12" : "md:pr-12"} ${
        isRightSide ? "md:text-left" : "md:text-right"
      }`}
      // 1. Fade-in animation
      initial={{ opacity: 0, x: isRightSide ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {/* 2. Add the Animated Sub-branch */}
      <AnimatedSubBranch
        scrollYProgress={scrollYProgress}
        range={animationRange}
        isRightSide={isRightSide}
      />

      {/* 3. Add Hover Animation to the card wrapper */}
      <motion.div
        className="h-full"
        whileHover={{ scale: 1.03, y: -5 }} // Lifts and scales the card
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Card className="h-full shadow-lg dark:shadow-black/20">
          <CardHeader
            className={`flex ${
              // On mobile, icon is always on left
              isRightSide ? "flex-row" : "flex-row-reverse"
            } items-center gap-4`}
          >
            <div className="shrink-0 rounded-lg bg-blue-500/10 p-3">
              {feature.icon}
            </div>
            <div className="flex-1">
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </motion.div>
  )
}