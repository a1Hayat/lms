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

export async function GET() {
  const conn = await db();

  try {
    const [rows]: any = await conn.execute(
      "SELECT id, title, description, price, discount_price, created_at FROM bundles ORDER BY id DESC"
    );

    return NextResponse.json({ bundles: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching bundles" }, { status: 500 });
  } finally {
    conn.end();
  }
}
