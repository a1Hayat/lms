"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type TodayOrder = {
  order_id: number;
  student_name: string;
  item_title: string;
  final_amount: number;
  payment_status: "pending" | "paid" | "failed";
  processed_by_name: string | null;
  created_at: string;
};

export const columns: ColumnDef<TodayOrder>[] = [
  {
    accessorKey: "order_id",
    header: "Order #",
  },
  {
    accessorKey: "student_name",
    header: "Student",
  },
  {
    accessorKey: "item_title",
    header: "Item",
  },
  {
    accessorKey: "final_amount",
    header: "Amount",
    cell: ({ row }) => `Rs ${row.original.final_amount}`,
  },
  // {
  //   accessorKey: "payment_status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const status = row.original.payment_status;
  //     const variant =
  //       status === "paid"
  //         ? "success"
  //         : status === "pending"
  //         ? "warning"
  //         : "destructive";
  //     return (
  //       <Badge variant={variant } className="capitalize">
  //         {status}
  //       </Badge>
  //     );
  //   },
  // },
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
    accessorKey: "processed_by_name",
    header: "Processed By",
    cell: ({ row }) => row.original.processed_by_name || "N/A",
  },
  {
    accessorKey: "created_at",
    header: "Time",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];