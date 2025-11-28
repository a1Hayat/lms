import { NextResponse } from "next/server";
import mysql, { ResultSetHeader } from "mysql2/promise"; // Import the specific type for INSERT results
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { name, originalPrice, description, discountedPrice, courses, resources } = await req.json();


  try {
    // FIX: Use generic <ResultSetHeader> instead of : any
    // This provides proper typing for 'insertId' and 'affectedRows'
    const [res] = await db.execute<ResultSetHeader>(
      `INSERT INTO bundles (title, description, price, discount_price) VALUES (?, ?, ?, ?)`,
      [name, description, originalPrice, discountedPrice]
    );

    const bundleId = res.insertId;

    if (courses && courses.length > 0) {
      for (const c of courses) {
        await db.execute(`INSERT INTO bundle_items (bundle_id, course_id) VALUES (?, ?)`, [
          bundleId,
          c,
        ]);
      }
    }

    if (resources && resources.length > 0) {
      for (const r of resources) {
        await db.execute(`INSERT INTO bundle_items (bundle_id, resource_id) VALUES (?, ?)`, [
          bundleId,
          r,
        ]);
      }
    }

    return NextResponse.json({ message: "Bundle created" });

  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    // Always good practice to close the connection, though strictly not required in serverless if not pooling
    await db.end();
  }
}