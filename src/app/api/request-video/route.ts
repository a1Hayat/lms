// /app/api/videos/request-video/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const VIDEO_SECRET = process.env.VIDEO_SECRET || "super_secret_key";

export async function POST(req: Request) {
  try {
    const { videoPath } = await req.json();

    if (!videoPath) {
      return NextResponse.json({ error: "No video path provided" }, { status: 400 });
    }

    const token = jwt.sign({ videoPath }, VIDEO_SECRET, { expiresIn: "30m" });

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Error generating video token:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
