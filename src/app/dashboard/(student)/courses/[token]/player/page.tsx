"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IconBrandYoutube, IconPlayerPlay, IconBrandParsinta } from "@tabler/icons-react";
import Loader from "@/components/loader";
import type { courses, lesson } from "../../../../../../../types/courses";

export default function CoursePlayerPage() {
  const { token } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [course, setCourse] = useState<courses | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<lesson | null>(null);
  const [videoToken, setVideoToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // ✅ decode course token
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
          router.push("/dashboard");
        }
      } catch {
        router.push("/dashboard");
      }
    };

    decodeToken();
  }, [token, router]);

  // ✅ Check enrollment
  useEffect(() => {
    if (!session?.user?.id || !courseId) return;

    const checkEnroll = async () => {
      const res = await fetch("/api/check-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id, course_id: courseId }),
      });

      const data = await res.json();

      if (data.purchased) {
        setIsEnrolled(true);
      } else {
        router.push(`/dashboard/courses/${token}`); // redirect to course page
      }
    };

    checkEnroll();
  }, [courseId, session, token, router]);

  // ✅ fetch course
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch("/api/courses/fetch-course", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course_id: courseId }),
        });

        const data = await res.json();

        if (data.success) {
          setCourse(data.course);
          if (data.course.curriculum?.length > 0) {
            setActiveLesson(data.course.curriculum[0]);
          }
        } else {
          router.push("/dashboard");
        }
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, router]);

  // ✅ fetch secure video token
  const fetchVideoToken = async (videoPath: string) => {
    setVideoLoading(true);
    try {
      const res = await fetch("/api/request-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoPath }),
      });

      const data = await res.json();
      setVideoToken(data.token || null);
    } finally {
      setVideoLoading(false);
    }
  };

  // ✅ on lesson change
  useEffect(() => {
    if (activeLesson?.video_path) {
      fetchVideoToken(activeLesson.video_path);
    }
  }, [activeLesson]);

  // ====== LOADING STATES ======
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader isLoading={loading} className=""/>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Verifying enrollment...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Course not found.
      </div>
    );
  }

  // ====== UI ======
  return (
    <div className="w-full mx-auto py-6 lg:py-10 flex flex-col lg:flex-row min-h-screen text-gray-900 dark:text-gray-100">

      {/* LEFT — Lessons */}
      <aside className="w-full lg:w-1/3 p-4 overflow-y-auto lg:h-screen">
        <h1 className="text-lg font-bold mb-2">{course.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{course.level}</p>

        <div className="space-y-2">
          {/* FIX: Added optional chaining '?' to safely access curriculum */}
          {course.curriculum?.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className={`flex justify-between p-3 rounded-lg cursor-pointer transition ${
                activeLesson?.id === lesson.id
                  ? "bg-blue-50 dark:bg-neutral-800"
                  : "hover:bg-gray-100 dark:hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <IconBrandParsinta
                  size={18}
                  className={
                    activeLesson?.id === lesson.id ? "text-blue-500" : "text-gray-400"
                  }
                />
                <span className="text-sm">{lesson.title}</span>
              </div>

              <IconPlayerPlay
                size={16}
                className={
                  activeLesson?.id === lesson.id ? "text-blue-500" : "text-gray-400"
                }
              />
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT — Video */}
      <div className="w-full lg:w-2/3 p-4">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {videoLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader isLoading={videoLoading} className=""/>
            </div>
          ) : videoToken ? (
            <video
              controls
              autoPlay
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-cover"
            >
              <source src={`/api/videos/stream?token=${videoToken}`} type="video/mp4" />
            </video>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-gray-500">
              <IconBrandYoutube size={50} />
              <p className="text-sm mt-1">Loading lesson session...</p>
            </div>
          )}
        </div>

        {activeLesson && (
          <h2 className="text-lg font-semibold mt-4">{activeLesson.title}</h2>
        )}
      </div>
    </div>
  );
}