"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { resources } from "../../../../../types/resources"

// Helper component to safely use hooks like useState
const ActionCell = ({ resource }: { resource: resources }) => {
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
        <DropdownMenuItem onClick={() => setEdit(true)} className="cursor-pointer">
          <IconEdit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20">
          <IconTrash className="mr-2 h-4 w-4 text-red-500 dark:text-red-700" />
          <span className="text-red-500 dark:text-red-700">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const ResourcesColumns: ColumnDef<resources>[] = [
  {
    accessorKey: 'title',
    header: "Title",
    cell: ({ row }) => {
      const resource = row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded overflow-hidden">
            <AvatarImage
              src={resource.thumbnail}
              alt="img"
              className="h-full w-full object-cover"
            />
          </Avatar>
          <span>{resource.title}</span>
        </div>
      )
    },
  },
  {
  accessorKey: "level",
  header: "Level",
  cell: ({ getValue }) => {
    const level = getValue<string>();

    const formattedLevel =
      level === "o-level"
        ? "O Level | IGCSE"
        : level === "as-level"
        ? "AS Level | A-1"
        : level === "a-level"
        ? "A Level | A-2"
        : level; // fallback

    return <span>{formattedLevel}</span>;
  },
},

  {
    accessorKey: "price",
    header: "Price",
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
    cell: ({ row }) => <ActionCell resource={row.original} />,
  },
]