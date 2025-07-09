import { NextResponse } from 'next/server'
import { db, phone } from '@/lib/db'
import { eq, or } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const identifier = resolvedParams.id
    
    // Check if identifier is a number (ID) or a string (slug)
    const phoneId = parseInt(identifier)
    let result
    
    if (!isNaN(phoneId)) {
      // If it's a valid number, search by ID
      result = await db.select().from(phone).where(eq(phone.id, phoneId))
    } else {
      // If it's not a number, search by slug
      result = await db.select().from(phone).where(eq(phone.slug, identifier))
    }
    
    // If no result found and identifier is not a number, try both slug and ID
    if (result.length === 0) {
      result = await db.select().from(phone).where(
        or(
          eq(phone.slug, identifier),
          isNaN(phoneId) ? eq(phone.id, -1) : eq(phone.id, phoneId)
        )
      )
    }
    
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