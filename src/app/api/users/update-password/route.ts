import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // import your pool
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2/promise";

// Define the shape of the database row
interface UserPasswordRow extends RowDataPacket {
  password: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { user_id, oldPassword, newPassword } = await req.json();

    // Security check: Ensure the user is updating their own profile
    if (!session || session.user.id !== user_id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    // 1. Get the user's current hashed password
    const [rows] = await db.execute<UserPasswordRow[]>(
      `SELECT password FROM users WHERE id = ?`,
      [user_id]
    );

    if (!rows.length) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const currentHashedPassword = rows[0].password;

    // 2. Compare the old password with the hash
    const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Incorrect current password." }, { status: 403 });
    }

    // 3. Hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update the password in the database
    await db.execute(
      `UPDATE users SET password = ? WHERE id = ?`,
      [newHashedPassword, user_id]
    );

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
