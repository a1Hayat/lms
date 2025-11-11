import { NextResponse } from "next/server"
import { db } from "@/lib/db" // your DB connection

export async function POST(req: Request) {
  try {
    const { bundle_id, title, description, courses, resources, price, discount_price } =
      await req.json()

    await db.query(
      `UPDATE bundles 
       SET title = ?, description = ?, courses = ?, resources = ?, price = ?, discount_price = ? 
       WHERE id = ?`,
      [
        title,
        description,
        JSON.stringify(courses),
        JSON.stringify(resources),
        price,
        discount_price,
        bundle_id,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to update bundle" }, { status: 500 })
  }
}
