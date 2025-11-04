import { NextResponse } from "next/server";
import {db} from "@/lib/db"; // adjust path if needed

export async function POST(req: Request) {

  try {
    const { course_id } = await req.json();

    if (!course_id) {
      return NextResponse.json({ success: false, message: "Missing course_id" }, { status: 400 });
    }

    // Fetch course details
    const [courseData] = await db.query(
      "SELECT * FROM courses WHERE id = ?",
      [course_id]
    );

    if (!Array.isArray(courseData) || courseData.length === 0) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });

    }

    // Fetch lessons (including video path)
    const [lessons] = await db.query(
      "SELECT id, title, length, video_path FROM lessons WHERE course_id = ?",
      [course_id]
    );

    const course = {
      ...courseData[0],
      curriculum: lessons || [],
    };

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Fetch course error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
