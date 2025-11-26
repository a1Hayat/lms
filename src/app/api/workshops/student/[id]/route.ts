import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { db } from '@/lib/db';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lms',
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // In a real app, get this from the session/auth token
    // Using ID 5 (from your SQL dump) as the demo student
    const userId = searchParams.get('userId') || '5'; 

    const query = `
      SELECT 
        w.*,
        CASE WHEN wr.id IS NOT NULL THEN 1 ELSE 0 END as is_registered
      FROM workshops w
      LEFT JOIN workshop_registrations wr 
        ON w.id = wr.workshop_id AND wr.user_id = ?
      WHERE w.status = 'opened'
      ORDER BY w.workshop_date ASC
    `;

    const [rows] = await db.execute(query, [userId]);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
  }
}