"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import { Input } from "@/components/ui/input";
import { AppAlert } from "@/components/alerts";
import { useRouter } from "next/navigation";
import { CourseCardSkeletonRow } from "@/components/loadingSkeleton";

// 1. Define Interface
interface Resource {
  id: number;
  title: string;
  thumbnail: string | null;
  price: number;
}

export default function MyResourcesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 2. Fix State Types
  const [resources, setResources] = useState<Resource[]>([]);
  const [filtered, setFiltered] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // ✅ Get enrolled resources
  // 3. Use useCallback to fix dependency warning
  const fetchResources = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);

      const res = await fetch("/api/resources/enrolled", {
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
          description: "Failed to load enrolled resources",
        });
        return;
      }

      setResources(data.resources);
      setFiltered(data.resources);

    } catch {
      // 4. Removed unused 'err' variable
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // ✅ View Resource with token
  // 5. Fix argument type
  const handleViewResource = async (resource: Resource) => {
    try {
      const res = await fetch("/api/courses/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: resource.id }),
      });

      const data = await res.json();
      if (data.token) router.push(`/dashboard/resources/${data.token}`);
    } catch (err) {
      console.error("Token error:", err);
    }
  };

  // ✅ Fetch when auth ready
  useEffect(() => {
    if (status === "authenticated") fetchResources();
  }, [status, fetchResources]); // Added fetchResources dependency

  // ✅ Search filter
  useEffect(() => {
    const f = resources.filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, resources]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <AppAlert
        {...alert}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="min-h-screen px-6 md:px-10 py-10">
        <h1 className="text-3xl font-bold mb-5">My Enrolled Resources</h1>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ Loading Skeleton */}
        {loading ? (
          <CourseCardSkeletonRow />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((resource) => (
              <div
                key={resource.id}
                className="bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col gap-2 min-h-[210px] cursor-pointer"
                onClick={() => handleViewResource(resource)}
              >
                {/* 6. Suppress next/image warning */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resource.thumbnail || "/placeholder.jpg"}
                  alt={resource.title}
                  className="rounded-md h-32 w-full object-cover"
                />

                <h3 className="font-semibold text-sm line-clamp-2">
                  {resource.title}
                </h3>

                <p className="text-xs text-gray-500">Rs {new Intl.NumberFormat('en-PK').format(resource.price)}</p>

                <button className="bg-green-600 text-white text-xs py-1.5 rounded hover:bg-green-700 w-full mt-auto">
                  Start
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16">No resources found.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}