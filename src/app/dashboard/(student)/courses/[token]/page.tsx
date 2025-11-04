"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { courses } from "../../../../../../types/courses";
import { Button } from "@/components/ui/button";
import { IconBrandParsinta } from "@tabler/icons-react";
import Loader from "@/components/loader";
import Image from "next/image";

export default function CoursePage() {
const { token } = useParams(); 

  const [course, setCourse] = useState<courses | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "curriculum">("description");
  const [loading, setLoading] = useState(false);
  const [decodedId, setDecodedId] = useState<number | null>(null);

  // ✅ Decode token server-side
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
        if (data.success) setDecodedId(data.courseId);
        else console.error("Invalid or expired token");
      } catch (err) {
        console.error("Decode failed:", err);
      }
    };
    decode();
  }, [token]);

  // ✅ Fetch course via POST API
  useEffect(() => {
    if (!decodedId) return;
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/courses/fetch-course", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course_id: decodedId }),
        });
        const data = await res.json();
        if (data.success && data.course) setCourse(data.course);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [decodedId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader isLoading  className=""/>
      </div>
    );

  if (!course)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Course not found.
      </div>
    );

  const formattedLevel =
    course.level === "o-level"
      ? "O Level | IGCSE"
      : course.level === "as-level"
      ? "AS Level | A-1"
      : course.level === "a-level"
      ? "A Level | A-2"
      : course.level;

  return (
    <div className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto p-4 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 text-gray-900 dark:text-gray-100">
      <div className="lg:col-span-2">
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 dark:border-[#1f1f1f] shadow-sm">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-5 border-b border-gray-200 dark:border-[#1f1f1f] overflow-x-auto">
          {["description", "curriculum"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "description" | "curriculum")}
              className={`pb-3 text-sm sm:text-base font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === "description" ? (
            <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
          ) : (
            <div className="space-y-3">
              {course.curriculum?.map((lesson, i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-[#1f1f1f] rounded-lg p-3 flex justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all"
                >
                  <div className="flex gap-x-3 items-center">
                    <IconBrandParsinta className="text-blue-500" />
                    <span>{lesson.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">{lesson.length || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="bg-white dark:bg-neutral-900 border dark:border-[#1f1f1f] rounded-xl p-6 shadow-sm h-fit sticky top-10">
        <h1 className="text-2xl font-semibold">{course.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{formattedLevel}</p>
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-3">
          Rs. {course.price}
        </p>
        <Button className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-3">
          Enroll Now
        </Button>
        <div className="mt-4 text-center">
          <a
            href="/help"
            className="text-blue-500 dark:text-blue-400 text-sm hover:underline"
          >
            Need Help?
          </a>
        </div>
      </aside>
    </div>
  );
}
