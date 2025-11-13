import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    const [orderRows]: any = await db.query(
      `SELECT 
          o.id,
          o.final_amount,
          o.payment_status,
          o.user_id,
          u.name AS user_name,
          u.email AS user_email,
          u.phone AS user_phone,
          oi.course_id,
          oi.resource_id,
          c.title AS course_title,
          r.title AS resource_title
       FROM orders o
       JOIN users u ON u.id = o.user_id
       JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN courses c ON c.id = oi.course_id
       LEFT JOIN resources r ON r.id = oi.resource_id
       WHERE o.id = ?`,
      [order_id]
    );

    if (!orderRows || orderRows.length === 0) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    const row = orderRows[0];

    // Determine item type
    let item = null;
    if (row.course_id) item = { type: "course", id: row.course_id, title: row.course_title };
    if (row.resource_id) item = { type: "resource", id: row.resource_id, title: row.resource_title };

    return NextResponse.json({
      success: true,
      order: {
        id: row.id,
        final_amount: row.final_amount,
        payment_status: row.payment_status,
        user: {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          phone: row.user_phone,
        },
        item,
      },
    });

  } catch (e) {
    console.error("Order Fetch Error:", e);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
