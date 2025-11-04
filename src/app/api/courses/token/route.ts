import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.COURSE_SECRET || "super_secret_course_key";

export async function POST(req: Request) {
  try {
    const { courseId } = await req.json();
    if (!courseId)
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });

    const token = jwt.sign({ id: courseId }, SECRET, { expiresIn: "2h" });

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Token generation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
