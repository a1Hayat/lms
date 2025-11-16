import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {

    const [submissions] = await db.query("SELECT * FROM contact_submissions");
    if (!Array.isArray(submissions) || submissions.length < 0) {
        return NextResponse.json({ error: "failed to fetch submissions" }, { status: 401 });
    }
    else
    {
        return NextResponse.json({contact_submissions: submissions });
    }

    } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

