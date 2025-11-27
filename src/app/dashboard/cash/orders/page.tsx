"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader";
import { AppAlert } from "@/components/alerts";
import { Input } from "@/components/ui/input";

// 1. Define Interface
interface CashOrder {
  order_id: number;
  user: {
    name: string;
    email: string;
  };
  item_title: string;
  final_amount: number;
  created_at: string;
}

export default function CashOrdersHistoryPage() {
  const { data: session, status } = useSession();
  
  // 2. Fix State Types
  const [orders, setOrders] = useState<CashOrder[]>([]);
  const [filtered, setFiltered] = useState<CashOrder[]>([]);
  
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({
    show: false,
    type: "error" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // 3. Use useCallback to fix dependency warning
  const fetchOrders = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);

      const res = await fetch("/api/cash-orders", {
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
        setFiltered(data.orders);
      }
    } catch {
      setAlert({
        show: true,
        type: "error",
        title: "Server Error",
        description: "Could not load orders",
      });
    }

    setLoading(false);
  }, [session?.user?.id]);

  // ✅ Fetch when auth ready
  useEffect(() => {
    if (status === "authenticated") fetchOrders();
  }, [status, fetchOrders]); // Added fetchOrders dependency

  // ✅ Search Logic
  useEffect(() => {
    const f = orders.filter((o) =>
      o.user.name.toLowerCase().includes(search.toLowerCase()) ||
      (o.item_title && o.item_title.toLowerCase().includes(search.toLowerCase())) ||
      String(o.order_id).includes(search)
    );
    setFiltered(f);
  }, [search, orders]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader isLoading={true} className="" />
      </div>
    );

  return (
    <div className="p-6 mt-16">
      <AppAlert
        open={alert.show}
        type={alert.type}
        title={alert.title}
        description={alert.description}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <h1 className="text-2xl font-bold mb-6">Cash Orders History</h1>

      <div className="max-w-md mb-4">
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-neutral-900">
            <tr>
              <th className="p-3 text-left">Order #</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}

            {filtered.map((o) => (
              <tr key={o.order_id} className="border-b dark:border-neutral-800">
                <td className="p-3 font-medium">{o.order_id}</td>
                <td className="p-3">
                  {o.user.name}
                  <div className="text-xs text-gray-500">{o.user.email}</div>
                </td>
                <td className="p-3">{o.item_title || "—"}</td>
                <td className="p-3">Rs {new Intl.NumberFormat('en-PK').format(o.final_amount)}</td>
                <td className="p-3">
                  <span className="text-green-600 font-semibold">Paid</span>
                </td>
                <td className="p-3 text-xs">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}