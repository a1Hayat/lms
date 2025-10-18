import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const instructor_id = formData.get("instructor_id") as string;
    const file = formData.get("thumbnail") as File;

    if (!title || !description || !price || !instructor_id || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save uploaded image
    const uploadDir = path.join(process.cwd(), "public", "course_thumbnails");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalName = ((file as File & { name?: string }).name ?? "thumbnail.png");
    const ext = path.extname(originalName) || ".png";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const newFileName = `${timestamp}${ext}`;
    const filePath = path.join(uploadDir, newFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const imagePath = `/course_thumbnails/${newFileName}`;

    // Insert into DB
    await db.query(
      `
      INSERT INTO courses (title, description, thumbnail, price, instructor_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [title, description, imagePath, price, instructor_id]
    );

    return NextResponse.json({
      message: "Course added successfully",
      thumbnail: imagePath,
    });
  } catch (error) {
    console.error("Course upload error:", error);
    return NextResponse.json(
      { error: "Failed to add course" },
      { status: 500 }
    );
  }
}
