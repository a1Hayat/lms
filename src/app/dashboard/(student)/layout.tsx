
import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { MenuUser } from "@/components/menu-user"
import { ModeToggle } from "@/components/modeToogle"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  IconMenu2,
  IconBook,
  IconLibrary,
  IconShoppingBag,
  IconCompass,
  IconBrandParsinta,
  IconBook2,
} from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import logo from '@/components/icons/logo.png'
import ProtectedRoute from "@/components/auth/protectedRoute"

export const metadata: Metadata = {
  title: "Dashboard | CSWithBari",
  description: "Student LMS Dashboard",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  const user = session?.user
    ? {
        name: session.user.name || "Student",
        email: session.user.email || "student@example.com",
        avatar: session.user.image || "/avatars/default.jpg",
        role: "student",
      }
    : {
        name: "Guest",
        email: "guest@example.com",
        avatar: "/avatars/default.jpg",
        role: "guest",
      }

  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <ProtectedRoute allowedRoles={["student"]}>
          <SidebarProvider>
            <SidebarInset>
              {/* 🧭 Top Navigation Bar */}
              <header className="flex items-center justify-between h-16 border-b bg-background px-4 sm:px-6">
                {/* LEFT: Logo + Desktop Menu */}
                <div className="flex items-center gap-4">
                  {/* Mobile Hamburger Menu */}
                  <div className="md:hidden">
                    <MobileMenu user={user} />
                  </div>

                  {/* Logo */}
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src={logo}
                      alt="CSWithBari Logo"
                      width={60}
                      height={60}
                      priority
                      className="rounded-md select-none"
                    />
                  </Link>

                  {/* Desktop Menubar */}
                  
                 

                  <Menubar className="hidden md:flex bg-transparent border-none shadow-none">

                     <MenubarMenu>
                      <MenubarTrigger>Dashboard</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem asChild>
                          <Link href="/dashboard">Home</Link>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger>Courses</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem asChild>
                          <Link href="/dashboard/my-courses">My Courses</Link>
                        </MenubarItem>
                        <MenubarItem asChild>
                          <Link href="/dashboard/browse-courses">Browse Courses</Link>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                      <MenubarTrigger>Resources</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem asChild>
                          <Link href="/dashboard/my-resources">My Resources</Link>
                        </MenubarItem>
                        <MenubarItem asChild>
                          <Link href="/dashboard/browse-resources">Browse Resources</Link>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>

<<<<<<< HEAD
=======
                    <MenubarMenu>
                      <MenubarTrigger>Bundles</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem asChild>
                          <Link href="/dashboard/bundles">Browse</Link>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                    
>>>>>>> 6ad786e49aee854d19a6663a23e50c99a7d80348
                  </Menubar>
                </div>

                {/* CENTER: Greeting */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-2 text-sm">
                  <Separator orientation="vertical" className="h-4" />
                  
                </div>

                {/* RIGHT: User Menu + Theme */}
                <div className="flex items-center gap-4">
                  <MenuUser user={user} />
                  <ModeToggle />
                </div>
              </header>

              {/* 🌐 Main Page Content */}
              <main className="flex flex-1 flex-col gap-4 p-6">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      </body>
    </html>
  )
}

/* 📱 Mobile Menu Component */
function MobileMenu({ user }: { user: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2  hover:bg-accent rounded-md">
          <IconMenu2 className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 sm:w-72">
        <div className="mt-6 flex flex-col gap-4 text-sm font-medium pl-5">
            <p className="">Menu</p>
          <Separator/>
          <Link
            href="/courses"
            className="flex items-center gap-2 hover:text-primary"
          >
            <IconBrandParsinta size={18} /> Courses
          </Link>
          <Link
            href="/resources"
            className="flex items-center gap-2 hover:text-primary"
          >
            <IconBook2 size={18} /> Resources
          </Link>
          <Link
            href="/purchased"
            className="flex items-center gap-2 hover:text-primary"
          >
            <IconShoppingBag size={18} /> Purchased
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 hover:text-primary"
          >
            <IconCompass size={18} /> Explore
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
