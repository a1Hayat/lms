import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ← USE your pool here
import { RowDataPacket } from "mysql2/promise";

// Define the shape of the database row
interface CashOrderRow extends RowDataPacket {
  order_id: number;
  final_amount: number;
  created_at: Date;
  student_name: string;
  student_email: string;
  item_title: string | null;
}

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json(); // cashier ID

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Query: Fetch all 'cash' + 'paid' orders handled by this cashier
    const [rows] = await db.execute<CashOrderRow[]>(
      `
      SELECT
        o.id AS order_id,
        o.final_amount,
        o.created_at,

        -- Student info
        u.name AS student_name,
        u.email AS student_email,

        -- Item title (bundle / course / resource)
        COALESCE(b.title, c.title, r.title) AS item_title

      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN bundles b ON oi.bundle_id = b.id
      LEFT JOIN courses c ON oi.course_id = c.id
      LEFT JOIN resources r ON oi.resource_id = r.id

      WHERE 
        o.processed_by = ?
        AND o.payment_status = 'paid'
        AND o.payment_method = 'cash'

      ORDER BY o.created_at DESC
      `,
      [user_id]
    );

    // Format final response
    const orders = rows.map((row) => ({
      order_id: row.order_id,
      final_amount: row.final_amount,
      created_at: row.created_at,
      user: {
        name: row.student_name,
        email: row.student_email,
      },
      item_title: row.item_title,
    }));

    return NextResponse.json({ success: true, orders });

  } catch (error) {
    console.error("Fetch cash orders error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
