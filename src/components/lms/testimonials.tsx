// components/lms/testimonials.tsx
"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar" // Removed AvatarImage
import Autoplay from "embla-carousel-autoplay"

// --- NEW TESTIMONIALS ARRAY ---
// I've replaced the dummy data with your 13 testimonials
const testimonials = [
  {
    name: "Mohid Butt",
    initials: "MB",
    session: "May/June’24 & Oct/Nov’24",
    quote: `Studying with Sir Haseeb was hands down the best experience. The way he teaches P2? It’s like he has some kind of cheat code for making it easy... But the best part? He doesn’t just want us to pass he actually wants us to be better humans... He’s a 10/10 who I would definitely recommend.`,
  },
  {
    name: "Hamza Jatt",
    initials: "HJ",
    session: "Jan/March’23",
    quote: `Sir Haseeb Bari Gilani is one of the best computer teachers I have learnt from. He explains concepts in a very clear and simple way, making even difficult topics easy to understand. ...His friendly and approachable nature makes it easy to ask questions without hesitation. Overall, my experience learning from him was great...`,
  },
  {
    name: "Inshaal Sheeraz",
    initials: "IS",
    session: "May/June’22 & May/June’23",
    quote: `Studying with Sir Haseeb was an incredible experience. I was his student for almost 4 years and never once in that time was I disappointed. He always cleared my queries... and made sure everybody understood all of the concepts he taught. ...Overall, Sir Haseeb's dedication... made learning from him the best experience.`,
  },
  {
    name: "Muhammad Ali",
    initials: "MA",
    session: "May/June’19",
    quote: `I had the privilege of being taught by Sir Haseeb for both O & A-Level Computer Science... he played a crucial role in my success. Thanks to his dedication and expertise, I not only achieved my desired grades but exceeded them.
Beyond the classroom, his support has been invaluable... If you’re looking for a passionate... teacher, I cannot recommend anyone better than Sir Haseeb!`,
  },
  {
    name: "Muhammad Hassan Shahzad",
    initials: "MS",
    session: "Jan’25",
    quote: `Aslam Alaikum! I... am having a very good experience and all my concepts are clear. Sir Haseeb... taught us every single topic very thoroughly and also gave us recorded lectures and provided us with notes by which we can improve a lot to get an A*.`,
  },
  {
    name: "Hayyan Kamran",
    initials: "HK",
    session: "May/June’25",
    quote: `Sir Haseeb is an amazing teacher who makes even the toughest topics easy to understand. His way of teaching is simple, clear, and very effective. ...He also creates a friendly and comfortable learning environment... Learning from him has been a great experience...`,
  },
  {
    name: "Hassan Ali",
    initials: "HA",
    session: "Oct’24 & Jan’25",
    quote: `With Sir Haseeb, CS becomes a piece of cake... and before taking his session, I was about to quit CS because of not being able to find a teacher who can explain really good like Sir Haseeb does.`,
  },
  {
    name: "Haiqa Afeen",
    initials: "HA",
    session: "Roots IVY AS (Batch’25-26)",
    quote: `Sir Haseeb Gilani, an exceptional educator who makes complex concepts engaging and accessible. His classes are incredibly interactive... he goes above and beyond to ensure we grasp the material.
...Personally, I was an average computer science student, but Sir Haseeb's efforts transformed my learning experience. He made computer science way more interesting and easy for me... I highly recommend him...`,
  },
  {
    name: "Tamresh Wali",
    initials: "TW",
    session: "May/June’25",
    quote: `I am... taught Computer Science by Sir Haseeb, and I must say, it's been a game-changer! Before joining his class, Paper 2 seemed like an enormous challenge, but with his expert guidance, I've gained a deeper understanding... I'm working diligently towards achieving an A*. ...I've already decided to return to him for my A-levels.`,
  },
  {
    name: "Muhammad Mahad",
    initials: "MM",
    session: "Jan-March’25",
    quote: `I struggled alot in understanding pseudocode... but through enriched learning classes... of Sir Haseeb, I have been able to not just improve in solving simple questions but also in solving complex questions. Without doubt the best CS teacher out there!`,
  },
  {
    name: "Hajib Bin Naeem",
    initials: "HN",
    session: "May/June’24",
    quote: `Studying with Sir Haseeb has been an incredible experience. My CS grade was stuck at a B... but after starting lessons with him in my final year, I was able to improve to an A within just a few months. ...he is always more than happy to help. I highly recommend him...`,
  },
  {
    name: "Arshuman Anwar",
    initials: "AA",
    session: "May/June’25",
    quote: `Salaam! ...his humour, passion, the way he motivates the students and provides us the resources... are spectacular and unmatchable. I am fully confident that Inshallah I will get an A* in CS due to him. I’m grateful to have a teacher like him.`,
  },
  {
    name: "Hamza Jahangir",
    initials: "HJ",
    session: "May/June’23, May/June’24 & May/June’25",
    quote: `If I have to name any teacher who gave me individual attention even after having such a huge number of students... it will surely be Sir Haseeb. Tbh the efforts Sir Haseeb puts into the result of students is unmatchable. ...I have never seen any teacher organizing these many extra classes...`,
  },
]
export function Testimonials() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="container py-24 sm:py-32">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl">
        What Our Students Say
      </h2>
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-4xl mx-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.name} className="p-4 md:basis-1/2">
              {/* Set a min-height to ensure cards are the same size */}
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      {/* I removed AvatarImage since we don't have images.
                        The fallback with initials will be used.
                      */}
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      {/* --- ADDED THIS LINE --- */}
                      <p className="text-sm text-muted-foreground">
                        {testimonial.session}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grow">
                  {/* Added 'whitespace-pre-wrap' to respect newlines */}
                  <p className="italic text-muted-foreground whitespace-pre-wrap">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}