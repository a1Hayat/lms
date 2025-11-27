import React from 'react';
import { Quote, User } from 'lucide-react';
import avatar from "@/components/images/haseeb.jpeg"
import Image from 'next/image';
// NOTE: In your Next.js project, keep your original imports:
// import Image from "next/image"
// import avatar from "@/components/images/haseeb.jpeg"

export default function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans text-slate-900">
      <FounderMessage />
    </div>
  );
}

export function FounderMessage() {
  return (
    // Section: Reduced padding on mobile (py-12), larger on desktop (md:py-24)
    <section className="bg-gray-100 rounded-lg py-12 md:py-24 dark:bg-[#0f0f0f] w-full transition-all duration-300">
      {/* Container: Added px-4 for side margins on mobile */}
      <div className="container mx-auto flex flex-col items-center text-center px-4">
        
        {/* Image Container: 
            - Responsive width/height: w-24 (mobile) -> w-32 (desktop) 
            - Added shadow and border for better visuals
        */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
          {/* NOTE: Replaced Next.js <Image> with standard <img> for this preview.
             In your code, restore: <Image src={avatar} alt="Founder" fill className="object-cover" />
          */}
                   <Image src={avatar} alt="Founder" width={150} height={150} />

        </div>

        {/* Quote Block: 
            - Responsive text: text-lg (mobile) -> text-xl (tablet) -> text-2xl (desktop)
            - Adjusted max-width for better reading line length
        */}
        <blockquote className="relative mt-6 md:mt-8 max-w-3xl text-lg md:text-xl lg:text-2xl font-medium italic text-slate-700 dark:text-slate-300 leading-relaxed">
           <span className="text-slate-300 absolute -top-4 -left-2 md:-left-8 text-4xl md:text-6xl" aria-hidden="true">“</span>
          Our mission is to make Computer Science simple, engaging, and achievable for every student. Through personalized support and clear, focused teaching, we help learners build confidence and excel in their exams and future careers.
          <span className="text-slate-300 absolute -bottom-4 -right-2 md:-right-8 text-4xl md:text-6xl" aria-hidden="true">”</span>
        </blockquote>

        {/* Founder Info: Adjusted spacing and text sizes */}
        <div className="mt-6 md:mt-8">
          <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            Haseeb Bari Gilani
          </p>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">
            Founder, CSWithBari
          </p>
        </div>
      </div>
    </section>
  );
}
