import { NextResponse } from 'next/server'
import { db, phone } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const phoneId = parseInt(resolvedParams.id)
    if (isNaN(phoneId)) {
      return NextResponse.json(
        { error: 'Invalid phone ID' },
        { status: 400 }
      )
    }

    const result = await db.select().from(phone).where(eq(phone.id, phoneId))
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Phone not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching phone:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phone' },
      { status: 500 }
    )
  }
}