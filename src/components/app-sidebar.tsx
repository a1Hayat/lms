import * as React from "react"
import logo from '@/components/icons/logo.png'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { NavUser } from "./nav-users"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { IconBoxMultiple, IconBrandParsinta, IconCast, IconCreditCard, IconGauge, IconHistoryToggle, IconMessagePause, IconSchool } from "@tabler/icons-react"
import { NavMain } from "./nav-main"

// Local interface to safely access the extended session properties
interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
}

// This is sample data.
const data = {
  navMain: [
      {
    title: "Dashboard",
    url: "/dasboard/admin",
    icon: IconGauge,
    items: [
      { title: "Home", url: "/dashboard/admin" },
    ],
  },
  {
    title: "Manage Users",
    url: "#",
    icon: IconSchool,
    items: [
      { title: "Students", url: "/dashboard/admin/students" },
      { title: "Admin", url: "/dashboard/admin/admin_users" },
      { title: "Cash", url: "/dashboard/admin/cash_users" },
    ],
  },

    {
      title: "Manage Courses",
      url: "#",
      icon: IconBrandParsinta,
      items: [
        {
          title: "Courses",
          url: "/dashboard/admin/courses",
        },
         { title: "Enrollments", url: "#" },
        {
          title: "Add New Course",
          url: "/dashboard/admin/courses/add",
        },
      ],
    },
        {
      title: "Manage Resources",
      url: "#",
      icon: IconBrandParsinta,
      items: [
        {
          title: "Resources",
          url: "/dashboard/admin/resources",
        },
         { title: "Enrollments", url: "#" },
        {
          title: "Add New",
          url: "/dashboard/admin/resources/add",
        },
      ],
    },
    {
      title: "Manage Bundles",
      url: "#",
      icon: IconBoxMultiple,
      items: [
        {
          title: "Bundles",
          url: "/dashboard/admin/bundles",
        },
        {
          title: "Add New",
          url: "/dashboard/admin/add_bundle",
        },
      ],
    },
    {
      title: "Manage Workshops",
      url: "#",
      icon: IconCast,
      items: [
        {
          title: "Workshops",
          url: "/dashboard/admin/manage_workshops",
        },
        {
          title: "Submissions",
          url: "/dashboard/admin/manage_workshops/registrations",
        },
      ],
    },
    {
      title: "Billing",
      url: "#",
      icon: IconCreditCard,
      items: [
        {
          title: "Cash Payments",
          url: "#",
        },
        {
          title: "Online Payments",
          url: "#",
        },
      ],
    },
    {
      title: "Orders History",
      url: "#",
      icon: IconHistoryToggle,
      items: [
        {
          title: "Cash Orders",
          url: "/dashboard/admin/order",
        },
      ],
    },
  ],
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await getServerSession(authOptions)

  // FIX: Map session data to the shape expected by NavUser
  // NavUser expects { name, email, avatar, role }, but NextAuth gives { name, email, image }
  const user = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "guest@example.com",
    avatar: session?.user?.image || "/avatars/default.jpg",
    // Use the local ExtendedUser interface instead of casting to 'any'
    role: (session?.user as ExtendedUser)?.role || "guest",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div >
                  <Image alt="logo" src={logo} height={45} width={45} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Admin | CSWithBari</span>
                  <span className="">v1.0.0</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}/>
          <SidebarMenuButton asChild className="px-4">
              <a href='/dashboard/admin/submissions'>
                <IconMessagePause />
                <span>Contact Submissions</span>
              </a>
            </SidebarMenuButton>
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>

  )
}