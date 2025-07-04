import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const phone = await prisma.phone.findUnique({
      where: {
        id: params.id
      }
    })
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(phone)
  } catch (error) {
    console.error('Error fetching phone:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phone' },
      { status: 500 }
    )
  }
}