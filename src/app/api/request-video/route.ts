import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const VIDEO_SECRET = process.env.VIDEO_SECRET || "super_secret_key";

export async function POST(req: Request) {
  try {
    let { videoPath } = await req.json();

    // Remove leading slash if present
    if (videoPath.startsWith("/")) {
      videoPath = videoPath.slice(1);
    }

    if (!videoPath.startsWith("uploads/")) {
      return NextResponse.json({ error: "Invalid video path" }, { status: 403 });
    }
    const token = jwt.sign({ videoPath }, VIDEO_SECRET, { expiresIn: "30m" });

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Error generating video token:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
