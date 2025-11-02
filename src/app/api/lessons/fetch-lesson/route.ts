import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
    const { lesson_id } = await req.json();

    if (!lesson_id) {
        return NextResponse.json({ error: "Missing lesson_id" }, { status: 400 });
    }

    const [lesson_info] = await db.query("SELECT * FROM lessons WHERE id = ?", [lesson_id]);
    if (!Array.isArray(lesson_info) || lesson_info.length < 0) {
        return NextResponse.json({ error: "lesson does not exist for lesson_id" }, { status: 401 });
    }
    else
    {
        return NextResponse.json({ lesson_info });
    }

    } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}