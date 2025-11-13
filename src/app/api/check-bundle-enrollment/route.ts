import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection function
async function db() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

export async function POST(req: Request) {
  const conn = await db();
  try {
    const { user_id, bundle_id } = await req.json();

    if (!user_id || !bundle_id) {
      return NextResponse.json({ success: false, message: "Missing required data" }, { status: 400 });
    }

    // 1. Get all item IDs in the bundle
    const [bundleItems]: any = await conn.execute(
      `SELECT course_id, resource_id FROM bundle_items WHERE bundle_id = ?`,
      [bundle_id]
    );

    if (bundleItems.length === 0) {
      // If bundle is empty, consider it "purchased" by default
      return NextResponse.json({ purchased: true });
    }

    // 2. Get all enrollment IDs for the user
    const [userEnrollments]: any = await conn.execute(
      `SELECT course_id, resource_id FROM enrollments WHERE user_id = ?`,
      [user_id]
    );

    // 3. Create Sets for fast lookup
    const userCourseIds = new Set(userEnrollments.map((e: any) => e.course_id).filter(Boolean));
    const userResourceIds = new Set(userEnrollments.map((e: any) => e.resource_id).filter(Boolean));

    // 4. Check if user is enrolled in ALL bundle items
    let isFullyEnrolled = true;
    for (const item of bundleItems) {
      if (item.course_id && !userCourseIds.has(item.course_id)) {
        isFullyEnrolled = false;
        break;
      }
      if (item.resource_id && !userResourceIds.has(item.resource_id)) {
        isFullyEnrolled = false;
        break;
      }
    }

    return NextResponse.json({ purchased: isFullyEnrolled });

  } catch (error) {
    console.error("Failed to check bundle enrollment:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  } finally {
    conn.end();
  }
}