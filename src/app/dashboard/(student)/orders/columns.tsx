"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// This type is used to define the shape of our data.
export type Order = {
  id: number
  item_title: string
  item_type: string
  final_amount: number
  payment_status: "pending" | "paid" | "failed"
  created_at: string
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "item_title",
    header: "Item",
  },
  {
    accessorKey: "item_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("item_type") as string
      return <Badge variant="outline">{type}</Badge>
    }
  },
  {
    accessorKey: "final_amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("final_amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PKR",
      }).format(amount)
      // Displaying as "Rs. {amount}" for consistency
      return <div>Rs {amount}</div>
    }
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
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return <div>{date.toLocaleDateString()}</div>
    }
  },
]