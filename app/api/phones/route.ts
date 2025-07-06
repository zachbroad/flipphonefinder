import { NextResponse } from 'next/server'
import { db, phone } from '@/lib/db'

export async function GET() {
  try {
    const phones = await db.select().from(phone)

    return NextResponse.json(phones)
  } catch (error) {
    console.error('Error fetching phones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phones' },
      { status: 500 }
    )
  }
}