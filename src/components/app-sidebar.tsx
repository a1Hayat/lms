
import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import logo from '@/components/icons/logo.png'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { NavUser } from "./nav-users"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { IconAdjustmentsCog, IconBook, IconBook2, IconBrandParsinta, IconCardboards, IconCreditCard, IconGauge, IconSchool } from "@tabler/icons-react"
import { NavMain } from "./nav-main"
import { Separator } from "./ui/separator"

// This is sample data.
const data = {
    user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  
  navMain: [
      {
    title: "Dashboard",
    url: "/dasboard/admin",
    icon: IconGauge,
    items: [
      { title: "Home", url: "#" },
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
      icon: IconBook2,
      items: [
        {
          title: "Resources",
          url: "#",
        },
        {
          title: "Add New",
          url: "#",
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
      title: "Admin Controls",
      url: "#",
      icon: IconAdjustmentsCog,
      items: [
        {
          title: "Manage Users",
          url: "#",
        },
        {
          title: "Add New",
          url: "#",
        },
      ],
    },
  ],
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await getServerSession(authOptions)

  // Fallback user info if no session
  const user = session?.user || {
    name: "Guest",
    email: "guest@example.com",
    image: "/avatars/default.jpg",
  }
  return (
    // <Sidebar {...props}>
      
    // </Sidebar>
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>

  )
}
