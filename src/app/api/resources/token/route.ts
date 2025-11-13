import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, resource_id } = body;

    if (!user_id || !resource_id) {
      return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 });
    }

    // ✅ Check if user is enrolled in this resource
    const [rows]: any = await db.query(
      `SELECT r.file_path
       FROM enrollments e
       JOIN resources r ON r.id = e.resource_id
       WHERE e.user_id = ? AND r.id = ? LIMIT 1`,
      [user_id, resource_id]
    );

    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const filePath = rows[0].file_path;

    // ✅ Sign JWT including filePath
    const token = jwt.sign(
      { filePath },      // <- This is key
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ success: true, token });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
