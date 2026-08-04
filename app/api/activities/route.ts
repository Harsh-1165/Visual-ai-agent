import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { activities } from '@/lib/db/schema'
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

    const { eventType, eventData, url, tabTitle } = body

    const activity = await db.insert(activities).values({
      userId,
      eventType,
      eventData,
      url,
      tabTitle,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true, activity }, { status: 201 })
  } catch (error) {
    console.error('Error logging activity:', error)
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req)

    const userActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(activities.timestamp)
      .limit(100)

    return NextResponse.json(userActivities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
