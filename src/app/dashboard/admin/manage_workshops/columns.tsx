"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit2, Trash2, MapPin, Video, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconEdit, IconTrash } from "@tabler/icons-react"

export type Workshop = {
  id: number
  session_name: string
  type: "online" | "physical"
  workshop_date: string
  location: string
  status: "opened" | "closed"
}

export const createColumns = (
  onEdit: (workshop: Workshop) => void,
  onDelete: (id: number) => void
): ColumnDef<Workshop>[] => [
  {
    accessorKey: "session_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Session Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <span className="font-medium text-slate-900 dark:text-slate-100">
        {row.getValue("session_name")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <div className="flex items-center gap-2 capitalize text-slate-600 dark:text-slate-300">
          {type === "online" ? (
            <Video className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          ) : (
            <MapPin className="h-4 w-4 text-orange-500 dark:text-orange-400" />
          )}
          {type}
        </div>
      )
    },
  },
  {
    accessorKey: "workshop_date",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("workshop_date"))
      return (
        <span className="text-slate-600 dark:text-slate-300">
          {date.toLocaleString()}
        </span>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span
        className="text-slate-500 dark:text-slate-400 truncate max-w-[200px] block"
        title={row.getValue("location")}
      >
        {row.getValue("location")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const isOpen = status === "opened"

      return (
        <Badge
          variant={isOpen ? "default" : "secondary"}
          className={
            isOpen
              ? "bg-green-100 border-green-700 text-green-700 dark:border-green-500 dark:text-green-500  dark:bg-green-600/20"
              : "bg-yellow-100 border-yellow-700 text-yellow-700 dark:border-yellow-500 dark:text-yellow-500  dark:bg-yellow-600/20"

          }
        >
          {status.toUpperCase()}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const workshop = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
                <IconEdit/> <button onClick={() => onEdit(workshop)}>Edit</button>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>

            <DropdownMenuItem>
                <IconTrash className="text-red-500 dark:text-red-700"/> <button 
                    onClick={() => onDelete(workshop.id)}
                 className="text-red-500 dark:text-red-700">Delete</button>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
