import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { course_id } = await req.json();

    if (!course_id) {
      return NextResponse.json({ error: "Missing course_id" }, { status: 400 });
    }

    await db.query("DELETE FROM courses WHERE id = ?", [course_id]);

    return NextResponse.json({
      message: "Course deleted successfully (cascade applied if configured).",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
