import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Function to create a DB connection
async function db() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

// Helper to get dates for the last 7 days (for the chart)
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // Format as YYYY-MM-DD
    days.push(d.toLocaleDateString('en-CA')); 
  }
  return days;
}

export async function GET(req: Request) {
  const conn = await db();
  try {
    const session = await getServerSession(authOptions);

    // Admin-only route
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 1. Get Stat Cards Data
    const [statsRows]: any = await conn.execute(
      `SELECT 
        (SELECT COUNT(*) FROM courses) AS total_courses,
        (SELECT COUNT(*) FROM resources) AS total_resources,
        (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
        (SELECT COUNT(*) FROM bundles) AS total_bundles;`
    );
    const stats = statsRows[0];

    // 2. Get Order Graph Data (Last 7 Days)
    const [graphRows]: any = await conn.execute(
      `SELECT 
          DATE_FORMAT(created_at, '%Y-%m-%d') as date, 
          COUNT(*) as count 
       FROM orders 
       WHERE created_at >= CURDATE() - INTERVAL 6 DAY 
       GROUP BY date
       ORDER BY date ASC;`
    );

    // Process graph data to fill in empty days
    const last7Days = getLast7Days();
    const graphDataMap = new Map(graphRows.map((r: any) => [r.date, r.count]));
    const chartData = last7Days.map(date => ({
      name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: graphDataMap.get(date) || 0,
    }));

    // 3. Get Today's Orders
    // We get "today" based on the server's date. 
    // Using CURDATE() is reliable for this.
    const [ordersRows]: any = await conn.execute(
      `SELECT 
          o.id as order_id,
          o.final_amount,
          o.payment_status,
          o.created_at,
          u.name AS student_name,
          p.name AS processed_by_name,
          COALESCE(c.title, r.title, b.title) AS item_title
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN users p ON o.processed_by = p.id
       JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN courses c ON oi.course_id = c.id
       LEFT JOIN resources r ON oi.resource_id = r.id
       LEFT JOIN bundles b ON oi.bundle_id = b.id
       WHERE DATE(o.created_at) = CURDATE()
       ORDER BY o.created_at DESC;`
    );
    
    return NextResponse.json({
      success: true,
      stats,
      chartData,
      todayOrders: ordersRows,
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  } finally {
    conn.end();
  }
}