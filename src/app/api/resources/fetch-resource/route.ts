import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { resource_id } = await req.json();

    if (!resource_id) {
      return NextResponse.json({ error: "Missing resource_id" }, { status: 400 });
    }

    const [resource] = await db.query("SELECT * FROM resources WHERE id = ?", [resource_id]);

    if (!Array.isArray(resource) || resource.length === 0) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, resource: resource[0] });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
