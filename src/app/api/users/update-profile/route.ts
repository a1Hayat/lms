import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
    const session = await getServerSession(authOptions);
    const { user_id, name, phone, institution } = await req.json();

    // Security check: Ensure the user is updating their own profile
    if (!session || session.user.id !== user_id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Update the user's details
    await conn.execute(
      `UPDATE users 
       SET name = ?, phone = ?, institution = ?
       WHERE id = ?`,
      [name, phone, institution, user_id]
    );

    return NextResponse.json({ success: true, message: "Profile updated" });

  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  } finally {
    conn.end();
  }
}