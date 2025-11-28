import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ← Use your pool here
import { RowDataPacket } from "mysql2/promise";

// Bundle row type
interface BundleRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price: number;
}

// Item row type
interface ItemRow extends RowDataPacket {
  id: number;
  title: string;
  thumbnail: string;
  type: "course" | "resource";
}

export async function POST(req: Request) {
  try {
    const { bundle_id } = await req.json();

    if (!bundle_id) {
      return NextResponse.json(
        { success: false, message: "Missing bundle_id" },
        { status: 400 }
      );
    }

    // 1. Fetch bundle details
    const [bundleRows] = await db.execute<BundleRow[]>(
      `
      SELECT id, title, description, price, discount_price
      FROM bundles
      WHERE id = ?
      `,
      [bundle_id]
    );

    if (!bundleRows.length) {
      return NextResponse.json(
        { success: false, message: "Bundle not found" },
        { status: 404 }
      );
    }

    const bundle = bundleRows[0];

    // 2. Fetch all items (courses + resources) in this bundle
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
      [bundle_id, bundle_id]
    );

    // 3. Merge data
    const fullBundle = {
      ...bundle,
      items: items || [],
    };

    return NextResponse.json({ success: true, bundle: fullBundle });
  } catch (error) {
    console.error("Failed to fetch bundle:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
