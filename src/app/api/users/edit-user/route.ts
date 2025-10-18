import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, name, email, password, phone, role, institution } = body;

    // Validate required field
    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Build update fields dynamically
    const fields: string[] = [];
    const values: unknown[] = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }

    if (email) {
      fields.push("email = ?");
      values.push(email);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    if (phone) {
      fields.push("phone = ?");
      values.push(phone);
    }

    if (role) {
      fields.push("role = ?");
      values.push(role);
    }

    if (institution) {
      fields.push("institution = ?");
      values.push(institution);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // Construct query
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(user_id);

    await db.query(sql, values);

    return NextResponse.json({
      message: "User updated successfully",
      updated_fields: fields.map((f) => f.split(" = ")[0]),
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
