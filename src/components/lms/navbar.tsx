// components/lms/navbar.tsx
"use client"

import Link from "next/link"
import { BookOpen, Menu, User } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "../modeToogle"
import Image from "next/image"
import logo from "@/components/icons/logo_short.png"

export function Navbar() {
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-light">
          <Image src={logo} alt="logo" width={40} height={40} className="drop-shadow-lg"/>
          <span className="text-lg text-blue-950 dark:text-white">CS With Bari</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link href={link.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side: Account & Theme */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" onClick={()=>window.location.href="/login"}>
            <User className="mr-2 h-4 w-4" />
            Account
          </Button>
          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 p-4">
               <Link href="/" className="flex items-center gap-2 font-light">
                  <Image src={logo} alt="logo" width={40} height={40} className="drop-shadow-lg"/>
                  <span className="text-lg text-blue-950 dark:text-white">CS With Bari</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button variant="outline" className="w-30 justify-start"
                  onClick={()=>window.location.href="/login"}
                >
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
                <div className="pt-4">
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}