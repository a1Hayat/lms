"use client"

import {
  IconLogout,
  IconSettings,
  IconDotsVertical,
  IconCreditCard,
  IconHistoryToggle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useState } from "react"
import Loader from "@/components/loader"
import BankTransferModal from "./bank_details_modal"
import HomeBankTransferModal from "./home_bank_details_modal"

type User = {
  name: string
  email: string
  avatar: string
  role: string
}

export function MenuUser({ user }: { user: User }) {
  const [loading, setLoading] = useState(false)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  
  const handleLogout = async () => {
    setLoading(true)
    await signOut({ callbackUrl: "/login" })
  }

  if (loading) return <Loader isLoading={true} className="h-screen" />

  return (
    <DropdownMenu>
      <HomeBankTransferModal
          isOpen={isBankModalOpen}
          onClose={()=>setIsBankModalOpen(false)}
          whatsappNumber="+92 332 4040614"
        />
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-md"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {user.role}
            </span>
          </div>
          <IconDotsVertical className="ml-auto size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-56 rounded-lg"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
              <span className="text-xs text-muted-foreground capitalize truncate">
                {user.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
           <DropdownMenuItem>
            <IconHistoryToggle className="mr-2 size-4" />
            <button onClick={()=>window.location.href='/dashboard/orders'}>Order History</button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconCreditCard className="mr-2 size-4" />
            <button onClick={()=>setIsBankModalOpen(true)}>Payment Instructions</button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconSettings className="mr-2 size-4" />
            <button onClick={()=>window.location.href='/dashboard/settings'}>Settings</button>

          </DropdownMenuItem>
          
         
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <IconLogout className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
