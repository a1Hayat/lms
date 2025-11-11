/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { resource_id } = await req.json();

    if (!resource_id) {
      return NextResponse.json({ error: "Missing resource_id" }, { status: 400 });
    }

    const [result]: any = await db.query("DELETE FROM resources WHERE id = ?", [resource_id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete resource error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
