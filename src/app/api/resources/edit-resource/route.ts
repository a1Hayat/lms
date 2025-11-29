import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { id, title, description, price, level } = await req.json();

    // Check if id is provided
    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push("title = ?"); values.push(title); }
    if (description !== undefined) { updates.push("description = ?"); values.push(description); }
    if (price !== undefined) { updates.push("price = ?"); values.push(price); }
    if (level !== undefined) { updates.push("level = ?"); values.push(level); }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);

    await db.query(
      `UPDATE resources SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({ message: "Resource updated successfully" });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
