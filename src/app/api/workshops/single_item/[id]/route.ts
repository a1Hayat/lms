import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to access id
    const { id } = await params;
    const body = await req.json();
    const { session_name, type, workshop_date, location, status } = body;

    await db.execute(
      'UPDATE workshops SET session_name = ?, type = ?, workshop_date = ?, location = ?, status = ? WHERE id = ?',
      [session_name, type, workshop_date, location, status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to access id
    const { id } = await params;
    
    await db.execute('DELETE FROM workshops WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete workshop' }, { status: 500 });
  }
}