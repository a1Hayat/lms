import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

// 1. Define Types
interface ItemRow extends RowDataPacket {
  course_id: number | null;
  resource_id: number | null;
}

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

    // 2. Get all item IDs in the bundle
    // FIX: Use generic <ItemRow[]> instead of : any
    const [bundleItems] = await conn.execute<ItemRow[]>(
      `SELECT course_id, resource_id FROM bundle_items WHERE bundle_id = ?`,
      [bundle_id]
    );

    if (bundleItems.length === 0) {
      // If bundle is empty, consider it "purchased" by default
      return NextResponse.json({ purchased: true });
    }

    // 3. Get all enrollment IDs for the user
    // FIX: Use generic <ItemRow[]> instead of : any
    const [userEnrollments] = await conn.execute<ItemRow[]>(
      `SELECT course_id, resource_id FROM enrollments WHERE user_id = ?`,
      [user_id]
    );

    // 4. Create Sets for fast lookup
    // Typescript now infers 'e' correctly as ItemRow
    const userCourseIds = new Set(userEnrollments.map((e) => e.course_id).filter(Boolean));
    const userResourceIds = new Set(userEnrollments.map((e) => e.resource_id).filter(Boolean));

    // 5. Check if user is enrolled in ALL bundle items
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