import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

// Define the shape of the Bundle row
interface BundleRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price: number;
}

// Define the shape of the Item row
interface ItemRow extends RowDataPacket {
  id: number;
  title: string;
  thumbnail: string;
  type: 'course' | 'resource';
}

// Database connection function
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
    const { bundle_id } = await req.json();

    if (!bundle_id) {
      return NextResponse.json({ success: false, message: "Missing bundle_id" }, { status: 400 });
    }

    // 1. Fetch the bundle details
    // FIX: Use generic <BundleRow[]> instead of : any
    const [bundleRows] = await conn.execute<BundleRow[]>(
      `SELECT id, title, description, price, discount_price 
       FROM bundles 
       WHERE id = ?`,
      [bundle_id]
    );

    if (!bundleRows.length) {
      return NextResponse.json({ success: false, message: "Bundle not found" }, { status: 404 });
    }
    const bundle = bundleRows[0];

    // 2. Fetch all items (courses and resources) in the bundle
    // FIX: Use generic <ItemRow[]> instead of : any
    const [items] = await conn.execute<ItemRow[]>(
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
      [bundle_id, bundle_id]
    );

    // 3. Combine and return
    const fullBundleData = {
      ...bundle,
      items: items || [],
    };

    return NextResponse.json({ success: true, bundle: fullBundleData });

  } catch (error) {
    console.error("Failed to fetch bundle:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  } finally {
    conn.end();
  }
}