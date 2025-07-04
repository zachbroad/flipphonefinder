import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Phone } from '@/types/phone'

export async function GET() {
  try {
    const phones: Phone[] = await prisma.phone.findMany();

    return NextResponse.json(phones)
  } catch (error) {
    console.error('Error fetching phones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phones' },
      { status: 500 }
    )
  }
}