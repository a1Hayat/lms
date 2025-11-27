// src/app/api/admin-dashboard/orders/route.ts
import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise"; // Import RowDataPacket
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Define the shape of the data returned by your SQL query
interface OrderRow extends RowDataPacket {
  id: number;
  created_at: Date;
  final_amount: number;
  payment_status: string;
  user_name: string;
  user_email: string;
  processed_by_name: string | null;
  course_id: number | null;
  resource_id: number | null;
  bundle_id: number | null;
  course_title: string | null;
  resource_title: string | null;
  bundle_title: string | null;
}

// Database connection
async function db() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

// Removed 'req' since it was unused
export async function POST() {
  const conn = await db();
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Add <OrderRow[]> generic here to tell TS what the rows look like
    const [rows] = await conn.execute<OrderRow[]>(
      `
      SELECT 
        o.id,
        o.created_at,
        o.final_amount,
        o.payment_status,
        u.name AS user_name,
        u.email AS user_email,
        p.name AS processed_by_name,
        oi.course_id,
        oi.resource_id,
        oi.bundle_id,
        c.title AS course_title,
        r.title AS resource_title,
        b.title AS bundle_title
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN users p ON o.processed_by = p.id
      LEFT JOIN courses c ON oi.course_id = c.id
      LEFT JOIN resources r ON oi.resource_id = r.id
      LEFT JOIN bundles b ON oi.bundle_id = b.id
      ORDER BY o.created_at DESC
    `
    );

    // Now 'order' is automatically typed as OrderRow
    const orders = rows.map((order) => ({
      id: order.id,
      created_at: order.created_at,
      final_amount: order.final_amount,
      payment_status: order.payment_status,
      item_title:
        order.course_title ||
        order.resource_title ||
        order.bundle_title ||
        "Item not found",
      user: {
        name: order.user_name,
        email: order.user_email,
      },
      processed_by_user: {
        name: order.processed_by_name,
      },
    }));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  } finally {
    conn.end();
  }
}