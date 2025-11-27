// app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2"; // Import this to type DB rows

// 1. Define Types for your Database Responses
interface StatsRow extends RowDataPacket {
  total_courses: number;
  total_resources: number;
  total_students: number;
  total_bundles: number;
}

interface GraphRow extends RowDataPacket {
  date: string;
  count: number;
}

// Helper to get dates for the last 7 days
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString("en-CA"));
  }
  return days;
}

// 2. Removed 'req' argument since it was unused
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const [
      [statsRows],
      [graphRows],
      [ordersRows],
      [submissionRows]
    ] = await Promise.all([
      db.execute(
        `SELECT 
          (SELECT COUNT(*) FROM courses) AS total_courses,
          (SELECT COUNT(*) FROM resources) AS total_resources,
          (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
          (SELECT COUNT(*) FROM bundles) AS total_bundles;`
      ),
      db.execute(
        `SELECT 
            DATE_FORMAT(created_at, '%Y-%m-%d') as date, 
            COUNT(*) as count 
         FROM orders 
         WHERE created_at >= CURDATE() - INTERVAL 6 DAY 
         GROUP BY date
         ORDER BY date ASC;`
      ),
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
      db.execute(
        `SELECT id, name, email, message, submitted_at 
         FROM contact_submissions 
         WHERE DATE(submitted_at) = CURDATE() 
         ORDER BY submitted_at DESC;`
      )
    ]);

    // 3. Process Stats: Cast to StatsRow[] instead of 'any'
    const stats = (statsRows as StatsRow[])[0];

    // 4. Process Graph Data: Cast to GraphRow[]
    const last7Days = getLast7Days();
    
    // We cast graphRows to GraphRow[], so 'r' is now automatically typed
    const graphDataMap = new Map(
      (graphRows as GraphRow[]).map((r) => [r.date, r.count])
    );

    const chartData = last7Days.map((date) => ({
      name: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: graphDataMap.get(date) || 0,
    }));

    return NextResponse.json({
      success: true,
      stats,
      chartData,
      todayOrders: ordersRows,
      todaySubmissions: submissionRows,
    });
    
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}