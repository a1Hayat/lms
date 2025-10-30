import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
    const { user_id } = await req.json();

    if (!user_id) {
        return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const [user_info] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);
    if (!Array.isArray(user_info) || user_info.length < 0) {
        return NextResponse.json({ error: "User does not exist for user_id" }, { status: 401 });
    }
    else
    {
        return NextResponse.json({ user_info });
    }

    } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

