"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { resources } from "../../../../../types/resources"
import Edit_Resource from "./edit"
import { AlertDialogDelete } from "./delete"

// Helper component to safely use hooks like useState
const ActionCell = ({ resource }: { resource: resources }) => {
  const [edit, setEdit] = useState(false)
  const [Delete, setDelete] = useState(false)
  const [isLoading, SetIsloading] = useState(false)
  
  // REMOVED: Unused 'alert' state to fix the "no-unused-vars" warning.

  const handleDelete = async () => {
    SetIsloading(true);
    
    try {
      const res = await fetch("/api/resources/delete-resource", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource_id: resource.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete resource");
      }

      // Reload window on success
      window.location.reload(); 
    } catch (error) {
      // FIXED: Removed ': any' to fix the "no-explicit-any" error.
      // We check if it is a standard Error object to safely access the message.
      console.error("Delete failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      // Since we removed the unused custom alert state, you can use a browser alert 
      // or a Toast notification (like sonner) here to notify the user.
      alert(`Error: ${errorMessage}`);
    } finally {
      SetIsloading(false);
    }
  };

  return (
    <DropdownMenu>
      <Edit_Resource
        isOpen={edit}
        onClose={()=>setEdit(false)}
        resource_id={resource.id}
      />
      <AlertDialogDelete
        isOpen={Delete}
        onClose={()=>setDelete(false)}
        loading={isLoading}
        onConfirm={handleDelete}
      />
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
          <span className="text-red-500 dark:text-red-700" onClick={()=>setDelete(true)}>Delete</span>
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