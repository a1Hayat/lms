import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ success: false, message: "Missing user_id" }, { status: 400 });
    }

    // ✅ Fetch enrolled courses
    const [rows] = await db.query(
      `SELECT c.* 
       FROM enrollments e 
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = ?`,
      [user_id]
    );

    return NextResponse.json({
      success: true,
      courses: rows || [],
    });
  } catch (error) {
    console.error("Fetch enrolled courses error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
