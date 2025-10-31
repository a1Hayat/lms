"use client"

import { ColumnDef } from "@tanstack/react-table"
import { courses } from "../../../../../types/courses"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { IconArrowsMaximize, IconBasket, IconEdit, IconEye, IconFilePlus, IconTrash } from "@tabler/icons-react"
import { Separator } from "@radix-ui/react-separator"
import { useState } from "react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const Courses: ColumnDef<courses>[] = [
   {
    id: "title",
    header: "Title",
    cell: ({ row }) => {
      const course = row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={course.thumbnail}
              alt='img'
              height={30}
              width={30}
              className="rounded-md"
            />
          </Avatar>
          <span>{course.title}</span>
        </div>
      )
    },
  },

  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "students_enrolled",
    header: "Enrolled",
  },
  {
    accessorKey: "instructor_id",
    header: "Instructor",
  },
  {
    accessorKey: "created_at",
    header: "Registered at",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original
      const [edit, setEdit] = useState(false)
      return (
        <DropdownMenu>
          {/* <Edit_Admin
            isOpen={edit}
            onClose={()=>setEdit(false)}
            user_id={user.id}
            user_role={user.role}
          /> */}
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

