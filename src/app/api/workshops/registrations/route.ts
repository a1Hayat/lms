import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Selects workshop details and checks if the specific user is registered
    const query = `
      SELECT 
        w.*,
        CASE WHEN wr.user_id IS NOT NULL THEN 1 ELSE 0 END as is_registered
      FROM workshops w
      LEFT JOIN workshop_registrations wr ON w.id = wr.workshop_id AND wr.user_id = ?
      ORDER BY w.workshop_date DESC
    `;

    // specific typing for rows might be needed depending on your db driver, usually it's [rows]
    const [rows] = await db.query(query, [userId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workshopId, userId } = body;

    if (!workshopId || !userId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const query = `INSERT INTO workshop_registrations (workshop_id, user_id) VALUES (?, ?)`;
    
    await db.query(query, [workshopId, userId]);

    return NextResponse.json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    // FIXED: Removed ': any' from catch.
    console.error('Registration error:', error);
    
    // Safely cast error to check for the 'code' property (common in MySQL drivers)
    const dbError = error as { code?: string };

    // Handle duplicate entry (MySQL error code 1062)
    if (dbError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}