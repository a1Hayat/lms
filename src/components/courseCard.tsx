"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { courses } from "../../types/courses";

type CourseCardProps = {
  course: courses;
  showInstructor?: boolean;
};

const CourseCard: React.FC<CourseCardProps> = ({ course, showInstructor = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Generate token and navigate securely
  const handleViewCourse = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      const data = await res.json();

      if (data.token) router.push(`/dashboard/courses/${data.token}`);
      else console.error("Failed to get course token");
    } catch (err) {
      console.error("Error generating token:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleViewCourse}
      className="
        bg-white dark:bg-neutral-900
        rounded-lg shadow-md dark:shadow-lg
        hover:shadow-lg dark:hover:shadow-xl
        transition-all duration-300
        overflow-hidden cursor-pointer
        flex flex-col
      "
    >
      {/* ✅ Thumbnail */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[5/3] overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover object-center transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          priority
        />
      </div>

      {/* ✅ Content */}
      <div className="flex flex-col flex-1 justify-between p-4 sm:p-5 lg:p-6">
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 capitalize">
            {course.level}
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
            {course.description}
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm sm:text-base md:text-lg font-semibold text-blue-600 dark:text-blue-400">
            Rs. {course.price}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewCourse();
            }}
            disabled={loading}
            className="
              text-xs sm:text-sm md:text-base font-medium
              text-white bg-blue-600 hover:bg-blue-700
              dark:bg-blue-500 dark:hover:bg-blue-600
              px-4 py-2 rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-400
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Loading..." : "View"}
          </button>
        </div>

        {showInstructor && (
          <p className="mt-3 text-xs sm:text-sm text-gray-400 dark:text-gray-500">
            Instructor ID: {course.instructor_id}
          </p>
        )}
      </div>
      
    </div>
  );
};

export default CourseCard;
