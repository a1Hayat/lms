import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // using pool
import { RowDataPacket } from "mysql2/promise";

// Define the shape of the order row returned by the query
interface OrderRow extends RowDataPacket {
  id: number;
  final_amount: number;
  payment_status: string;
  name: string;
  email: string;
  phone: string;
  item_type: string;
  item_title: string | null;
}

export async function POST(req: Request) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Using pool directly
    const [rows] = await db.execute<OrderRow[]>(
      `
      SELECT
        o.id, 
        o.final_amount, 
        o.payment_status,
        u.name, 
        u.email, 
        u.phone,
        CASE
          WHEN oi.bundle_id IS NOT NULL THEN 'Bundle'
          WHEN oi.course_id IS NOT NULL THEN 'Course'
          WHEN oi.resource_id IS NOT NULL THEN 'Resource'
          ELSE 'Unknown'
        END AS item_type,
        COALESCE(b.title, c.title, r.title) AS item_title
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN bundles b ON oi.bundle_id = b.id
      LEFT JOIN courses c ON oi.course_id = c.id
      LEFT JOIN resources r ON oi.resource_id = r.id
      WHERE o.id = ?
      LIMIT 1
    `,
      [order_id]
    );

    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    const row = rows[0];

    const orderDetails = {
      id: row.id,
      final_amount: row.final_amount,
      payment_status: row.payment_status,
      user: {
        name: row.name,
        email: row.email,
        phone: row.phone,
      },
      item: {
        type: row.item_type,
        title: row.item_title,
      },
    };

    return NextResponse.json({ success: true, order: orderDetails });
  } catch (error) {
    console.error("Fetch order error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
