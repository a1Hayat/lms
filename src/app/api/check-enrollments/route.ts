import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, course_id, resource_id } = await req.json();

    if (!user_id || (!course_id && !resource_id)) {
      return NextResponse.json(
        { success: false, message: "Missing params" },
        { status: 400 }
      );
    }

    // ✅ Check COURSE enrollment/order
    if (course_id) {
      const [rows] = await db.query(
        `SELECT id 
         FROM enrollments 
         WHERE user_id = ? AND course_id = ? 
         LIMIT 1`,
        [user_id, course_id]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json({ purchased: true, type: "course", reason: "already_enrolled" });
      }

      const [order] = await db.query(
        `SELECT oi.id 
         FROM order_items oi 
         JOIN orders o ON o.id = oi.order_id
         WHERE oi.course_id = ? AND o.user_id = ? 
         LIMIT 1`,
        [course_id, user_id]
      );

      if (Array.isArray(order) && order.length > 0) {
        return NextResponse.json({ purchased: true, type: "course", reason: "order_exists" });
      }
    }

    // ✅ Check RESOURCE enrollment/order
    if (resource_id) {
      const [rows] = await db.query(
        `SELECT id 
         FROM enrollments 
         WHERE user_id = ? AND resource_id = ? 
         LIMIT 1`,
        [user_id, resource_id]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json({ purchased: true, type: "resource", reason: "already_enrolled" });
      }

      const [order] = await db.query(
        `SELECT oi.id 
         FROM order_items oi 
         JOIN orders o ON o.id = oi.order_id
         WHERE oi.resource_id = ? AND o.user_id = ? 
         LIMIT 1`,
        [resource_id, user_id]
      );

      if (Array.isArray(order) && order.length > 0) {
        return NextResponse.json({ purchased: true, type: "resource", reason: "order_exists" });
      }
    }

    return NextResponse.json({ purchased: false });

  } catch (error) {
<<<<<<< HEAD
    console.error("Check purchase error:", error);
=======
    console.error("Purchase check error:", error);
>>>>>>> 6ad786e49aee854d19a6663a23e50c99a7d80348
    return NextResponse.json({ purchased: false, error: true });
  }
}
