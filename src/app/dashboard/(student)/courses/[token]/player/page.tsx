"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IconBrandYoutube, IconBook2, IconPlayerPlay } from "@tabler/icons-react";
import Loader from "@/components/loader";
import type { courses, lesson } from "../../../../../../../types/courses";

export default function CoursePlayerPage() {
  const { token } = useParams();
  const [course, setCourse] = useState<courses | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<lesson | null>(null);
  const [videoToken, setVideoToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  // ✅ Step 1: Decode the course token (from URL)
  useEffect(() => {
    if (!token) return;

    const decodeToken = async () => {
      try {
        const res = await fetch("/api/courses/decode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (data.success && data.courseId) {
          setCourseId(data.courseId);
        } else {
          console.error("Invalid or expired course token");
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    };

    decodeToken();
  }, [token]);

  // ✅ Step 2: Fetch the course data and its curriculum
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/courses/fetch-course", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course_id: courseId }),
        });

        const data = await res.json();

        if (data.success && data.course) {
          setCourse(data.course);
          if (data.course.curriculum?.length > 0) {
            setActiveLesson(data.course.curriculum[0]);
          }
        } else {
          console.error("Course not found");
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // ✅ Step 3: Request secure video token for active lesson
  const fetchVideoToken = async (videoPath: string) => {
    setVideoLoading(true);
    try {
      const res = await fetch("/api/request-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoPath }),
      });

      const data = await res.json();
      if (data.token) setVideoToken(data.token);
      else console.error("Failed to get video token");
    } catch (error) {
      console.error("Video token request failed:", error);
    } finally {
      setVideoLoading(false);
    }
  };

  // ✅ Step 4: Whenever lesson changes, fetch its secure video token
  useEffect(() => {
    if (activeLesson?.video_path) {
      fetchVideoToken(activeLesson.video_path);
    }
  }, [activeLesson]);

  // ====== UI START ======

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader isLoading={true} className=""/>
      </div>
    );

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400">
        Course not found.
      </div>
    );

  return (
    <div className="w-full sm:w-[85%] lg:w-[80%] mx-auto py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 text-gray-900 dark:text-gray-100">
      {/* ===== LEFT COLUMN — Lessons ===== */}
      <aside className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-[#1f1f1f] rounded-xl shadow-sm p-4 sm:p-5 h-fit lg:h-[80vh] overflow-y-auto">
        <h1 className="text-lg sm:text-xl font-bold mb-3">{course.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">{course.level}</p>

        <div className="space-y-3">
          {course.curriculum && course.curriculum.length > 0 ? (
            course.curriculum.map((lesson, index) => (
              <div
                key={index}
                onClick={() => setActiveLesson(lesson)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  activeLesson?.id === lesson.id
                    ? "border-blue-500 bg-blue-50 dark:bg-neutral-800"
                    : "border-gray-200 dark:border-[#1f1f1f] hover:bg-gray-50 dark:hover:bg-neutral-800"
                }`}
              >
                <div className="flex items-center gap-x-3">
                  <IconBook2
                    size={18}
                    className={`${
                      activeLesson?.id === lesson.id
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="text-sm sm:text-base font-medium">
                    {lesson.title}
                  </span>
                </div>
                <IconPlayerPlay
                  size={16}
                  className={`${
                    activeLesson?.id === lesson.id
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No lessons available.
            </p>
          )}
        </div>
      </aside>

      {/* ===== RIGHT COLUMN — Video Player ===== */}
      <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-[#1f1f1f] shadow-sm p-3 sm:p-5 flex flex-col justify-center">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {videoLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader isLoading={true} className="" />
            </div>
          ) : activeLesson && videoToken ? (
            <video
              key={activeLesson.id}
              controls
              className="w-full h-full object-cover"
            >
              <source
                src={`/api/videos/stream?token=${videoToken}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-gray-400">
              <IconBrandYoutube size={48} />
              <p className="mt-2 text-sm">Select a lesson to start watching</p>
            </div>
          )}
        </div>

        {activeLesson && (
          <div className="mt-4">
            <h2 className="text-lg sm:text-xl font-semibold">{activeLesson.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">
              Duration: {activeLesson.length || "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
