"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AppAlert } from "@/components/alerts";
import Loader from "@/components/loader";

export default function CheckoutPage() {
  const { token } = useParams();
  const { data: session, status } = useSession();

  const [itemId, setItemId] = useState<number | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // ✅ Decode token → get course id
  useEffect(() => {
    if (!token) return;

    const decode = async () => {
      const res = await fetch("/api/courses/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (data.success && data.courseId) {
        setItemId(data.courseId);
      } else {
        window.location.href = "/dashboard";
      }
    };

    decode();
  }, [token]);

  // ✅ Fetch course + user info
  useEffect(() => {
    if (!itemId || status !== "authenticated") return;

    const fetchCourse = async () => {
      const res = await fetch("/api/courses/fetch-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: itemId }),
      });

      const data = await res.json();
      if (data.success) setCourse(data.course);
    };

    const fetchUser = async () => {
      const res = await fetch("/api/users/fetch-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session?.user?.id }),
      });

      const data = await res.json();
      setUserInfo(data.user_info?.[0]);
    };

    Promise.all([fetchCourse(), fetchUser()]).then(() => setLoading(false));
  }, [itemId, status, session]);

  // ✅ Auto-check if already purchased
  useEffect(() => {
    if (!itemId || !userInfo) return;

    const checkPurchase = async () => {
      const res = await fetch("/api/check-enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session?.user?.id, course_id: itemId }),
      });

      const data = await res.json();

      if (data.purchased) {
        setAlreadyPurchased(true);

        setAlert({
          show: true,
          type: "warning",
          title: "Already Purchased ✅",
          description:
            data.reason === "already_enrolled"
              ? "You are already enrolled in this course."
              : "You have already placed an order for this course.",
        });

        setTimeout(() => (window.location.href = "/dashboard"), 1400);
      }
    };

    checkPurchase();
  }, [itemId, userInfo, session]);

  // ✅ Submit order
  const handleSubmit = async () => {
    if (!itemId || !userInfo) return;

    setPlacingOrder(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemId,
          type: "course",
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
        }),
      });

      const data = await res.json();

      setAlert({
        show: true,
        type: "success",
        title: "Order Placed 🎉",
        description: data.message || "Your cash order has been recorded.",
      });

      setTimeout(() => (window.location.href = `/dashboard`), 1500);
    } catch {
      setAlert({
        show: true,
        type: "error",
        title: "Failed ❌",
        description: "Order could not be placed. Try again.",
      });
    }

    setPlacingOrder(false);
  };

  // ✅ While fetching
  if (loading || alreadyPurchased) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader isLoading={true} />
      </div>
    );
  }

  return (
    <>
      {/* ✅ Global Alert */}
      <AppAlert
        type={alert.type}
        title={alert.title}
        description={alert.description}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="mt-20 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white dark:bg-[#0f0f0f] rounded-xl shadow-lg p-6 grid md:grid-cols-2 gap-6">
          
          {/* ✅ Left — User Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Your Order
            </h2>

            <div className="space-y-3 mb-4">
              <Input value={userInfo.name} disabled />
              <Input value={userInfo.email} disabled />
              <Input value={userInfo.phone ?? ""} disabled />
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={placingOrder}
            >
              {placingOrder && <Loader isLoading={placingOrder} />}
              {placingOrder ? "Placing..." : "Confirm Cash Order"}
            </Button>
          </div>

          {/* ✅ Right — Order Summary */}
          <div className="bg-gray-100 dark:bg-[#1f1f1f] p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Order Summary
            </h3>

            <div className="space-y-2 text-gray-800 dark:text-gray-200">
              <p><strong>Course:</strong> {course.title}</p>
              <p><strong>Price:</strong> Rs {course.price}</p>
              <p><strong>Payment Method:</strong> Cash</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pay at center. Access will be activated after verification.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
