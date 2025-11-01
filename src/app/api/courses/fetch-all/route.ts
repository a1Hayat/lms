import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const [rows] = await db.query("SELECT * FROM courses");
    return NextResponse.json({ courses: rows }); // ✅ rows is your data
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
