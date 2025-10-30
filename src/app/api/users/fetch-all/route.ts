import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req:Request) {
  try {
    const { user_role } = await req.json();

    if (!user_role) {
        return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }
    const [users] = await db.query("SELECT * FROM users WHERE role = ?", [user_role]);
    return NextResponse.json({ users });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
