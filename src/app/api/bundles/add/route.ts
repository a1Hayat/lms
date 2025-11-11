import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  const { name, originalPrice, description, discountedPrice, courses, resources } = await req.json();

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
    const [res]: any = await db.execute(
      `INSERT INTO bundles (title, description, price, discount_price) VALUES (?, ?, ?, ?)`,
      [name, description, originalPrice, discountedPrice]
    );

    const bundleId = res.insertId;

    for (const c of courses) {
      await db.execute(`INSERT INTO bundle_items (bundle_id, course_id) VALUES (?, ?)`, [
        bundleId,
        c,
      ]);
    }

    for (const r of resources) {
      await db.execute(`INSERT INTO bundle_items (bundle_id, resource_id) VALUES (?, ?)`, [
        bundleId,
        r,
      ]);
    }

    return NextResponse.json({ message: "Bundle created" });

  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
