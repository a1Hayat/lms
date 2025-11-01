"use client"

import { ColumnDef } from "@tanstack/react-table"
import { users } from "../../../../../../types/users"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { IconArrowsMaximize, IconBasket, IconEdit, IconEye, IconFilePlus, IconTrash } from "@tabler/icons-react"
import { Separator } from "@radix-ui/react-separator"
import Edit_Student from "./edit_admin"
import { useState } from "react"
import Edit_Admin from "./edit_admin"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const admin_users: ColumnDef<users>[] = [
   {
    id: "user_name",
    header: "Full Name",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={user.image}
              alt='img'
              height={30}
              width={30}
              className="rounded-md"
            />
          </Avatar>
          <span>{user.name ?? "—"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ getValue }) => {
      const dateString = getValue<string>()
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString))

      return <span>{formatted}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const [edit, setEdit] = useState(false)
      return (
        <DropdownMenu>
          <Edit_Admin
            isOpen={edit}
            onClose={()=>setEdit(false)}
            user_id={user.id}
            user_role={user.role}
          />
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
                <IconEdit/> <button onClick={()=>setEdit(true)}>Edit</button>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <IconEye/> <button>View Courses / Resources</button>
            </DropdownMenuItem>


            <DropdownMenuSeparator/>

            <DropdownMenuItem>
                <IconTrash className="text-red-500 dark:text-red-700"/> <button className="text-red-500 dark:text-red-700">Delete</button>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

