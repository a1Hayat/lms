import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [rows] = await db.execute("SELECT id, title, price FROM resources");
  return NextResponse.json(rows);
}
