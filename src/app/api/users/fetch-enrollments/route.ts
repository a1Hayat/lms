/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing user_id" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT course_id, resource_id FROM enrollments WHERE user_id = ?",
      [user_id]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({
        user_id,
        courses_id: [],
        resources_id: [],
      });
    }

    // Separate course_ids and resource_ids cleanly
    const courses_id = rows
      .map((r) => r.course_id)
      .filter((id) => id !== null);

    const resources_id = rows
      .map((r) => r.resource_id)
      .filter((id) => id !== null);

    return NextResponse.json({
      user_id,
      courses_id,
      resources_id,
    });
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
