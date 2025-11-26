"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/auth/protectedRoute";
import { Input } from "../../../..//components/ui/input";
import { AppAlert } from "../../../../components/alerts";
import { useRouter } from "next/navigation";
import { BundleThumbnailPile } from "../../../../components/thumbnailPail";

// --- Helper Component for Skeleton Loading ---
const BundleCardSkeleton = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-3 flex flex-col gap-2 min-h-60 animate-pulse">
    <div className="rounded-md h-32 w-full bg-gray-200 dark:bg-neutral-800"></div>
    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-3/4"></div>
    <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/2"></div>
    <div className="h-8 bg-gray-300 dark:bg-neutral-700 rounded w-full mt-auto"></div>
  </div>
);

const BundleCardSkeletonRow = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
    <BundleCardSkeleton />
    <BundleCardSkeleton />
    <BundleCardSkeleton />
    <BundleCardSkeleton />
  </div>
);


// --- Main Page Component ---
export default function BrowseBundlesPage() {
  const router = useRouter();

  const [bundles, setBundles] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // ✅ Fetch all bundles
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/bundles/browse-bundle");
        const data = await res.json();

        if (res.ok) {
          setBundles(data.bundles);
          setFiltered(data.bundles);
        } else {
          throw new Error(data.message || "Failed to fetch bundles");
        }
      } catch (err: any) {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          description: err.message || "Could not load bundles",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Runs once on page load

  // ✅ Search filter logic
  useEffect(() => {
    const f = bundles.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, bundles]);

  // --- UPDATED FUNCTION (from your prompt) ---
  // ✅ Go to the new bundle details page
  const handleViewBundle = async (id: any) => {
    try {
      // We pass the BUNDLE ID as the 'courseId' to this endpoint
      // as per your logic.
      const res = await fetch("/api/courses/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id }),
      });

      const data = await res.json();
      if (data.token) {
        router.push(`/dashboard/bundles/${data.token}`);
      }
    } catch (err) {
      console.error("Token error:", err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <AppAlert
        {...alert}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="min-h-screen px-6 md:px-10 py-10">
        <h1 className="text-3xl font-bold mb-6">Browse Bundles</h1>

        {/* Search */}
        <div className="max-w-md mb-6">
          <Input
            placeholder="Search bundles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ Skeleton */}
        {loading ? (
          <BundleCardSkeletonRow />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col gap-2 min-h-60 cursor-pointer group"
                // --- UPDATED onClick ---
                onClick={() => handleViewBundle(bundle.id)} // Pass bundle.id
              >
                {/* Use the imported Thumbnail Pile */}
                <div className="w-full h-32">
                  <BundleThumbnailPile items={bundle.items || []} />
                </div>

                <h3 className="font-semibold text-sm line-clamp-2 mt-2">
                  {bundle.title}
                </h3>
                
                {/* Item count */}
                <p className="text-xs text-gray-500">
                  Includes {bundle.items?.length || 0} items
                </p>

                {/* Pricing */}
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-blue-600">
                    Rs {new Intl.NumberFormat('en-PK').format(bundle.discount_price)}
                  </p>
                  <p className="text-xs text-gray-500 line-through">
                    Rs {new Intl.NumberFormat('en-PK').format(bundle.price)}
                  </p>
                </div>

                <button
                  className="text-xs py-1.5 rounded w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {/* --- UPDATED BUTTON TEXT --- */}
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16">No bundles found.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}