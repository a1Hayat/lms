"use client"

import { ColumnDef } from "@tanstack/react-table"
import { users } from "../../../../../../types/users"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { IconEdit, IconEye, IconFilePlus, IconTrash } from "@tabler/icons-react"
import Edit_Student from "./edit_student"
import { useState } from "react"

// Helper component to safely use hooks like useState
const ActionCell = ({ user }: { user: users }) => {
  const [edit, setEdit] = useState(false)

  return (
    <>
      <Edit_Student
        isOpen={edit}
        onClose={() => setEdit(false)}
        user_id={user.id}
        user_role={user.role}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEdit(true)} className="cursor-pointer">
            <IconEdit className="mr-2 h-4 w-4" /> 
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <IconEye className="mr-2 h-4 w-4" /> 
            <span>View Enrollments</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <IconFilePlus className="mr-2 h-4 w-4" /> 
            <span>Assign Course / Resource</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-500 dark:text-red-700 cursor-pointer focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20">
            <IconTrash className="mr-2 h-4 w-4" /> 
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const students: ColumnDef<users>[] = [
   {
    id: "user_name",
    header: "Full Name",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-md overflow-hidden">
            <AvatarImage
              src={user.image}
              alt='img'
              className="h-full w-full object-cover"
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
    accessorKey: "institution",
    header: "Institution",
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
    cell: ({ row }) => <ActionCell user={row.original} />,
  },
]