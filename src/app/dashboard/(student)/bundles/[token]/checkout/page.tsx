"use client";

// --- FIX: Corrected relative import paths ---
import { Button } from "../../../../../../components/ui/button";
import { Input } from "../../../../../../components/ui/input";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AppAlert } from "../../../../../../components/alerts";
import Loader from "../../../../../../components/loader";
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
        }),
        // --- End Adaptation ---
      });

      const data = await res.json();

      setAlert({
        show: true,
        type: "success",
        title: "Order Placed",
        description: data.message || "Your cash order has been recorded.",
      });

      setTimeout(() => (window.location.href = `/dashboard`), 1500);
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
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={placingOrder}
            >
              {placingOrder && <Loader isLoading={placingOrder} className=""/>}
              {placingOrder ? "Placing..." : "Confirm Cash Order"}
            </Button>
          </div>

          {/* ✅ Right — Order Summary */}
          <div className="bg-gray-100 dark:bg-[#1f1f1f] p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Order Summary
            </h3>

            {/* --- Adapted for Bundles --- */}
            <div className="space-y-2 text-gray-800 dark:text-gray-200">
              <p><strong>Bundle:</strong> {bundle.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                Original Price: Rs {bundle.price}
              </p>
              <p className="text-lg font-bold text-blue-600">
                Final Price: Rs {bundle.discount_price}
              </p>
              <p className="mt-2"><strong>Payment Method:</strong> Cash</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pay at center. Access will be activated after verification.
              </p>
            </div>
            {/* --- End Adaptation --- */}

          </div>

        </div>
      </div>
    </>
  );
}