import React from "react";
import Image from "next/image"; // We'll use this for your icons
import Link from "next/link";

// ----------------------------------------------------------------------
// 1. DEFINE YOUR DATA HERE
// ----------------------------------------------------------------------
const steps = [
  {
    title: "Complete Your Registration",
    description:
      "Get started by registering for your account and unlock access to top-tier Computer Science resources.",
    // REPLACE with your actual image path, e.g., "/images/register-icon.png"
    imageSrc: "/icons/register.png", 
    alt: "Registration Icon",
  },
  {
    title: "Buy a Course or Resource",
    description:
      "Explore a range of high-quality A/O Level IGCSE Computer Science materials—courses, worksheets, notes, and past papers tailored to your syllabus.",
    imageSrc: "/icons/bag.png", 
    alt: "Course Icon",
  },
  {
    title: "Learn at Your Own Pace",
    description:
      "Understand programming, algorithms, and theory topics with easy-to-follow lessons and guided practice.",
    imageSrc: "/icons/bulb.png", 
    alt: "Learning Icon",
  },
  {
    title: "Get an A*",
    description:
      "Boost your confidence, master every topic, and walk into your exams fully prepared to achieve that A*.",
    imageSrc: "/icons/badge.png", 
    alt: "Success Icon",
    isLast: true,
  },
];

// ----------------------------------------------------------------------
// 2. HELPER COMPONENTS
// ----------------------------------------------------------------------

// The blue triangle arrow > seen in the image
const BlueArrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-blue-600 dark:text-blue-500 w-4 h-4 sm:w-5 sm:h-5 transform rotate-90 lg:rotate-0"
  >
    <path d="M5 3l14 9-14 9V3z" />
  </svg>
);

// ----------------------------------------------------------------------
// 3. MAIN COMPONENT
// ----------------------------------------------------------------------

export function FeatureTree() {
  return (
    <section className="relative w-full py-16 lg:py-24 bg-transparent transition-colors duration-300">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* --- LEFT COLUMN: Sticky Title & CTA --- */}
          <div className="flex flex-col justify-center h-full lg:sticky lg:top-24">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
              How Does <br />
              <span className="text-blue-600 dark:text-blue-500">
                CS With Bari
              </span>{" "}
              <br />
              Work?
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-md">
              Smash your exams with this 4-step formula for success! ✅
            </p>
            
            <div className="mt-8">
              <Link
                href="/courses" // Update this to your actual courses link
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20"
              >
                Start Learning
              </Link>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Vertical Timeline --- */}
          <div className="relative flex flex-col gap-0 pt-4">
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
                
                {/* Timeline Line (Dashed) */}
                {!step.isLast && (
                  <div className="absolute left-9 top-16 bottom-0 w-px border-l-2 border-dashed border-gray-200 dark:border-gray-800 hidden sm:block" />
                )}

                {/* Icon Wrapper */}
                <div className="relative z-10 shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    {/* IMAGE HANDLING:
                       If you have the real images in public/ folder, use this:
                    */}
                    {/* <Image 
                      src={step.imageSrc} 
                      alt={step.alt} 
                      width={40} 
                      height={40} 
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    /> 
                    */}

                    {/* PLACEHOLDER (Remove this block when you uncomment Image above) */}
                    <div className="text-2xl">
                        {index === 0 && "📝"}
                        {index === 1 && "🛍️"}
                        {index === 2 && "💡"}
                        {index === 3 && "🏆"}
                    </div>
                    {/* END PLACEHOLDER */}
                  </div>
                  
                  {/* Small decorative triangle/arrow near icon (Optional visual flair) */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 block sm:hidden">
                     {!step.isLast && <BlueArrow />}
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col pt-2 sm:pt-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                  
                  {/* Desktop Arrow Indicator between steps (Visual Flair) */}
                  {!step.isLast && (
                     <div className="absolute right-0 -bottom-4 hidden">
                        {/* You can add extra decoration here if needed */}
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}