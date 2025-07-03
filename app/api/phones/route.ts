import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const phones = await prisma.phone.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(phones)
  } catch (error) {
    console.error('Error fetching phones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phones' },
      { status: 500 }
    )
  }
}