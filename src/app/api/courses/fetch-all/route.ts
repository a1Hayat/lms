import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Fetch all courses with lesson count + instructor name
    const [courses] = await db.query(`
      SELECT 
        c.id,
        c.title,
        c.level,
        c.description,
        c.thumbnail,
        c.price,
        c.instructor_id,
        u.name AS instructor_name,       -- ✅ from users table
        c.created_at,
        COUNT(l.id) AS lessons_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id   -- ✅ join users
      LEFT JOIN lessons l ON l.course_id = c.id     -- ✅ join lessons
      GROUP BY c.id, u.name
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json({ courses });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
