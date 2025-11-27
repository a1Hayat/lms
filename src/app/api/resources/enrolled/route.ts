import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Define the shape of the resource data
interface ResourceRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  // Add other resource columns as needed
}

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ success: false, message: "Missing user_id" }, { status: 400 });
    }

    // Fetch enrolled resources
    // FIX: Use generic <ResourceRow[]> instead of : any
    const [resources] = await db.query<ResourceRow[]>(
      `SELECT r.*
       FROM enrollments e
       JOIN resources r ON r.id = e.resource_id
       WHERE e.user_id = ?`,
      [user_id]
    );

    return NextResponse.json({ success: true, resources });

  } catch (error) {
    console.error("Error fetching enrolled resources:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}