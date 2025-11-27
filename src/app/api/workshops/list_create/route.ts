import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM workshops ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    // Used 'error' to fix unused var warning + good for debugging
    console.error("Error fetching workshops:", error);
    return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_name, type, workshop_date, location, status } = body;

    // FIX: Use <ResultSetHeader> generic instead of casting to any later
    // This properly types 'result' so .insertId is valid
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO workshops (session_name, type, workshop_date, location, status) VALUES (?, ?, ?, ?, ?)',
      [session_name, type, workshop_date, location, status]
    );

    return NextResponse.json({ id: result.insertId, ...body }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 });
  }
}