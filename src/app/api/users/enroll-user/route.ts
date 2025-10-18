import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, course_id, resource_id } = await req.json();

    // Check required fields
    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Ensure only one of course_id or resource_id is provided
    if ((course_id && resource_id) || (!course_id && !resource_id)) {
      return NextResponse.json(
        { error: "Provide exactly one of course_id or resource_id" },
        { status: 400 }
      );
    }

    // Insert into enrolled
    await db.query(
      `
      INSERT INTO enrollments (user_id, course_id, resource_id)
      VALUES (?, ?, ?)
      `,
      [user_id, course_id || null, resource_id || null]
    );

    return NextResponse.json({
      message: "Enrollment recorded successfully",
      inserted: { user_id, course_id: course_id || null, resource_id: resource_id || null },
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
