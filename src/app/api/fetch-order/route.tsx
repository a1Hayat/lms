import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { order_id } = await req.json();

    const [orderRows] = await db.query(
      `SELECT o.*, u.name, u.email, u.phone, oi.course_id, c.title 
       FROM orders o
       JOIN users u ON u.id = o.user_id
       JOIN order_items oi ON oi.order_id = o.id
       JOIN courses c ON c.id = oi.course_id
       WHERE o.id = ?`,
      [order_id]
    );

    if (!Array.isArray(orderRows) || orderRows.length === 0) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    const row = orderRows[0];

    return NextResponse.json({
      success: true,
      order: {
        id: row.id,
        final_amount: row.final_amount,
        payment_status: row.payment_status,
        user: {
          name: row.name,
          email: row.email,
          phone: row.phone,
          id: row.user_id
        },
        course: {
          title: row.title,
          id: row.course_id
        }
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
