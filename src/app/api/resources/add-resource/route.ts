import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title, description, file_path, thumbnail, price } = await req.json();

    // Validate required fields
    if (!title || !file_path) {
      return NextResponse.json({ error: "Missing required fields (title, file_path)" }, { status: 400 });
    }

    // Insert new resource
    await db.query(
      `
      INSERT INTO resources (title, description, file_path, thumbnail, price)
      VALUES (?, ?, ?, ?, ?)
      `,
      [title, description || null, file_path, thumbnail || null, price || 0.0]
    );

    return NextResponse.json({ message: "Resource added successfully" });
  } catch (error) {
    console.error("Error adding resource:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
