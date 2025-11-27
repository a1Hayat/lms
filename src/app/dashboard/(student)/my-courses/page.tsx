"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import { Input } from "@/components/ui/input";
import { AppAlert } from "@/components/alerts";
import { useRouter } from "next/navigation";
import { CourseCardSkeletonRow } from "@/components/loadingSkeleton";

// 1. Define Interface
interface Course {
  id: number;
  title: string;
  thumbnail: string | null;
  price: number;
}

export default function MyCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 2. Fix State Types
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // ✅ Get enrolled courses
  // 3. Use useCallback to fix dependency warning
  const fetchCourses = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);

      const res = await fetch("/api/courses/enrolled", {
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
          description: "Failed to load enrolled courses",
        });
        return;
      }

      setCourses(data.courses);
      setFiltered(data.courses);

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

  // ✅ View Course with token
  // 5. Fix argument type
  const handleViewCourse = async (course: Course) => {
    try {
      const res = await fetch("/api/courses/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = await res.json();
      if (data.token) router.push(`/dashboard/courses/${data.token}`);
    } catch (err) {
      console.error("Token error:", err);
    }
  };

  // ✅ run fetch when auth ready
  useEffect(() => {
    if (status === "authenticated") fetchCourses();
  }, [status, fetchCourses]); // Added fetchCourses dependency

  // ✅ search filter
  useEffect(() => {
    const f = courses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, courses]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <AppAlert
        {...alert}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="min-h-screen px-6 md:px-10 py-10">
        <h1 className="text-3xl font-bold mb-5">My Enrolled Courses</h1>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ Loading Skeleton */}
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
                {/* 6. Suppress next/image warning for now */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.thumbnail || "/placeholder.jpg"}
                  alt={course.title}
                  className="rounded-md h-32 w-full object-cover"
                />

                <h3 className="font-semibold text-sm line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-500">Rs {new Intl.NumberFormat('en-PK').format(course.price)}</p>

                <button className="bg-green-600 text-white text-xs py-1.5 rounded hover:bg-green-700 w-full mt-auto">
                  Start
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