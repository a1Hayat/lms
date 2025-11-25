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
import Link from "next/link";
import BankTransferModal from "@/components/bank_details_modal";
import { IconCreditCard } from "@tabler/icons-react";

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
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)

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
          paymentMethod,
        }),
      });

      const data = await res.json();
      
      
      if (data.status == 'success') {

        await fetch("/api/send-mail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: userInfo.email,
            subject: "Your Payment Receipt - CSWithBari",
            type: "paymentReceipt",
            payload: {
              name: userInfo.name,
              itemName: course.title,
              totalPrice: "PKR " + course.price,
              orderId: data.orderId,
              paymentMethod
            }
          })
        });

        setAlert({
        show: true,
        type: "success",
        title: "Order Placed",
        description: data.message || "Your cash order has been recorded.",
      });

      setIsBankModalOpen(true)
      }


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

  const CloseBankModal = () => {
    window.location.href="/dashboard/orders"
  }


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

      <div className=" flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white dark:bg-[#0f0f0f] rounded-xl p-6 grid md:grid-cols-2 gap-6">
          
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
              {placingOrder ? "Placing..." : `Confirm Order`}
            </Button>
          </div>

          <BankTransferModal
            orderId={itemId}
            amount={course.price}
            isOpen={isBankModalOpen}
            onClose={CloseBankModal}
          />

          {/* ✅ Right — Order Summary */}
          <div className=" p-5 border-l">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Order Summary
            </h3>

            <div className="space-y-2 bg-gray-100 dark:bg-[#1f1f1f] p-5 rounded-xl text-gray-800 dark:text-gray-200">
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

                {/* Option 2: Bank */}
                <Label
                  htmlFor="cash"
                  className="flex cursor-pointer rounded-lg"
                >
                  
                  <Card className="w-full border-2 border-muted bg-popover transition-all [&:has([data-state=disabled])]:opacity-50 [&:has([data-state=checked])]:border-primary">
                    <CardContent className="flex items-center justify-between px-4">
                      <div className="space-y-1">
                        <p className="font-semibold">Bank Transfer</p>
                        <p className="text-xs text-muted-foreground">
                          Transfer to the bank account after placing order. 
                        </p>
                      </div>
                      <RadioGroupItem value="bank" id="bank" />
                    </CardContent>
                  </Card>
                  
                </Label>
              </RadioGroup>
              <p className="text-xs text-center text-blue-500 mt-">Payment instructions will be displayed / sent on your email after placing order.  </p>
            </div>
            
          </div>

        </div>
      </div>
    </>
  );
}
