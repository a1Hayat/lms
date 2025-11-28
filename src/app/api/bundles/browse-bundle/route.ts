import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface BundleRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price: number;
}

interface ItemRow extends RowDataPacket {
  id: number;
  title: string;
  thumbnail: string;
  type: "course" | "resource";
}

export async function GET() {
  try {
    // 1. Fetch all bundles
    const [bundles] = await db.execute<BundleRow[]>(
      `SELECT id, title, description, price, discount_price 
       FROM bundles 
       ORDER BY created_at DESC`
    );

    if (!bundles.length) {
      return NextResponse.json({ bundles: [] });
    }

    // 2. Fetch items for each bundle
    const bundlesWithItems = await Promise.all(
      bundles.map(async (bundle) => {
        const [items] = await db.execute<ItemRow[]>(
          `
          (SELECT 
            c.id, 
            c.title, 
            c.thumbnail, 
            'course' AS type 
           FROM bundle_items bi
           JOIN courses c ON bi.course_id = c.id
           WHERE bi.bundle_id = ?)
          UNION
          (SELECT 
            r.id, 
            r.title, 
            r.thumbnail, 
            'resource' AS type 
           FROM bundle_items bi
           JOIN resources r ON bi.resource_id = r.id
           WHERE bi.bundle_id = ?)
        `,
          [bundle.id, bundle.id]
        );

        return {
          ...bundle,
          items,
        };
      })
    );

    return NextResponse.json({ bundles: bundlesWithItems });
  } catch (error) {
    console.error("Failed to fetch bundles:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
