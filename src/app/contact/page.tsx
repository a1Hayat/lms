"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/lms/navbar"
import {
  IconLocationFilled,
  IconMailFilled,
  IconPhoneFilled,
} from "@tabler/icons-react"
// --- (Assuming this is your alert component's path) ---
import { AppAlert } from "@/components/alerts"

export default function ContactPage() {
  // --- Form State ---
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  // --- UI State (Loading and Alerts) ---
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  // --- Updated handleSubmit to call the API ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setAlert({ ...alert, show: false }) // Hide previous alert

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await response.json()

      if (response.ok) {
        // --- SUCCESS ---
        setAlert({
          show: true,
          type: "success",
          title: "Message Sent!",
          description: "We'll get back to you as soon as possible.",
        })
        // Clear the form
        setName("")
        setEmail("")
        setMessage("")
      } else {
        // --- SERVER ERROR ---
        setAlert({
          show: true,
          type: "error",
          title: "Submission Error",
          description: data.error || "Something went wrong. Please try again.",
        })
      }
    } catch (error) {
      // --- NETWORK ERROR ---
      console.error("Form submission error:", error)
      setAlert({
        show: true,
        type: "error",
        title: "Network Error",
        description: "An unexpected error occurred. Please check your connection.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-7">
      <Navbar />

      {/* --- ALERT COMPONENT --- */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <AppAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          open={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      </div>

      <div className="container mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-base max-w-2xl mx-auto">
            Have questions or need assistance? We&apos;re here to help. Reach out to
            our support team anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Send us a message
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Fill out the form and we&apos;ll get back to you shortly.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 text-sm"
                    disabled={isLoading} // --- Added disabled state
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 text-sm"
                    disabled={isLoading} // --- Added disabled state
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-xs font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="mt-1 text-sm"
                    rows={4}
                    disabled={isLoading} // --- Added disabled state
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-sm py-3"
                  disabled={isLoading} // --- Added disabled state
                >
                  {/* --- Added loading text --- */}
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info Card (No changes) */}
          <div className="flex flex-col rounded-2xl bg-linear-to-br from-blue-700 to-purple-800 p-8 text-white shadow-xl">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p className="mt-1 text-blue-100 text-sm">
              Reach out to us through any of the following channels:
            </p>

            <div className="mt-8 space-y-6">
              {/* Phone */}
              <div className="flex items-start">
                <IconPhoneFilled className="h-6 w-6 opacity-90" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Call Us</h3>
                  <p className="mt-0.5 text-blue-100 text-xs">
                    Speak directly with our support team.
                  </p>
                  <div className="">
                  <a
                    href="tel:+923324040614"
                    className="mt-1 mr-3 inline-block text-sm font-semibold text-white hover:text-blue-200 transition"
                  >
                    +92 332 4040614
                  </a>
                  <a
                    href="tel:+923351400368"
                    className="mt-1 inline-block text-sm font-semibold text-white hover:text-blue-200 transition"
                  >
                    +92 335 1400368
                  </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <IconMailFilled className="h-6 w-6 opacity-90" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Email Us</h3>
                  <p className="mt-0.5 text-blue-100 text-xs">
                    Send us your queries and we&apos;ll respond soon.
                  </p>
                  <a
                    href="mailto:cswithbari.com"
                    className="mt-1 inline-block text-sm font-semibold text-white hover:text-blue-200 transition"
                  >
                    cswithbari@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start">
                <IconLocationFilled className="h-6 w-6 opacity-90" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Our Location</h3>
                  <p className="mt-0.5 text-blue-100 text-xs leading-relaxed">
                    Vision Academy Johar Town, <br/>
                    Vision Academy Garden Town, <br/>
                    Vision Academy DHA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}