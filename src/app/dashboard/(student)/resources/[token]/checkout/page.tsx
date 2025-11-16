"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AppAlert } from "@/components/alerts";
import Loader from "@/components/loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const { token } = useParams();
  const { data: session, status } = useSession();

  const [itemId, setItemId] = useState<number | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash")

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
      const res = await fetch("/api/resources/fetch-resource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource_id: itemId }),
      });

      const data = await res.json();
      if (data.success) setCourse(data.resource);
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
      const res = await fetch("/api/check-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session?.user?.id, resource_id: itemId }),
      });

      const data = await res.json();

      if (data.purchased) {
        setAlreadyPurchased(true);

        setAlert({
          show: true,
          type: "warning",
          title: "Already Purchased",
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
          type: "resource",
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          paymentMethod
        }),
      });

      const data = await res.json();
      
      
      setAlert({
        show: true,
        type: "success",
        title: "Order Placed ",
        description: data.message || "Your cash order has been recorded.",
      });

      setTimeout(() => (window.location.href = `/dashboard/orders`), 1500);
    } catch {
      setAlert({
        show: true,
        type: "error",
        title: "Failed",
        description: "Order could not be placed. Try again.",
      });
    }

    setPlacingOrder(false);
  };


  if (loading || alreadyPurchased) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader isLoading={true} className=""/>
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
              <Input value={userInfo.institution ?? ""} disabled />
              <p className="text-sm py-3 flex justify-self-center">Information not correct? <Button 
              onClick={()=> window.location.href="/dashboard/settings"}
              variant={'link'} className="-m-2 underline">Change now</Button></p>
            </div>

            <Button
              className="w-full bg-blue-600 capitalize hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={placingOrder}
            >
              {placingOrder && <Loader isLoading={placingOrder} className=""/>}
              {placingOrder ? "Placing..." : `Confirm ${paymentMethod} Order`}
            </Button>
          </div>

          {/* ✅ Right — Order Summary */}
          <div className=" p-5 border-l">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Order Summary
            </h3>

            <div className="space-y-2 text-gray-800 dark:text-gray-200">
              <p><strong>Course:</strong> {course.title}</p>
              <p><strong>Price:</strong> Rs {course.price}</p>
              <p className="capitalize"><strong>Payment Method:</strong> {paymentMethod}</p>
              <RadioGroup
                defaultValue="cash"
                className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-3"
                // 3. Set the value from your state
                value={paymentMethod}
                // 4. Update the state whenever the value changes
                onValueChange={(newValue) => setPaymentMethod(newValue)}
              >
                {/* Option 1: Cash (Default) */}
                <Label
                  htmlFor="cash"
                  className="flex cursor-pointer rounded-lg"
                >
                  <Card className="w-full border-2 border-muted bg-popover transition-all [&:has([data-state=checked])]:border-primary">
                    <CardContent className="flex items-center justify-between px-4">
                      <div className="space-y-1">
                        <p className="font-semibold">Cash</p>
                        <p className="text-xs text-muted-foreground">
                          Pay at any Vision Academy Branch with cash
                        </p>
                      </div>
                      <RadioGroupItem value="cash" id="cash" />
                    </CardContent>
                  </Card>
                </Label>

                {/* Option 2: Card (Disabled) */}
                <Label
                  htmlFor="card"
                  className="flex cursor-not-allowed rounded-lg"
                >
                  <div>
                  <Card className="w-full border-2 border-muted bg-popover transition-all [&:has([data-state=disabled])]:opacity-50 [&:has([data-state=checked])]:border-primary">
                    <CardContent className="flex items-center justify-between px-4">
                      <div className="space-y-1">
                        <p className="font-semibold">Credit/Debit Card</p>
                        <p className="text-xs text-muted-foreground">
                          Pay with Visa, Mastercard securely
                        </p>
                      </div>
                      <RadioGroupItem value="card" id="card" disabled />
                    </CardContent>
                  </Card>
                  </div>
                </Label>
              </RadioGroup>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
