// components/lms/footer.tsx
import { Facebook, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logo from "@/components/icons/logo_short.png"

export function Footer() {
  return (
    <footer id="contact" className="border-t">
      <div className="container grid gap-8 px-4 py-12 md:grid-cols-4 md:px-6">

        {/* Logo & Message */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 font-light">
            <Image 
              src={logo} 
              alt="CS With Bari Logo" 
              width={40} 
              height={40} 
              className="drop-shadow-lg"
            />
            <span className="text-lg text-blue-950 dark:text-white">CS With Bari</span>
          </Link>

          <p className="text-sm mt-2">
            The Shortcut to O/A Level Computer Science
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2 text-sm">
          <h4 className="font-semibold">Quick Links</h4>
          <Link href="#home" className="text-muted-foreground hover:text-foreground">Home</Link>
          <Link href="#courses" className="text-muted-foreground hover:text-foreground">Courses</Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground">About</Link>
        </div>

        {/* Policies */}
        <div className="flex flex-col gap-2 text-sm">
          <h4 className="font-semibold">Site Policies</h4>
          <Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">Terms & Conditions</Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">Payment Policy</Link>
        </div>

        {/* Socials */}
        <div className="flex gap-4 md:justify-self-end">
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Facebook className="h-6 w-6" />
            <span className="sr-only">Facebook</span>
          </Link>

          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>

          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Youtube className="h-6 w-6" />
            <span className="sr-only">YouTube</span>
          </Link>
        </div>
      </div>

      {/* Bottom CC Line */}
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CSWithBari. All rights reserved. | Powered by KareLogix
      </div>
    </footer>
  )
}
