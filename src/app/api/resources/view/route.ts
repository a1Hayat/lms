import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!payload.filePath) return NextResponse.json({ success: false, message: "Invalid token payload" }, { status: 400 });

    const filePath = path.join(process.cwd(), "public", payload.filePath);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, message: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=" + path.basename(filePath),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
