import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const courses = await db.query("SELECT * FROM courses");
    return NextResponse.json({ courses });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
