import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workshopId = params.id;

    if (!workshopId) {
      return NextResponse.json({ error: 'Workshop ID is required' }, { status: 400 });
    }

    // JOIN users table to get student details for every registration in this workshop
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

    const [rows] = await db.query(query, [workshopId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}