import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM workshops ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_name, type, workshop_date, location, status } = body;

    const [result] = await db.execute(
      'INSERT INTO workshops (session_name, type, workshop_date, location, status) VALUES (?, ?, ?, ?, ?)',
      [session_name, type, workshop_date, location, status]
    );

    return NextResponse.json({ id: (result as any).insertId, ...body }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 });
  }
}