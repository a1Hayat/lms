"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { AppAlert } from "@/components/alerts";

// 1. Define Interface
interface CashPortalOrder {
  id: number;
  final_amount: number;
  payment_status: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
  item?: {
    type: string;
    title: string;
  };
}

export default function CashPortalPage() {
  const [orderId, setOrderId] = useState("");
  // 2. Fix State Type
  const [order, setOrder] = useState<CashPortalOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);

    try {
      const res = await fetch("/api/fetch-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: Number(orderId) }),
      });

      const data = await res.json();

      if (!data.success) {
        setAlert({
          show: true,
          type: "error",
          title: "Order Not Found",
          description: data.message,
        });
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch {
      // 3. Removed unused 'err'
      setAlert({
        show: true,
        type: "error",
        title: "Server Error",
        description: "Could not fetch order.",
      });
    }

    setLoading(false);
  };

  const handleMarkPaid = async () => {
    if (!order) return;
    setProcessing(true);

    try {
      const res = await fetch("/api/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id }),
      });

      const data = await res.json();

      if (!data.success) {
        setAlert({
          show: true,
          type: "error",
          title: "Failed ",
          description: data.message,
        });
      } else {

        await fetch("/api/send-mail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: order.user?.email,
            subject: "Your Order is Confirmed - CSWithBari",
            type: "Enrollment",
            payload: {
              name: order.user?.name,
              itemName: order.item?.title,
              orderId: order.id
            }
          })
        });

        setAlert({
          show: true,
          type: "success",
          title: "Payment Verified",
          description: "Student enrolled successfully.",
        });
        setOrder(null);
        setOrderId("");
      }
    } catch {
      // 4. Removed unused 'err'
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        description: "Unable to mark paid.",
      });
    }

    setProcessing(false);
  };

  return (
    <div className="px-6 py-10 mt-16 w-[60%] mx-auto">
      <AppAlert
        open={alert.show}
        type={alert.type}
        title={alert.title}
        description={alert.description}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <h1 className="text-2xl font-bold mb-6">Cash Portal</h1>

      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Button onClick={fetchOrder} disabled={loading}>
          {loading ? <Loader isLoading={true} className="" /> : "Search"}
        </Button>
      </div>

     {order && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-neutral-900 space-y-2 mt-4">
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Student:</b> {order.user?.name}</p>
          <p><b>Email:</b> {order.user?.email}</p>
          <p><b>Phone:</b> {order.user?.phone}</p>

          <p><b>Item Type:</b> {order.item?.type}</p>
          <p><b>Item Title:</b> {order.item?.title}</p>

          <p><b>Amount:</b> Rs {order.final_amount}</p>
          <p><b>Status:</b> {order.payment_status}</p>

          {order.payment_status !== "paid" && (
            <Button
              className="w-full mt-3 bg-green-600 hover:bg-green-700"
              onClick={handleMarkPaid}
              disabled={processing}
            >
              {processing ? <Loader isLoading={true} className=""/> : "Mark as Paid & Enroll"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}