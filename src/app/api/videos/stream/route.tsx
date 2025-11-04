export const runtime = "nodejs"; // Important!

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const VIDEO_SECRET = process.env.VIDEO_SECRET || "super_secret_key";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, VIDEO_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
    }

    const videoPath = decoded.videoPath;
    if (!videoPath) return NextResponse.json({ error: "No video path provided" }, { status: 400 });

    const absolutePath = path.join(process.cwd(), "public", videoPath);

    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const stat = fs.statSync(absolutePath);
    const fileSize = stat.size;
    const range = req.headers.get("range");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(absolutePath, { start, end });

      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "video/mp4",
        "Cache-Control": "no-store",
      };

      return new Response(file as any, { status: 206, headers });
    }

    // No range header — send full file
    const file = fs.createReadStream(absolutePath);
    const headers = {
      "Content-Length": fileSize.toString(),
      "Content-Type": "video/mp4",
      "Cache-Control": "no-store",
    };

    return new Response(file as any, { status: 200, headers });
  } catch (error) {
    console.error("Streaming error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
