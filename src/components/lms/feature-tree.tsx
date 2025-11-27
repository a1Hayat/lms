'use client'

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Steps...
const steps = [
  {
    title: "Complete Your Registration",
    description:
      "Get started by registering for your account and unlock access to top-tier Computer Science resources.",
    icon: "📝",
  },
  {
    title: "Buy a Course or Resource",
    description:
      "Explore high-quality A/O Level IGCSE Computer Science materials—courses, worksheets, notes, and past papers。",
    icon: "🛍️",
  },
  {
    title: "Learn at Your Own Pace",
    description:
      "Understand programming, algorithms, and theory topics with easy-to-follow lessons and guided practice。",
    icon: "💡",
  },
  {
    title: "Get an A*",
    description:
      "Boost your confidence, master every topic, and walk into your exams fully prepared to achieve that A*。",
    icon: "🏆",
  },
];

const StepArrow = () => (
  <svg
    className="w-6 h-6 text-blue-500 dark:text-blue-400 mt-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function FeatureTree() {
  // Fix: Type the ref properly
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const line = timelineRef.current;

    // Fix: Add null check
    if (!line) return;

    const handleScroll = () => {
      const rect = line.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress within the component
      const totalHeight = rect.height;
      const scrolled = windowHeight - rect.top;

      const percentage = Math.min(Math.max(scrolled / totalHeight, 0), 1);
      setProgress(percentage);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              How Does <br />
              <span className="text-blue-600 dark:text-blue-500">CS With Bari</span> <br />
              Work?
            </h2>
            <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-md">
              Smash your exams with this 4-step formula for success!
            </p>
            <div className="mt-8">
              <Button onClick={() => (window.location.href = "/dashboard")}>
                Start Learning
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">

            {/* <-- THIS IS THE MAGIC LINE --> */}
            <div
              ref={timelineRef}
              className="absolute xl:left-9 left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed transition-all duration-300"
              style={{
                borderColor: `rgb(
                  ${200 - progress * 150},   /* Red reduces → becomes bluer */
                  ${200 - progress * 150},   /* Green reduces */
                  ${200 + progress * 55}     /* Blue increases */
                )`,
                filter: `drop-shadow(0 0 ${progress * 6}px rgba(59,130,246,0.7))`,
              }}
            ></div>

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative flex items-start gap-6">

                  {/* ICON */}
                  <div className="relative z-10">
                    <div className="
                      flex items-center justify-center 
                      w-16 h-16 sm:w-20 sm:h-20 
                      bg-gray-100 dark:bg-[#1f1f1f] 
                      rounded-2xl border border-gray-200 dark:border-[#1f1f1f]
                      text-2xl shadow-sm
                    ">
                      {step.icon}
                    </div>
                  </div>

                  {/* TEXT */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>


                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}