import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs";
import { RowDataPacket } from "mysql2/promise";

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id")?.toString();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString() || null;
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const level = formData.get("level")?.toString();
    const newFile = formData.get("file_path") as File | null;
    const newThumbnail = formData.get("thumbnail") as File | null;

    // Validate required fields
    if (!id || !title || !level) {
      return NextResponse.json(
        { error: "Missing required fields (id, title, level)" },
        { status: 400 }
      );
    }

    // Ensure upload directories exist
    const FileuploadDir = path.join(process.cwd(), "lms", "secure_uploads");
    if (!fs.existsSync(FileuploadDir)) fs.mkdirSync(FileuploadDir, { recursive: true });

    const ThumbuploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(ThumbuploadDir)) fs.mkdirSync(ThumbuploadDir, { recursive: true });

    // Fetch old file paths
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT file_path, thumbnail FROM resources WHERE id = ?',
      [id]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const oldFilePath = rows[0].file_path as string;
    const oldThumbnailPath = rows[0].thumbnail as string | null;

    // Delete old file if new file is uploaded
    let fileUrl = oldFilePath;
    if (newFile) {
      if (fs.existsSync(path.join(process.cwd(), oldFilePath))) fs.unlinkSync(path.join(process.cwd(), oldFilePath));

      const fileBuffer = Buffer.from(await newFile.arrayBuffer());
      const fileName = `${Date.now()}_${newFile.name}`;
      const fileDest = path.join(FileuploadDir, fileName);
      fs.writeFileSync(fileDest, fileBuffer);

      fileUrl = `/lms/secure_uploads/${fileName}`;
    }

    // Delete old thumbnail if new one is uploaded
    let thumbUrl = oldThumbnailPath;
    if (newThumbnail) {
      if (oldThumbnailPath && fs.existsSync(path.join(process.cwd(), "public", oldThumbnailPath))) {
        fs.unlinkSync(path.join(process.cwd(), "public", oldThumbnailPath));
      }

      const thumbBuffer = Buffer.from(await newThumbnail.arrayBuffer());
      const thumbName = `${Date.now()}_${newThumbnail.name}`;
      const thumbDest = path.join(ThumbuploadDir, thumbName);
      fs.writeFileSync(thumbDest, thumbBuffer);

      thumbUrl = `/uploads/${thumbName}`;
    }

    // Update resource in DB
    await db.query(
      `
      UPDATE resources
      SET title = ?, description = ?, level = ?, file_path = ?, thumbnail = ?, price = ?
      WHERE id = ?
      `,
      [title, description, level, fileUrl, thumbUrl, price, id]
    );

    return NextResponse.json({ message: "Resource updated successfully" });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}