"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

// Define the shape of our order data
export type Order = {
  id: number
  created_at: string
  final_amount: number
  payment_status: "pending" | "paid" | "failed"
  item_title: string
  user: {
    name: string
    email: string
  }
  processed_by_user: {
    name: string | null
  }
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "user.name", // This key is used for filtering
    header: "Student",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "item_title",
    header: "Item Purchased",
  },
  {
    accessorKey: "final_amount",
    header: "Amount",
    cell: ({ row }) => {
      return `Rs ${row.getValue("final_amount")}`
    },
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("payment_status") as string
      
      let badgeClass = ""
      switch (status) {
        case "paid":
          badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300";
          break;
        case "pending":
          badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300";
          break;
        case "failed":
          badgeClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300";
          break;
        default:
          badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-300";
      }

      return <Badge variant="outline" className={`capitalize ${badgeClass}`}>{status}</Badge>
    },
  },
  {
    accessorKey: "processed_by_user.name",
    header: "Processed By",
    cell: ({ row }) => {
      return row.original.processed_by_user?.name || "N/A"
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString()
    },
  },
]