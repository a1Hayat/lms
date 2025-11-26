import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { db } from '@/lib/db';
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { session_name, type, workshop_date, location, status } = body;

    await db.execute(
      'UPDATE workshops SET session_name = ?, type = ?, workshop_date = ?, location = ?, status = ? WHERE id = ?',
      [session_name, type, workshop_date, location, status, params.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.execute('DELETE FROM workshops WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workshop' }, { status: 500 });
  }
}