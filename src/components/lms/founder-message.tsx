import Image from "next/image"
import avatar from "@/components/images/haseeb.jpeg"

export function FounderMessage() {
  return (
    <section className="bg-muted rounded-lg py-24 dark:bg-muted/50">
      <div className="container flex flex-col items-center text-center">
        <div className="w-30 h-30 rounded-full overflow-hidden border-4 border-background shadow-lg">
          <Image src={avatar} alt="Founder" width={150} height={150} />
        </div>

        <blockquote className="mt-8 max-w-3xl text-xl font-medium italic sm:text-2xl">
          “Our mission is to make Computer Science simple, engaging, and achievable for every student. Through personalized support and clear, focused teaching, we help learners build confidence and excel in their exams and future careers.”
        </blockquote>

        <p className="mt-6 font-semibold">Haseeb Bari Gilani</p>
        <p className="text-sm text-muted-foreground">Founder, CSWithBari</p>
      </div>
    </section>
  )
}
