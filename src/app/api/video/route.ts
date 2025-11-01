/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const SECRET = process.env.VIDEO_SECRET || "super_secret_key";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET) as { videoPath: string };
    const filePath = path.join(process.cwd(), "secure_uploads", "lessons", decoded.videoPath);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    const range = req.headers.get("range");
    if (!range) {
      const headers = {
        "Content-Length": fileSize.toString(),
        "Content-Type": "video/mp4",
      };
      return new NextResponse(fs.createReadStream(filePath) as any, { headers });
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = fs.createReadStream(filePath, { start, end });
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": "video/mp4",
    };

    return new NextResponse(file as any, {
      status: 206,
      headers,
    });
  } catch (err) {
    console.error("Stream error:", err);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }
}

//front end
/* async function playVideo(videoPath: string) {
  const res = await fetch("/api/video/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoPath }),
  });
  const { token } = await res.json();

  const videoElement = document.getElementById("lessonVideo") as HTMLVideoElement;
  videoElement.src = `/api/video/stream?token=${token}`;
  videoElement.play();
} */