"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// --- FIX: Corrected relative import paths ---
import { Button } from "../../../../../components/ui/button";
import { IconBook, IconFileText } from "@tabler/icons-react";
import Loader from "../../../../../components/loader";
// --- FIX: Corrected import path and component name ---
import { BundleThumbnailPile } from "../../../../../components/thumbnailPail";
// --- END FIX ---

// Define a type for our bundle
type Bundle = {
  id: number;
  title: string;
  description: string;
  price: string;
  discount_price: string;
  items: Array<{
    id: number;
    title: string;
    thumbnail: string;
    type: 'course' | 'resource';
  }>;
};

export default function BundlePage() {
  const { token } = useParams(); // Get the bundle token from the URL
  const { data: session } = useSession();
  const router = useRouter();

  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "contents">("description");
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  // --- FIX: Added type for decoded ID ---
  const [id, setDecodedId] = useState<number | null>(null);

  // ✅ Decode token
  useEffect(() => {
    if (!token) return;
    const decode = async () => {
      try {
        const res = await fetch("/api/courses/decode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        // --- FIX: Use bundleId from decode, assuming it's returned as courseId ---
        if (data.success) {
          setDecodedId(data.courseId); // Assuming decode returns the ID as 'courseId'
        } else {
          console.error("Failed to decode token");
        }
      } catch (err) {
        console.error("Decode error:", err);
      }
    };
    decode();
  }, [token]);


  // ✅ Fetch Bundle Data
  useEffect(() => {
    if (!id) return; // Wait for the ID to be decoded
    const fetchBundle = async () => {
      setLoading(true);
      try {
        // --- FIX: Call the correct API endpoint for a single bundle ---
        const res = await fetch("/api/bundles/fetch-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bundle_id: Number(id) }),
        });
        const data = await res.json();
        if (data.success) {
          setBundle(data.bundle);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, [id]); // This effect now correctly depends on the decoded 'id'

  // ✅ Check if enrolled
  useEffect(() => {
    if (!session?.user?.id || !id) return;
    const checkEnroll = async () => {
      const res = await fetch("/api/check-bundle-enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id, bundle_id: Number(id) }),
      });
      const data = await res.json();
      if (data.purchased) {
        setIsEnrolled(true);
      }
    };
    checkEnroll();
  }, [session, id]);

  // ✅ Go to checkout
  const handleCheckout = async () => {
    setLoading(true);
    router.push(`/dashboard/bundles/${token}/checkout`);
  };
  
  // ✅ Go to dashboard
  const handleViewDashboard = async () => {
    router.push(`/dashboard`);
  };

  if (loading || !id) { // Show loader while decoding or fetching
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader isLoading className="" />
      </div>
    );
  }

  if (!bundle) { // Handle case where bundle isn't found after loading
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Bundle not found.</p>
      </div>
    );
  }

  return (
    <div className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto p-4 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 text-gray-900 dark:text-gray-100">

      <div className="lg:col-span-2">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-[#1f1f1f] shadow-sm group">
          {/* Use the new thumbnail pile component */}
          <BundleThumbnailPile items={bundle.items} />
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-5 border-b border-gray-200 dark:border-[#1f1f1f] overflow-x-auto">
          {["description", "contents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 text-sm sm:text-base font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === "description" ? (
            <p className="text-gray-700 dark:text-gray-300">{bundle.description}</p>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-2">Items in this bundle:</h3>
              {bundle.items?.map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-[#1f1f1f] rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                >
                  <div className="flex gap-x-3 items-center">
                    {item.type === 'course' ? 
                      <IconBook className="text-blue-500" /> : 
                      <IconFileText className="text-green-500" />
                    }
                    <span className="truncate w-48 sm:w-auto">{item.title}</span>
                  </div>
                  <span className="text-sm text-gray-500 capitalize shrink-0">{item.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="border dark:border-[#1f1f1f] rounded-xl p-6 shadow-sm h-fit sticky top-10">
        <h1 className="text-2xl font-semibold">{bundle.title}</h1>
        
        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-3">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Rs. {bundle.discount_price}
          </p>
          <p className="text-md text-gray-500 line-through">
            Rs. {bundle.price}
          </p>
        </div>

        {/* ✅ Button Logic */}
        {isEnrolled ? (
          <Button onClick={handleViewDashboard} className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3">
            Purchased
          </Button>
        ) : (
          <Button onClick={handleCheckout} className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-3">
            Buy Bundle
          </Button>
        )}

        <div className="mt-4 text-center">
          <a href="/help" className="text-blue-500 dark:text-blue-400 text-sm hover:underline">
            Need Help?
          </a>
        </div>
      </aside>
    </div>
  );
}