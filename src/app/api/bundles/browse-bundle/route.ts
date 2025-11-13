import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection function
async function db() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

export async function GET(req: Request) {
  const conn = await db();
  try {
    // 1. Fetch all bundles
    const [bundles]: any = await conn.execute(
      `SELECT id, title, description, price, discount_price FROM bundles ORDER BY created_at DESC`
    );

    if (!bundles.length) {
      return NextResponse.json({ bundles: [] });
    }

    // 2. Fetch items for each bundle
    const bundlesWithItems = await Promise.all(
      bundles.map(async (bundle: any) => {
        // This query joins bundle_items with courses and resources tables
        // to get the details of each item in the bundle.
        const [items]: any = await conn.execute(
          `
          (SELECT 
            c.id, 
            c.title, 
            c.thumbnail, 
            'course' as type 
           FROM bundle_items bi
           JOIN courses c ON bi.course_id = c.id
           WHERE bi.bundle_id = ?)
          UNION
          (SELECT 
            r.id, 
            r.title, 
            r.thumbnail, 
            'resource' as type 
           FROM bundle_items bi
           JOIN resources r ON bi.resource_id = r.id
           WHERE bi.bundle_id = ?)
        `,
          [bundle.id, bundle.id]
        );
        
        return {
          ...bundle,
          items: items, // Attach the array of items to the bundle object
        };
      })
    );

    return NextResponse.json({ bundles: bundlesWithItems });

  } catch (error) {
    console.error("Failed to fetch bundles:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    conn.end();
  }
}