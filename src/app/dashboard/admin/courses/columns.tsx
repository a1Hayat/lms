"use client"

import { ColumnDef } from "@tanstack/react-table"
import { courses } from "../../../../../types/courses"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { useState } from "react"

export const Courses: ColumnDef<courses>[] = [
  {
    accessorKey: 'title',
    header: "Title",
    cell: ({ row }) => {
      const course = row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={course.thumbnail}
              alt="img"
              height={30}
              width={30}
              className="rounded"
            />
          </Avatar>
          <span>{course.title}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "level",
    header: "Level",
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
    accessorkey:'lessons',
    header:'Lessons'
  },
  {
    accessorKey: "instructor_id",
    header: "Instructor",
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
      const course = row.original
      const [edit, setEdit] = useState(false)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEdit(true)}>
              <IconEdit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <IconTrash className="mr-2 h-4 w-4 text-red-500 dark:text-red-700" />
              <span className="text-red-500 dark:text-red-700">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
