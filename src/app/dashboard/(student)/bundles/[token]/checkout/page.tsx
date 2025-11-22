"use client";

// --- FIX: Corrected relative import paths ---
import { Button } from "../../../../../../components/ui/button";
import { Input } from "../../../../../../components/ui/input";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AppAlert } from "../../../../../../components/alerts";
import Loader from "../../../../../../components/loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
// --- END FIX ---

export default function BundleCheckoutPage() {
  const { token } = useParams();
  const { data: session, status } = useSession();

  // --- Adapted for Bundles ---
  const [bundleId, setBundleId] = useState<number | null>(null);
  const [bundle, setBundle] = useState<any>(null);
  // --- End Adaptation ---

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
 
  // ✅ Decode token → get bundle id
  useEffect(() => {
    if (!token) return;

    const decode = async () => {
      // We use the same 'course' token decoder, as it just returns an ID
      const res = await fetch("/api/courses/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (data.success && data.courseId) {
        // --- Adapted for Bundles ---
        setBundleId(data.courseId); // 'courseId' from decoder is our bundleId
        // --- End Adaptation ---
      } else {
        window.location.href = "/dashboard";
      }
    };

    decode();
  }, [token]);

  // ✅ Fetch bundle + user info
  useEffect(() => {
    if (!bundleId || status !== "authenticated") return;

    // --- Adapted for Bundles ---
    const fetchBundle = async () => {
      const res = await fetch("/api/bundles/fetch-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle_id: bundleId }),
      });

      const data = await res.json();
      if (data.success) setBundle(data.bundle);
    };
    // --- End Adaptation ---

    const fetchUser = async () => {
      const res = await fetch("/api/users/fetch-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session?.user?.id }),
      });

      const data = await res.json();
      setUserInfo(data.user_info?.[0]);
    };

    // --- Adapted for Bundles ---
    Promise.all([fetchBundle(), fetchUser()]).then(() => setLoading(false));
    // --- End Adaptation ---
  }, [bundleId, status, session]);

  // ✅ Auto-check if already purchased
  useEffect(() => {
    if (!bundleId || !userInfo) return;

    const checkPurchase = async () => {
      // --- Adapted for Bundles ---
      const res = await fetch("/api/check-bundle-enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session?.user?.id, bundle_id: bundleId }),
      });
      // --- End Adaptation ---

      const data = await res.json();

      if (data.purchased) {
        setAlreadyPurchased(true);

        setAlert({
          show: true,
          type: "warning",
          title: "Already Purchased ✅",
          description: "You are already enrolled in all items in this bundle.",
        });

        setTimeout(() => (window.location.href = "/dashboard"), 1400);
      }
    };

    checkPurchase();
  }, [bundleId, userInfo, session]);

  // ✅ Submit order
  const handleSubmit = async () => {
    if (!bundleId || !userInfo) return;

    setPlacingOrder(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // --- Adapted for Bundles ---
        body: JSON.stringify({
          id: bundleId,       // The ID of the item
          type: "bundle",     // The type
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          paymentMethod,
        }),
        // --- End Adaptation ---
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
              itemName: bundle.title,
              totalPrice: "PKR " + bundle.price,
              orderId: data.orderId
            }
          })
        });

        setAlert({
        show: true,
        type: "success",
        title: "Order Placed",
        description: data.message || "Your cash order has been recorded.",
      });

      setTimeout(() => (window.location.href = `/dashboard/orders`), 1500);
      }


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

  // ✅ While fetching
  if (loading || alreadyPurchased || !bundle) { // Added !bundle check
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

            <div className="space-y-2 bg-gray-100 dark:bg-[#1f1f1f] p-5 rounded-xl text-gray-800 dark:text-gray-200">
              <p><strong>Course:</strong> {bundle.title}</p>
              <p><strong>Price:</strong> Rs {bundle.price}</p>
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