"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import Loader from "@/components/loader";
import RoundProgress from "@/components/roundProgress";
import { CourseCardSkeletonRow } from "@/components/loadingSkeleton";
import { AiAgentComingSoon } from "@/components/ai-coming-soon";
import { AiAgentAlert } from "@/components/ai-agent-alert";
import { resources } from "../../../../types/resources";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import StudentWorkshopsPage from "./workshop_table";
import { Badge } from "@/components/ui/badge";

// --------------------------------------------
// Reusable List Component
// --------------------------------------------
function ItemList({
  title,
  items,
  loading,
  onClick,
  viewMoreLink,
}: {
  title: string;
  items: any[];
  loading: boolean;
  onClick: (item: any) => void;
  viewMoreLink: string;
}) {
  const MAX_ITEMS = 3;
  const visibleItems = items.slice(0, MAX_ITEMS);

  return (
    <div className="rounded-lg p-5 min-h-[300px]">
      <p className="font-bold mb-5">{title}</p>

      {loading ? (
        <CourseCardSkeletonRow />
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-3">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col gap-2 min-h-[210px] cursor-pointer"
                onClick={() => onClick(item)}
              >
                <img
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.title}
                  className="rounded-md h-32 w-full object-cover"
                />

                <h3 className="font-semibold text-sm line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-500">Rs {new Intl.NumberFormat('en-PK').format(item.price)}</p>

                <button className="bg-green-600 text-white text-xs py-1.5 rounded hover:bg-green-700 w-full mt-auto">
                  Start
                </button>
              </div>
            ))}
          </div>

          {/* Show "View More" only when >3 items */}
          {items.length > MAX_ITEMS && (
            <a
              href={viewMoreLink}
              className="block mt-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              View More →
            </a>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 mt-16">No data found.</p>
      )}
    </div>
  );
}


// --------------------------------------------
// Main Component
// --------------------------------------------
export default function StudentDashboard() {
  const { data: session } = useSession();
  const router = useRouter()

  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  const [courses, setCourses] = useState<any[]>([]);
  const [resourcesList, setResourcesList] = useState<resources[]>([]);

  const loading = isLoadingCourses || isLoadingResources;

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // --------------------------------------------
  // Fetch Courses
  // --------------------------------------------
  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);

      const res = await fetch("/api/courses/enrolled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ user_id: session?.user?.id }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Courses fetch failed");

      return data.courses;
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        description: "Failed to load your courses",
      });
      return [];
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // --------------------------------------------
  // Fetch Resources
  // --------------------------------------------
  const fetchResources = async () => {
    try {
      setIsLoadingResources(true);

      const res = await fetch("/api/resources/enrolled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ user_id: session?.user?.id }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Resources fetch failed");

      return data.resources;
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        description: "Failed to load your resources",
      });
      return [];
    } finally {
      setIsLoadingResources(false);
    }
  };

  // --------------------------------------------
  // Load Dashboard Data
  // --------------------------------------------
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!session?.user?.id) return;

      const [courseData, resourceData] = await Promise.all([
        fetchCourses(),
        fetchResources(),
      ]);

      if (mounted) {
        setCourses(courseData);
        setResourcesList(resourceData);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  // --------------------------------------------
  // Handlers
  // --------------------------------------------
  const handleViewCourse = async (course_id: any) => {
    // token auth
      try {
        const res = await fetch("/api/courses/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course_id }),
        });
        const data = await res.json();
        if (data.token) window.location.href=(`/dashboard/courses/${data.token}`);
        return;
      } catch (err) {}
  };
  const handleViewResource = async (resource_id: any) => {
    try {
        const res = await fetch("/api/courses/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: resource_id }),
        });
        const data = await res.json();
        if (data.token) window.location.href=(`/dashboard/resources/${data.token}`);
        return;
      } catch (err) {}
  };


  // --------------------------------------------
  // Render
  // --------------------------------------------
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      {loading && <Loader isLoading className="h-screen" />}

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 gap-6 text-gray-900 dark:text-white transition-colors">

        {/* LEFT SIDEBAR */}
        <div className="md:col-span-3 flex flex-col gap-4">

          {/* Greeting */}
          <div className="bg-linear-to-br from-transparent to-blue-200 dark:from-[#0f0f0f] dark:to-blue-950 rounded-md px-4 py-7 text-center shadow-md">
            <p>
              Hello,&nbsp;
              <span className="text-blue-700 dark:text-blue-500 font-semibold">
                {session?.user.name}
              </span>{" "}
              👋
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Good Afternoon
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            {/* Courses */}
            <StatBox
              title="Enrolled Courses"
              subtitle={`You’ve joined ${courses.length} active courses`}
              progress={courses.length * 10}
              color="text-green-500"
            />

            {/* Resources */}
            <StatBox
              title="Enrolled Resources"
              subtitle={`You’ve joined ${resourcesList.length} active resources`}
              progress={resourcesList.length * 10}
              color="text-blue-500"
            />

            {/* Total */}
            <StatBox
              title="Total Completion"
              subtitle={`You’ve purchased ${
                courses.length + resourcesList.length
              } items`}
              progress={(courses.length + resourcesList.length) * 10}
              color="text-yellow-500"
            />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-9 flex flex-col gap-6">

          <AiAgentAlert />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <ItemList
              title="My Courses"
              items={courses}
              loading={loading}
              onClick={()=>courses.map((c)=>(handleViewCourse(c.id)))}
              viewMoreLink="/dashboard/my-courses" 
            />

            <ItemList
              title="My Resources"
              items={resourcesList}
              loading={loading}
              onClick={()=>resourcesList.map((r)=>(handleViewResource(r.id)))}
              viewMoreLink="/dashboard/my-resources"  
            />


            <div className="bg-white dark:bg-neutral-900 rounded-lg p-5 shadow-md">
              <p className="font-bold mb-5">Up coming sessions/workshops</p>
              {/* <StudentWorkshopsPage/> */}
             <Badge
                variant="outline"
                className=" text-blue-600 flex justify-self-center border-blue-500/50 dark:text-blue-400"
              >
                Coming Soon
              </Badge>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// --------------------------------------------
// Small Reusable Stat Box Component
// --------------------------------------------
function StatBox({
  title,
  subtitle,
  progress,
  color,
}: {
  title: string;
  subtitle: string;
  progress: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-lg p-7 shadow-md">
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <RoundProgress
        progress={Math.min(progress, 100)}
        color={color}
        size={70}
      />
    </div>
  );
}
