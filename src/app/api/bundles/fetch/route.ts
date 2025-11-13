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

// GET handler for fetching all bundles
export async function GET(req: Request) {
  const conn = await db();
  try {
    // 1. Fetch all bundles
    const [bundles]: any = await conn.execute(
      `SELECT * FROM bundles ORDER BY created_at DESC`
    );

    if (!bundles.length) {
      return NextResponse.json({ success: true, bundles: [] });
    }

    // 2. Fetch all items (courses and resources) for all bundles
    const [items]: any = await conn.execute(`
      SELECT 
        bi.bundle_id, 
        c.id as course_id, 
        c.title as course_title, 
        c.thumbnail as course_thumbnail, 
        r.id as resource_id, 
        r.title as resource_title, 
        r.thumbnail as resource_thumbnail 
      FROM bundle_items bi 
      LEFT JOIN courses c ON bi.course_id = c.id 
      LEFT JOIN resources r ON bi.resource_id = r.id
    `);

    // 3. Group items by bundle_id into a Map for efficient lookup
    const itemsMap = new Map<number, any[]>();
    for (const item of items) {
      if (!itemsMap.has(item.bundle_id)) {
        itemsMap.set(item.bundle_id, []);
      }
      const bundleItems = itemsMap.get(item.bundle_id);
      
      if (item.course_id) {
        bundleItems.push({
          id: item.course_id,
          title: item.course_title,
          thumbnail: item.course_thumbnail,
          type: 'course'
        });
      } else if (item.resource_id) {
        bundleItems.push({
          id: item.resource_id,
          title: item.resource_title,
          thumbnail: item.resource_thumbnail,
          type: 'resource'
        });
      }
    }

    // 4. Combine bundles with their respective items
    const result = bundles.map((bundle: any) => ({
      ...bundle,
      items: itemsMap.get(bundle.id) || []
    }));

    return NextResponse.json({ success: true, bundles: result });

  } catch (error) {
    console.error("Fetch all bundles error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  } finally {
    conn.end();
  }
}