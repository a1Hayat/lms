import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // import the pool

export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT id, title, price FROM resources"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch resources error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
