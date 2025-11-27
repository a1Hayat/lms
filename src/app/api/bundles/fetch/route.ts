import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

// 1. Define Types
interface BundleRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price: number;
  created_at: Date;
  // Add other bundle columns here if needed
}

interface RawItemRow extends RowDataPacket {
  bundle_id: number;
  course_id: number | null;
  course_title: string | null;
  course_thumbnail: string | null;
  resource_id: number | null;
  resource_title: string | null;
  resource_thumbnail: string | null;
}

interface ProcessedItem {
  id: number;
  title: string;
  thumbnail: string | null;
  type: 'course' | 'resource';
}

async function db() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

// GET handler for fetching all bundles
// Removed unused 'req' argument
export async function GET() {
  const conn = await db();
  try {
    // 2. Fetch all bundles
    const [bundles] = await conn.execute<BundleRow[]>(
      `SELECT * FROM bundles ORDER BY created_at DESC`
    );

    if (!bundles.length) {
      return NextResponse.json({ success: true, bundles: [] });
    }

    // 3. Fetch all items (courses and resources) for all bundles
    const [items] = await conn.execute<RawItemRow[]>(`
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

    // 4. Group items by bundle_id into a Map
    const itemsMap = new Map<number, ProcessedItem[]>();
    
    for (const item of items) {
      if (!itemsMap.has(item.bundle_id)) {
        itemsMap.set(item.bundle_id, []);
      }
      // '!' assertion is safe here because we just set it above
      const bundleItems = itemsMap.get(item.bundle_id)!;
      
      if (item.course_id) {
        bundleItems.push({
          id: item.course_id,
          title: item.course_title!, // we know it exists if ID exists
          thumbnail: item.course_thumbnail,
          type: 'course'
        });
      } else if (item.resource_id) {
        bundleItems.push({
          id: item.resource_id,
          title: item.resource_title!,
          thumbnail: item.resource_thumbnail,
          type: 'resource'
        });
      }
    }

    // 5. Combine bundles with their respective items
    // 'bundle' is automatically typed as BundleRow
    const result = bundles.map((bundle) => ({
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