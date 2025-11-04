"use client";

import ProtectedRoute from "@/components/auth/protectedRoute";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import banner from "@/components/images/banners/banner-1.jpg"
import Image from "next/image";
import RoundProgress from "@/components/roundProgress";
import { SessionDataTable } from "./data-table";
import { upcoming_session } from "./columns";
import { session } from "../../../../types/sessions";
import { data } from "../../../../types/sessions"
import { CourseCardSkeletonRow } from "@/components/loadingSkeleton";
import CourseCard from "@/components/courseCard";
import { courses } from "../../../../types/courses";
import CourseGrid from "@/components/CourseGrid";

export default function StudentDashboard() {
  
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<session[]>([])

    if (loading) return <Loader isLoading={true} className="h-screen" />;
  const { data: session } = useSession()


  const [isloading, setIsLoading] = useState(false);
  const [AddUser, setAddUser] = useState(false)
  const [CourseDetails, setCourseDetails] = useState<courses[]>([])
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
  
      const res = await fetch("/api/courses/fetch-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // optional: ensures fresh data (Next.js App Router)
      });
  
      if (!res.ok) {
        setAlert({
            show: true,
            type: "error",
            title: "Fetch Failed!",
            description: "Server error, please try again later.",
          })
      }
  
      const data = await res.json();
  
      if (data.courses) {
        return data.courses;
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  useEffect(() => {
    let isMounted = true; // ✅ prevents state updates if component unmounts
  
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const CourseData = await fetchCourses();
  
        // ✅ Only update state if the component is still mounted
        if (isMounted && CourseData) {
          setCourseDetails(CourseData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
  
    fetchData();
  
  
    return () => {
      isMounted = false;
    };
  }, []);
  


  return (
    <ProtectedRoute allowedRoles={["student"]}>
         <div className="min-h-screen text-gray-900 dark:text-white grid grid-cols-1 md:grid-cols-12 gap-6 transition-colors duration-300">

      {/* Left Column — Greetings + Stats */}
      <div className="md:col-span-3 flex flex-col gap-4">
        {/* Box 1 - Greeting */}
        <div className="bg-gradient-to-br from-transparent from-40% to-70% to-blue-200 dark:from-[#0f0f0f] dark:to-blue-950 rounded-md px-4 py-7 text-center shadow-md">
         <p className="whitespace-nowrap">
            Hello,&nbsp;
            <span className="text-blue-700 dark:text-blue-500 font-semibold">{session?.user.name}</span> 👋
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Good Afternoon</p>
        </div>

        {/* Box 2 - Stats (3 vertical boxes) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-lg p-7 shadow-md">
            {/* Left side — Heading + Description */}
            <div className="flex flex-col text-left">
              <h3 className="font-semibold mb-2">Enrolled Courses</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You’ve joined 8 active courses
              </p>
            </div>

            {/* Right side — Round Progress */}
            <RoundProgress progress={76} color="text-green-500" size={70} />
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-lg p-7 shadow-md">
            {/* Left side — Heading + Description */}
            <div className="flex flex-col text-left">
              <h3 className="font-semibold mb-2">Enrolled Resources</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You’ve joined 8 active resources
              </p>
            </div>

            {/* Right side — Round Progress */}
            <RoundProgress progress={36} color="text-blue-500" size={70} />
          </div>

           <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-lg p-7 shadow-md">
            {/* Left side — Heading + Description */}
            <div className="flex flex-col text-left">
              <h3 className="font-semibold mb-2">Total Completion</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You’ve total 16 items purchased
              </p>
            </div>

            {/* Right side — Round Progress */}
            <RoundProgress progress={86} color="text-yellow-500" size={70} />
          </div>
        </div>
      </div>

      {/* Middle Column — Banner + Courses Area */}
      <div className="md:col-span-6 flex flex-col gap-4">
        {/* Box 3 - Banner Space */}
        
          <Image src={banner} alt="banner" className="rounded-md dark:shadow-[#1f1f1f] shadow-lg"/>
      

        {/* Box 4 - Courses + Resources + Recent */}
        <div className=" rounded-lg p-4 flex-1">
          <p className=" font-bold mb-5">Your Courses</p>
          {isloading ? (
            <CourseCardSkeletonRow />
          ) : CourseDetails.length > 0 ? (
            <CourseGrid
              courses={CourseDetails}  
              columns={2}              
              showInstructor={false}   
              onCardClick={(course) => console.log("Clicked:", course.title)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              No courses available.
            </div>
          )}

        </div>
      </div>

      {/* Right Column — Upcoming Sessions */}
      <div className="md:col-span-3 flex flex-col gap-4">
        {/* Box 5 - Upcoming Sessions */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg p-5 shadow-md h-auto">
          <p className=" font-bold mb-5">Upcoming Sessions / Workshops</p>
            <SessionDataTable columns={upcoming_session} data={data} />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}


