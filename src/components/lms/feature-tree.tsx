'use client'
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 1. DATA
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
      "Explore high-quality A/O Level IGCSE Computer Science materials—courses, worksheets, notes, and past papers.",
    icon: "🛍️",
  },
  {
    title: "Learn at Your Own Pace",
    description:
      "Understand programming, algorithms, and theory topics with easy-to-follow lessons and guided practice.",
    icon: "💡",
  },
  {
    title: "Get an A*",
    description:
      "Boost your confidence, master every topic, and walk into your exams fully prepared to achieve that A*.",
    icon: "🏆",
  },
];

// 2. BLUE ARROW ICON
const BlueArrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-blue-600 dark:text-blue-500 w-4 h-4 sm:w-5 sm:h-5 mt-2"
  >
    <path d="M5 3l14 9-14 9V3z" />
  </svg>
);

// 3. MAIN COMPONENT
export default function FeatureTree() {
  return (
    <section className="w-full py-16 lg:py-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 grid-rows-1 gap-4">
    <div ><h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white">
              How Does <br />
              <span className="text-blue-600 dark:text-blue-500">CS With Bari</span> <br />
              Work?
            </h2>
            <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-md">
              Smash your exams with this 4-step formula for success!
            </p>
            <div className="mt-8">
              <Button
                onClick={()=>window.location.href="/dashboard"}
              >
                Start Learning
              </Button>
            </div></div>
    <div >{steps.map((step, index) => (
              <div key={index} className="flex items-start gap-6 relative mt-4">
                
                {/* ICON + LINE + ARROW */}
                <div className="flex flex-col items-center">
                 <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 
                      bg-gray-100 dark:bg-[#1f1f1f] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] text-2xl
                      shadow-sm transition duration-300
                      hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-300/50">
                    {step.icon}
                  </div>




                  {/* Arrow */}
                  {index !== steps.length - 1}

                  {/* Vertical line */}
                  {index !== steps.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 dark:bg-gray-800 mt-1"></div>
                  )}
                </div>

                {/* TEXT */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}</div>
</div>
      </div>

      

    
    </section>
  );
}
