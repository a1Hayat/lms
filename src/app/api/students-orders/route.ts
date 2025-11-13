import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

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
    const { user_id } = await req.json(); // Student's ID

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch all orders for this user (regardless of payment status)
    const [rows]: any = await conn.execute(
      `
      SELECT
        o.id AS order_id,
        o.final_amount,
        o.created_at,
        o.payment_status,

        -- Determine item type
        CASE
          WHEN oi.bundle_id IS NOT NULL THEN 'Bundle'
          WHEN oi.course_id IS NOT NULL THEN 'Course'
          WHEN oi.resource_id IS NOT NULL THEN 'Resource'
          ELSE 'Unknown'
        END AS item_type,

        -- Get the item title
        COALESCE(b.title, c.title, r.title) AS item_title

      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN bundles b ON oi.bundle_id = b.id
      LEFT JOIN courses c ON oi.course_id = c.id
      LEFT JOIN resources r ON oi.resource_id = r.id

      WHERE o.user_id = ?

      ORDER BY o.created_at DESC
    `,
      [user_id]
    );

    const orders = rows.map((row: any) => ({
      id: row.order_id,
      final_amount: row.final_amount,
      created_at: row.created_at,
      payment_status: row.payment_status,
      item_type: row.item_type,
      item_title: row.item_title,
    }));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch student orders error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  } finally {
    conn.end();
  }
}
