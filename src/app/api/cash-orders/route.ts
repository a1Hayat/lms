import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

// Define the shape of the database row
interface CashOrderRow extends RowDataPacket {
  order_id: number;
  final_amount: number;
  created_at: Date;
  student_name: string;
  student_email: string;
  item_title: string | null;
}

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
    const { user_id } = await req.json(); // This is the ID of the cashier

    if (!user_id) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // This query fetches all 'paid' 'cash' orders processed by the cashier (user_id)
    // It also joins all necessary tables to get the student's name and the item's title.
    // FIX: Use generic <CashOrderRow[]> instead of : any
    const [rows] = await conn.execute<CashOrderRow[]>(
      `
      SELECT
        o.id AS order_id,
        o.final_amount,
        o.created_at,
        
        -- Student's info
        u.name AS student_name,
        u.email AS student_email,
        
        -- Get the item title
        COALESCE(b.title, c.title, r.title) AS item_title

      FROM orders o
      -- Join for Student Info (the one who bought the item)
      JOIN users u ON o.user_id = u.id 
      -- Join for Item Info
      JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN bundles b ON oi.bundle_id = b.id
      LEFT JOIN courses c ON oi.course_id = c.id
      LEFT JOIN resources r ON oi.resource_id = r.id

      WHERE 
        o.processed_by = ?  -- Filter by the cashier's ID
        AND o.payment_status = 'paid'
        AND o.payment_method = 'cash'

      ORDER BY
        o.created_at DESC
    `,
      [user_id]
    );

    // Format the response to match what the frontend expects
    // 'row' is now automatically inferred as CashOrderRow
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

    return NextResponse.json({ success: true, orders: orders });

  } catch (error) {
    console.error("Fetch cash orders error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  } finally {
    conn.end();
  }
}