import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
    const { resource_id } = await req.json();

    if (!resource_id) {
        return NextResponse.json({ error: "Missing resource_id" }, { status: 400 });
    }

    const [resources_info] = await db.query("SELECT * FROM resources WHERE id = ?", [resource_id]);
    if (!Array.isArray(resources_info) || resources_info.length < 0) {
        return NextResponse.json({ error: "resources does not exist for resource_id" }, { status: 401 });
    }
    else
    {
        return NextResponse.json({ resources_info });
    }

    } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}