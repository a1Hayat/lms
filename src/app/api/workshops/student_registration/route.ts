import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { db } from '@/lib/db';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workshop_id, user_id } = body;

    if (!workshop_id || !user_id) {
      return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
    }

    // Attempt to register
    // The UNIQUE constraint in SQL will throw an error if already registered
    await db.execute(
      'INSERT INTO workshop_registrations (workshop_id, user_id) VALUES (?, ?)',
      [workshop_id, user_id]
    );

    return NextResponse.json({ success: true, message: 'Registered successfully' });
  } catch (error: any) {
    // Check for duplicate entry error code (MySQL 1062)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    }
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}