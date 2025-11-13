"use client";

import ProtectedRoute from "@/components/auth/protectedRoute";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import banner from "@/components/images/banners/banner-1.jpg";
import Image from "next/image";
import RoundProgress from "@/components/roundProgress";
import { SessionDataTable } from "./data-table";
import { upcoming_session } from "./columns";
import { session } from "../../../../types/sessions";
import { data } from "../../../../types/sessions";
import { CourseCardSkeletonRow } from "@/components/loadingSkeleton";
import CourseGrid from "@/components/CourseGrid";

export default function StudentDashboard() {
  const { data: session } = useSession();

  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  const [CourseDetails, setCourseDetails] = useState<any[]>([]);
  const [ResourceDetails, setResourceDetails] = useState<any[]>([]);

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // ✅ Fetch enrolled courses
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

      if (!data.success) {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          description: "Failed to load your courses",
        });
        return [];
      }

      return data.courses;
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setAlert({
        show: true,
        type: "error",
        title: "Server Error",
        description: "Please try again later.",
      });
      return [];
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // ✅ Fetch enrolled resources
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

      if (!data.success) {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          description: "Failed to load your resources",
        });
        return [];
      }

      return data.resources;
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setAlert({
        show: true,
        type: "error",
        title: "Server Error",
        description: "Please try again later.",
      });
      return [];
    } finally {
      setIsLoadingResources(false);
    }
  };

  // ✅ Load both courses and resources
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!session?.user?.id) return;

      const [coursesData, resourcesData] = await Promise.all([
        fetchCourses(),
        fetchResources(),
      ]);

      if (isMounted) {
        setCourseDetails(coursesData);
        setResourceDetails(resourcesData);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id]);

  // Loading state for both
  const loading = isLoadingCourses || isLoadingResources;

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      {loading && <Loader isLoading={true} className="h-screen" />}

      <div className="min-h-screen text-gray-900 dark:text-white grid grid-cols-1 md:grid-cols-12 gap-6 transition-colors duration-300">
        {/* Left Column — Greetings + Stats */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {/* Greeting */}
          <div className="bg-gradient-to-br from-transparent from-40% to-70% to-blue-200 dark:from-[#0f0f0f] dark:to-blue-950 rounded-md px-4 py-7 text-center shadow-md">
            <p className="whitespace-nowrap">
              Hello,&nbsp;
              <span className="text-blue-700 dark:text-blue-500 font-semibold">
                {session?.user.name}
              </span>{" "}
              👋
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Good Afternoon</p>
          </div>

          {/* Stats Boxes */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-lg p-7 shadow-md">
              <div className="flex flex-col text-left">
                <h3 className="font-semibold mb-2">Enrolled Courses</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You’ve joined {CourseDetails.length} active courses
                </p>
              </div>
              <RoundProgress progress={Math.min(CourseDetails.length * 10, 100)} color="text-green-500" size={70} />
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-lg p-7 shadow-md">
              <div className="flex flex-col text-left">
                <h3 className="font-semibold mb-2">Enrolled Resources</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You’ve joined {ResourceDetails.length} active resources
                </p>
              </div>
              <RoundProgress progress={Math.min(ResourceDetails.length * 10, 100)} color="text-blue-500" size={70} />
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-lg p-7 shadow-md">
              <div className="flex flex-col text-left">
                <h3 className="font-semibold mb-2">Total Completion</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You’ve total {CourseDetails.length + ResourceDetails.length} items purchased
                </p>
              </div>
              <RoundProgress progress={Math.min((CourseDetails.length + ResourceDetails.length) * 10, 100)} color="text-yellow-500" size={70} />
            </div>
          </div>
        </div>

        {/* Middle Column — Banner + Courses & Resources */}
        <div className="md:col-span-6 flex flex-col gap-4">
          {/* Banner */}
          <Image src={banner} alt="banner" className="rounded-md dark:shadow-[#1f1f1f] shadow-lg" />

          {/* Courses Section */}
          <div className="rounded-lg p-4 flex-1">
            <p className="font-bold mb-5">Your Courses</p>
            {isLoadingCourses ? (
              <CourseCardSkeletonRow />
            ) : CourseDetails.length > 0 ? (
              <CourseGrid
                courses={CourseDetails}
                columns={2}
                showInstructor={false}
                onCardClick={(course) => console.log("Clicked course:", course.title)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                No courses available.
              </div>
            )}
          </div>

          {/* Resources Section */}
          <div className="rounded-lg p-4 flex-1 mt-4">
            <p className="font-bold mb-5">Your Resources</p>
            {isLoadingResources ? (
              <CourseCardSkeletonRow />
            ) : ResourceDetails.length > 0 ? (
              <CourseGrid
                courses={ResourceDetails}
                columns={2}
                showInstructor={false}
                onCardClick={(res) => console.log("Clicked resource:", res.title)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                No resources available.
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Upcoming Sessions */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-5 shadow-md h-auto">
            <p className="font-bold mb-5">Upcoming Sessions / Workshops</p>
            <SessionDataTable columns={upcoming_session} data={data} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
