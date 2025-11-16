// components/lms/animated-sub-branch.tsx
"use client"

import { motion, MotionValue, useTransform } from "framer-motion"

interface Props {
  scrollYProgress: MotionValue<number>
  range: [number, number] // e.g., [0, 0.2] for the first item
  isRightSide: boolean
}

export function AnimatedSubBranch({
  scrollYProgress,
  range,
  isRightSide,
}: Props) {
  // Animate scaleX from 0 to 1 as we scroll
  const scaleX = useTransform(scrollYProgress, range, [0, 1])
  
  // Set origin for the "grow" animation
  const transformOrigin = isRightSide ? "left" : "right"
  
  // This is the positioning for the whole branch component
  const positionClass = isRightSide ? "left-0" : "right-0"

  return (
    // **********************************************************
    // ** THE FIX: `positionClass` must be on this parent div **
    // **********************************************************
    <div
      className={`absolute top-8 hidden h-px w-12 md:block ${positionClass}`}
    >
      {/* 1. Static background line (no position class needed) */}
      <div className="h-full w-full bg-muted" />

      {/* 2. Animated fill line (absolute to its parent, no position class) */}
      <motion.div
        style={{ scaleX, transformOrigin }}
        className="absolute top-0 h-full w-full bg-blue-500"
      />
    </div>
  )
}