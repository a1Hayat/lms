import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Update the type definition for params to be a Promise
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object to access the id
    const { id } = await params;
    const workshopId = id;

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