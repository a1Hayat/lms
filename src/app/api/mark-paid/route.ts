import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth"; // adjust path if needed
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ success: false, message: "Missing order_id" }, { status: 400 });
    }

    // Fetch order details + order items
    const [rows]: any = await db.query(
      `SELECT o.user_id, oi.course_id, oi.resource_id
       FROM orders o 
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = ? LIMIT 1`,
      [order_id]
    );

    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    const order = rows[0];

    // Mark Paid + record who processed
    await db.query(
      `UPDATE orders 
       SET payment_status='paid', processed_by=? 
       WHERE id = ?`,
      [session.user.id, order_id]
    );

    // Enroll user
    if (order.course_id) {
      await db.query(
        `INSERT IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)`,
        [order.user_id, order.course_id]
      );
    }

    if (order.resource_id) {
      await db.query(
        `INSERT IGNORE INTO enrollments (user_id, resource_id) VALUES (?, ?)`,
        [order.user_id, order.resource_id]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment marked and user enrolled ✅",
    });

  } catch (error) {
    console.error("mark-paid error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
