import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.COURSE_SECRET || "super_secret_course_key";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const decoded = jwt.verify(token, SECRET) as { id: string };
    return NextResponse.json({ success: true, courseId: decoded.id });
  } catch (err) {
    console.error("Invalid course token:", err);
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 403 });
  }
}
