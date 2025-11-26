"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import { Input } from "@/components/ui/input";
import { AppAlert } from "@/components/alerts";
import { CourseCardSkeletonRow } from "@/components/loadingSkeleton";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";

export default function BrowseResourcePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // ✅ Fetch all resources and check enrolled/purchased status
  useEffect(() => {
    if (status !== "authenticated") return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch all resources
        const allRes = await fetch("/api/resources/fetch-all");
        const allData = await allRes.json();

        const resourcesWithStatus = await Promise.all(
          allData.resources.map(async (res: any) => {
            // Call your "check enrollment/purchase" API
            const checkRes = await fetch("/api/check-enrollments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                user_id: session.user.id, 
                resource_id: res.id 
              }), 
            });
            const checkData = await checkRes.json();

            return {
              ...res,
              isEnrolled: checkData.purchased || false,
            };
          })
        );

        setResources(resourcesWithStatus);
        setFiltered(resourcesWithStatus);
      } catch (err) {
        console.error(err);
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          description: "Could not load resources",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [status, session?.user.id]);

  // ✅ Search filter
  useEffect(() => {
    const filteredData = resources.filter((res) =>
      res.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
  }, [search, resources]);

  // ✅ View / enroll logic
  const handleViewResource = async (resource: any) => {

    setIsBtnLoading(true);
    try {
      const res = await fetch("/api/courses/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: resource.id }),
      });
      const data = await res.json();
      if (data.token) router.push(`/dashboard/resources/${data.token}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBtnLoading(false);
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
        <h1 className="text-3xl font-bold mb-6">Browse Resources</h1>

        {/* Search */}
        <div className="max-w-md mb-6">
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Resources */}
        {loading ? (
          <CourseCardSkeletonRow />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((res) => (
              <div
                key={res.id}
                className="bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col gap-2 min-h-[210px] cursor-pointer"
                onClick={() => handleViewResource(res)}
              >
                <img
                  src={res.thumbnail || "/placeholder.jpg"}
                  alt={res.title}
                  className="rounded-md h-32 w-full object-cover"
                />

                <h3 className="font-semibold text-sm line-clamp-2">
                  {res.title}
                </h3>

                <p className="text-xs text-gray-500">Rs {new Intl.NumberFormat('en-PK').format(res.price)}</p>

                <Button
                  className={`text-xs py-1.5 rounded w-full mt-auto ${
                    res.isEnrolled
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  disabled={isBtnLoading}
                >
                  {res.isEnrolled
                    ? "Start"
                    : isBtnLoading
                    ? "Please wait..."
                    : "Enroll Now"}
                </Button>
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
