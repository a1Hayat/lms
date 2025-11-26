"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import { Input } from "@/components/ui/input";
import { AppAlert } from "@/components/alerts";
import { CourseCardSkeletonRow } from "@/components/loadingSkeleton";
import { useRouter } from "next/navigation";

export default function BrowseCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // ✅ Fetch all + enrolled
  useEffect(() => {
    if (status !== "authenticated") return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [allRes, enrolledRes] = await Promise.all([
          fetch("/api/courses/fetch-all"),
          fetch("/api/courses/enrolled", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: session.user.id }),
          }),
        ]);

        const all = await allRes.json();
        const enrolled = await enrolledRes.json();

        const enrolledIDs = enrolled.courses?.map((c: any) => c.id) || [];
        setEnrolledIds(enrolledIDs);

        const tagged = all.courses.map((c: any) => ({
          ...c,
          isEnrolled: enrolledIDs.includes(c.id),
        }));

        setCourses(tagged);
        setFiltered(tagged);
      } catch {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          description: "Could not load courses",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [status]);

  // ✅ search
  useEffect(() => {
    const f = courses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, courses]);

  // ✅ View / enroll logic
  const handleViewCourse = async (course: any) => {
  
      // token auth
      try {
        const res = await fetch("/api/courses/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course.id }),
        });
        const data = await res.json();
        if (data.token) router.push(`/dashboard/courses/${data.token}`);
        return;
      } catch (err) {}
    


  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <AppAlert
        {...alert}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="min-h-screen px-6 md:px-10 py-10">
        <h1 className="text-3xl font-bold mb-6">Browse Courses</h1>

        {/* Search */}
        <div className="max-w-md mb-6">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ Skeleton */}
        {loading ? (
          <CourseCardSkeletonRow />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col gap-2 min-h-[210px] cursor-pointer"
                onClick={() => handleViewCourse(course)}
              >
                <img
                  src={course.thumbnail || "/placeholder.jpg"}
                  alt={course.title}
                  className="rounded-md h-32 w-full object-cover"
                />

                <h3 className="font-semibold text-sm line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-500">Rs {new Intl.NumberFormat('en-PK').format(course.price)}</p>

                <button
                  className={`text-xs py-1.5 rounded w-full mt-auto ${
                    course.isEnrolled
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {course.isEnrolled ? "Start" : "Enroll Now"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16">No courses found.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}


