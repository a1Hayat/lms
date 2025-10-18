import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const users = await db.query("SELECT * FROM users");
    return NextResponse.json({ users });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
