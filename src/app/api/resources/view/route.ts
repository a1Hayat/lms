import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt, { JwtPayload } from "jsonwebtoken";

// Helper: Convert Node stream to Web stream
// Fix: Type the iterator explicitly as AsyncIterator<Uint8Array> (Buffer extends Uint8Array)
function iteratorToStream(iterator: AsyncIterator<Uint8Array>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) controller.close();
      else controller.enqueue(value);
    },
  });
}

// Define specific payload type
interface FileTokenPayload extends JwtPayload {
  filePath: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return new NextResponse("Missing token", { status: 400 });

    // Fix: Cast to specific interface instead of 'any'
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as FileTokenPayload;
    const filePath = path.join(process.cwd(), payload.filePath);

    if (!fs.existsSync(filePath)) return new NextResponse("File not found", { status: 404 });

    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    
    // --- CRITICAL: HANDLE RANGE REQUESTS ---
    const range = req.headers.get("range");

    if (range) {
      // 1. Parse the Range (e.g., "bytes=0-1023")
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;

      // 2. Create a stream for JUST that specific chunk
      const fileStream = fs.createReadStream(filePath, { start, end });
      const data = iteratorToStream(fileStream[Symbol.asyncIterator]());

      // 3. Return 206 Partial Content
      return new NextResponse(data, {
        status: 206, // <--- IMPORTANT: Tells browser "Here is just a piece"
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": "application/pdf",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } 
    
    // Fallback: If browser doesn't ask for range (rare for PDF.js), send whole file
    const fileStream = fs.createReadStream(filePath);
    const data = iteratorToStream(fileStream[Symbol.asyncIterator]());
    
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Length": fileSize.toString(),
        "Content-Type": "application/pdf",
      },
    });

  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}