"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Bundle } from "../../../../../../types/bundles";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { IconArrowsMaximize, IconBasket, IconEdit, IconEye, IconFilePlus, IconTrash } from "@tabler/icons-react"
import { Separator } from "@radix-ui/react-separator"
import { useState } from "react"
import Edit_Bundle from "./edit-bundle";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


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
    cell: ({ row }) => {
      const bundle = row.original
      const [edit, setEdit] = useState(false)
      return (
        
        <DropdownMenu>
        <Edit_Bundle
          isOpen={edit}
          onClose={()=>setEdit(false)}
          bundle_id={bundle.id}
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

