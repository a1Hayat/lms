"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { contact_submission } from "../../../../../types/contact-submissions";

export const Contactcolumns: ColumnDef<contact_submission>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "created_at",
    header: "Time",
    cell: ({ row }) =>
      new Date(row.original.submitted_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];