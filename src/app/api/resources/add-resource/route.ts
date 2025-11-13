import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString() || null;
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const level = formData.get("level")?.toString();
    const file_path = formData.get("file_path") as File | null;
    const thumbnail = formData.get("thumbnail") as File | null;

    // Validate required fields
    if (!title || !file_path || !level) {
      return NextResponse.json(
        { error: "Missing required fields (title, file_path, level)" },
        { status: 400 }
      );
    }

    // Ensure the folder exists
    const FileuploadDir = path.join(process.cwd(), "lms", "secure_uploads");
    if (!fs.existsSync(FileuploadDir)) fs.mkdirSync(FileuploadDir, { recursive: true });
    const ThumbuploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(ThumbuploadDir)) fs.mkdirSync(ThumbuploadDir, { recursive: true });

    // Save PDF file
    const fileBuffer = Buffer.from(await file_path.arrayBuffer());
    const fileName = `${Date.now()}_${file_path.name}`;
    const fileDest = path.join(FileuploadDir, fileName);
    fs.writeFileSync(fileDest, fileBuffer);

    // Save thumbnail if exists
    let thumbUrl: string | null = null;
    if (thumbnail) {
      const thumbBuffer = Buffer.from(await thumbnail.arrayBuffer());
      const thumbName = `${Date.now()}_${thumbnail.name}`;
      const thumbDest = path.join(ThumbuploadDir, thumbName);
      fs.writeFileSync(thumbDest, thumbBuffer);
      thumbUrl = `/uploads/${thumbName}`;
    }

    const fileUrl = `/lms/secure_uploads/${fileName}`;

    // Insert into database
    await db.query(
      `
      INSERT INTO resources (title, description, level, file_path, thumbnail, price)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [title, description, level, fileUrl, thumbUrl, price]
    );

    return NextResponse.json({ message: "Resource added successfully" });
  } catch (error) {
    console.error("Error adding resource:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
