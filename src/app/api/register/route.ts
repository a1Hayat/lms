import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, role, institution } = await req.json();

    if (!email || !password || !phone || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, phone, role, institution) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, role || "student", institution || null]
    );

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


