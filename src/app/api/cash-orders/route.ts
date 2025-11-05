import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ success: false, message: "Missing user_id" }, { status: 400 });
    }

    const [orders]: any = await db.query(`
      SELECT
        o.id AS order_id,
        o.user_id,
        o.final_amount,
        o.payment_status,
        o.payment_method,
        o.created_at,
        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,
        oi.course_id,
        oi.resource_id,
        
        CASE WHEN oi.course_id IS NOT NULL THEN c.title
             WHEN oi.resource_id IS NOT NULL THEN r.title
        END AS item_title,

        CASE WHEN oi.course_id IS NOT NULL THEN 'course'
             WHEN oi.resource_id IS NOT NULL THEN 'resource'
        END AS item_type

      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN courses c ON oi.course_id = c.id
      LEFT JOIN resources r ON oi.resource_id = r.id
      WHERE o.payment_method = 'cash'
        AND o.processed_by = ?
      ORDER BY o.id DESC
    `, [user_id]);

    const formatted = orders.map((o: any) => ({
      order_id: o.order_id,
      item_title: o.item_title,
      item_type: o.item_type,
      final_amount: o.final_amount,
      payment_status: o.payment_status,
      created_at: o.created_at,
      user: {
        name: o.user_name,
        email: o.user_email,
        phone: o.user_phone,
      },
    }));

    return NextResponse.json({ success: true, orders: formatted });

  } catch (err: any) {
    console.error("Fetch cash orders error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
