"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Bundle } from "../../../../../../types/bundles";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
// import Edit_Bundle from "./edit-bundle";

// Extracted component to allow safe usage of hooks like useState
const ActionCell = ({ bundle }: { bundle: Bundle }) => {
  const [edit, setEdit] = useState(false)

  return (
    <>
      {/* <Edit_Bundle
        isOpen={edit}
        onClose={() => setEdit(false)}
        bundle_id={bundle.id}
      /> */}
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

export const bundles_cols: ColumnDef<Bundle>[] = [
   {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "discount_price",
    header: "Discounted Price",
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
    cell: ({ row }) => <ActionCell bundle={row.original} />,
  },
]