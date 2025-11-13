import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ success: false, message: "Missing user_id" }, { status: 400 });
    }

    // Fetch enrolled resources
    const [resources]: any = await db.query(
      `SELECT r.*
       FROM enrollments e
       JOIN resources r ON r.id = e.resource_id
       WHERE e.user_id = ?`,
      [user_id]
    );

    return NextResponse.json({ success: true, resources });

  } catch (error) {
    console.error("Error fetching enrolled resources:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
