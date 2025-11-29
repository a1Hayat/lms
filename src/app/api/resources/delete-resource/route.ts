/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";
import { RowDataPacket } from "mysql2/promise";

export async function DELETE(req: Request) {
  try {
    const { resource_id } = await req.json();

    if (!resource_id) {
      return NextResponse.json({ error: "Missing resource_id" }, { status: 400 });
    }

    // 1️⃣ Fetch old file paths
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT file_path, thumbnail FROM resources WHERE id = ?",
      [resource_id]
    );

    if (!rows[0]) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    const filePath = rows[0].file_path as string;
    const thumbnailPath = rows[0].thumbnail as string | null;

    // 2️⃣ Delete main file
    const absoluteFile = path.join(process.cwd(), filePath);
    if (fs.existsSync(absoluteFile)) {
      fs.unlinkSync(absoluteFile);
      console.log("Deleted file:", absoluteFile);
    }

    // 3️⃣ Delete thumbnail
    if (thumbnailPath) {
      const absoluteThumb = path.join(process.cwd(), "public", thumbnailPath.replace("/uploads/", "uploads/"));
      if (fs.existsSync(absoluteThumb)) {
        fs.unlinkSync(absoluteThumb);
        console.log("Deleted thumbnail:", absoluteThumb);
      }
    }

    // 4️⃣ Delete DB entry
    const [result]: any = await db.query(
      "DELETE FROM resources WHERE id = ?",
      [resource_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete resource error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}