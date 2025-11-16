// app/api/contact/route.ts
import { NextResponse } from "next/server";
// Import your new MySQL pool
import { db } from "@/lib/db"; 
// We need this type for the result
import type { ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. MySQL uses '?' as placeholders
    const query = `
      INSERT INTO contact_submissions (name, email, message)
      VALUES (?, ?, ?)
    `;
    const values = [name, email, message];

    // 2. Use db.execute() which is secure against SQL injection
    //    'await' is used here, when you actually run the query
    const [result] = await db.execute<ResultSetHeader>(query, values);

    // 3. Get the new ID from the result
    const insertId = result.insertId;

    return NextResponse.json(
      {
        message: "Submission successful!",
        submissionId: insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}