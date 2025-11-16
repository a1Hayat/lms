"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
// --- FIX: Corrected component import paths ---
import Loader from "../../../../components/loader";
import { AppAlert } from "../../../../components/alerts";
// --- END FIX ---
import { columns, Order } from "./columns";
import { DataTable } from "./data-table";
import { AiAgentComingSoon } from "@/components/ai-coming-soon";
import { AiAgentAlert } from "@/components/ai-agent-alert";

export default function StudentOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({
    show: false,
    type: "error" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // Fetch orders when the user session is available
  useEffect(() => {
    if (status === "authenticated") {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/students-orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: session.user.id }),
          });

          const data = await res.json();

          if (!data.success) {
            setAlert({
              show: true,
              type: "error",
              title: "Error",
              description: data.message,
            });
          } else {
            setOrders(data.orders);
          }
        } catch {
          setAlert({
            show: true,
            type: "error",
            title: "Server Error",
            description: "Could not load your orders.",
          });
        }
        setLoading(false);
      };

      fetchOrders();
    }
  }, [status, session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader isLoading={true} className="" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <AppAlert
        open={alert.show}
        type={alert.type}
        title={alert.title}
        description={alert.description}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <h1 className="text-2xl font-bold mb-6">My Order History</h1>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}