import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
    const { course_id } = await req.json();

    if (!course_id) {
        return NextResponse.json({ error: "Missing course_id" }, { status: 400 });
    }

    const [course_info] = await db.query("SELECT * FROM courses WHERE id = ?", [course_id]);
    if (!Array.isArray(course_info) || course_info.length < 0) {
        return NextResponse.json({ error: "Course does not exist for course_id" }, { status: 401 });
    }
    else
    {
        return NextResponse.json({ course_info });
    }

    } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}