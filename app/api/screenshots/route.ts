import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { screenshots } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function getUserId(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session.user.id
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req)
    const body = await req.json()

    const { screenshotUrl, thumbnailUrl, aiAnalysis, captureTime } = body

    const screenshot = await db.insert(screenshots).values({
      userId,
      screenshotUrl,
      thumbnailUrl,
      aiAnalysis,
      captureTime: new Date(captureTime),
    })

    return NextResponse.json({ success: true, screenshot }, { status: 201 })
  } catch (error) {
    console.error('Error saving screenshot:', error)
    return NextResponse.json({ error: 'Failed to save screenshot' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req)

    const userScreenshots = await db
      .select()
      .from(screenshots)
      .where(eq(screenshots.userId, userId))
      .orderBy(screenshots.captureTime)
      .limit(50)

    return NextResponse.json(userScreenshots)
  } catch (error) {
    console.error('Error fetching screenshots:', error)
    return NextResponse.json({ error: 'Failed to fetch screenshots' }, { status: 500 })
  }
}
