import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { db } from '@/lib/db';


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const workshopId = params.id;

    // Join users table to get full info for every registration
    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.institution, 
        wr.registered_at
      FROM workshop_registrations wr
      JOIN users u ON wr.user_id = u.id
      WHERE wr.workshop_id = ?
      ORDER BY wr.registered_at DESC
    `;

    const [rows] = await db.execute(query, [workshopId]);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}