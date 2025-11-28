import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ← use your shared pool
import { RowDataPacket } from "mysql2/promise";

// 1. Define Types
interface ItemRow extends RowDataPacket {
  course_id: number | null;
  resource_id: number | null;
}

export async function POST(req: Request) {
  try {
    const { user_id, bundle_id } = await req.json();

    if (!user_id || !bundle_id) {
      return NextResponse.json(
        { success: false, message: "Missing required data" },
        { status: 400 }
      );
    }

    // 2. Get all item IDs inside the bundle
    const [bundleItems] = await db.execute<ItemRow[]>(
      `SELECT course_id, resource_id 
       FROM bundle_items 
       WHERE bundle_id = ?`,
      [bundle_id]
    );

    // If bundle contains no items → treat as already purchased
    if (bundleItems.length === 0) {
      return NextResponse.json({ purchased: true });
    }

    // 3. Get all enrollment items for the user
    const [userEnrollments] = await db.execute<ItemRow[]>(
      `SELECT course_id, resource_id 
       FROM enrollments 
       WHERE user_id = ?`,
      [user_id]
    );

    // 4. Convert to sets for fast lookup
    const userCourseIds = new Set(
      userEnrollments.map((e) => e.course_id).filter(Boolean)
    );
    const userResourceIds = new Set(
      userEnrollments.map((e) => e.resource_id).filter(Boolean)
    );

    // 5. Confirm user has **ALL** items in the bundle
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
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
