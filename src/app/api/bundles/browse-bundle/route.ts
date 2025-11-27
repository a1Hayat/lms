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

// Define the shape of the Item row (course or resource)
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

// Removed 'req' since it was unused
export async function GET() {
  const conn = await db();
  try {
    // 1. Fetch all bundles
    // Use generic <BundleRow[]> to type the result
    const [bundles] = await conn.execute<BundleRow[]>(
      `SELECT id, title, description, price, discount_price FROM bundles ORDER BY created_at DESC`
    );

    if (!bundles.length) {
      return NextResponse.json({ bundles: [] });
    }

    // 2. Fetch items for each bundle
    const bundlesWithItems = await Promise.all(
      bundles.map(async (bundle) => {
        // This query joins bundle_items with courses and resources tables
        // to get the details of each item in the bundle.
        // Use generic <ItemRow[]> to type the result
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