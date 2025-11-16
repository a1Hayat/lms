// app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Adjust path if needed
import { db } from "@/lib/db"; // Import the shared pool

// Helper to get dates for the last 7 days (for the chart)
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // Format as YYYY-MM-DD
    days.push(d.toLocaleDateString("en-CA"));
  }
  return days;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Admin-only route
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // --- We can run all queries concurrently for better performance ---
    const [
      [statsRows],
      [graphRows],
      [ordersRows],
      [submissionRows]
    ] = await Promise.all([
      // Query 1: Get Stat Cards Data
      db.execute(
        `SELECT 
          (SELECT COUNT(*) FROM courses) AS total_courses,
          (SELECT COUNT(*) FROM resources) AS total_resources,
          (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
          (SELECT COUNT(*) FROM bundles) AS total_bundles;`
      ),
      // Query 2: Get Order Graph Data
      db.execute(
        `SELECT 
            DATE_FORMAT(created_at, '%Y-%m-%d') as date, 
            COUNT(*) as count 
         FROM orders 
         WHERE created_at >= CURDATE() - INTERVAL 6 DAY 
         GROUP BY date
         ORDER BY date ASC;`
      ),
      // Query 3: Get Today's Orders
      db.execute(
        `SELECT 
            o.id as order_id, o.final_amount, o.payment_status, o.created_at,
            u.name AS student_name, p.name AS processed_by_name,
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
      ),
      // Query 4: Get Today's Contact Submissions
      db.execute(
        `SELECT id, name, email, message, submitted_at 
         FROM contact_submissions 
         WHERE DATE(submitted_at) = CURDATE() 
         ORDER BY submitted_at DESC;`
      )
    ]);

    // --- Process Stats ---
    const stats = (statsRows as any)[0];

    // --- Process Graph Data ---
    const last7Days = getLast7Days();
    const graphDataMap = new Map((graphRows as any[]).map((r: any) => [r.date, r.count]));
    const chartData = last7Days.map((date) => ({
      name: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: graphDataMap.get(date) || 0,
    }));

    // --- Return Combined Data ---
    return NextResponse.json({
      success: true,
      stats,
      chartData,
      todayOrders: ordersRows,
      todaySubmissions: submissionRows, // <-- Combined data
    });
    
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}