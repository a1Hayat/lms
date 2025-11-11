import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req:Request) {
  try {
    const { course_id } = await req.json();

    if (!course_id) {
        return NextResponse.json({ error: "Missing course_id" }, { status: 400 });
    }
    const [resources] = await db.query("SELECT r.* FROM resources r JOIN course_resources cr ON r.resource_id = cr.resource_id WHERE cr.course_id = ?", [course_id]);
    return NextResponse.json({ resources });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
