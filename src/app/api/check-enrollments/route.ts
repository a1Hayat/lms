import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, course_id } = await req.json();

    if (!user_id || !course_id) {
      return NextResponse.json({ success: false, message: "Missing params" }, { status: 400 });
    }

    // ✅ Check if enrolled
    const [enroll] = await db.query(
      "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1",
      [user_id, course_id]
    );

    if (Array.isArray(enroll) && enroll.length > 0) {
      return NextResponse.json({ purchased: true, reason: "already_enrolled" });
    }

    // ✅ Check if user already purchased & payment pending/complete
    const [order] = await db.query(
      `SELECT oi.id 
       FROM order_items oi 
       JOIN orders o ON o.id = oi.order_id
       WHERE oi.course_id = ? AND o.user_id = ? LIMIT 1`,
      [course_id, user_id]
    );

    if (Array.isArray(order) && order.length > 0) {
      return NextResponse.json({ purchased: true, reason: "order_exists" });
    }

    return NextResponse.json({ purchased: false });

  } catch (error) {
    console.error("Check purchase error:", error);
    return NextResponse.json({ purchased: false, error: true });
  }
}
