import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.VIDEO_SECRET || "super_secret_key";

export async function POST(req: Request) {
  try {
    const { videoPath } = await req.json();

    if (!videoPath || !videoPath.endsWith(".mp4")) {
      return NextResponse.json({ error: "Invalid or missing video path" }, { status: 400 });
    }

    // Generate a token valid for 10 minutes
    const token = jwt.sign({ videoPath }, SECRET, { expiresIn: "10m" });

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Token generation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
