import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ← IMPORTANT
import { RowDataPacket } from "mysql2/promise";

// 1. Define Types
interface BundleRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price: number;
  created_at: Date;
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
  type: "course" | "resource";
}

export async function GET() {
  try {
    // 2. Fetch all bundles
    const [bundles] = await db.execute<BundleRow[]>(
      `SELECT * FROM bundles ORDER BY created_at DESC`
    );

    if (!bundles.length) {
      return NextResponse.json({ success: true, bundles: [] });
    }

    // 3. Fetch all items for all bundles
    const [items] = await db.execute<RawItemRow[]>(`
      SELECT 
        bi.bundle_id, 
        c.id AS course_id, 
        c.title AS course_title, 
        c.thumbnail AS course_thumbnail, 
        r.id AS resource_id, 
        r.title AS resource_title, 
        r.thumbnail AS resource_thumbnail
      FROM bundle_items bi
      LEFT JOIN courses c ON bi.course_id = c.id
      LEFT JOIN resources r ON bi.resource_id = r.id
    `);

    // 4. Group items by bundle_id
    const itemsMap = new Map<number, ProcessedItem[]>();

    for (const item of items) {
      if (!itemsMap.has(item.bundle_id)) {
        itemsMap.set(item.bundle_id, []);
      }

      const bundleItems = itemsMap.get(item.bundle_id)!;

      if (item.course_id) {
        bundleItems.push({
          id: item.course_id,
          title: item.course_title!,
          thumbnail: item.course_thumbnail,
          type: "course",
        });
      } else if (item.resource_id) {
        bundleItems.push({
          id: item.resource_id,
          title: item.resource_title!,
          thumbnail: item.resource_thumbnail,
          type: "resource",
        });
      }
    }

    // 5. Merge bundles with items
    const result = bundles.map((bundle) => ({
      ...bundle,
      items: itemsMap.get(bundle.id) || [],
    }));

    return NextResponse.json({ success: true, bundles: result });
  } catch (error) {
    console.error("Fetch all bundles error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
