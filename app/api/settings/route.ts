import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userSettings } from '@/lib/db/schema'
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

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req)

    let userSetting = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, userId),
    })

    if (!userSetting) {
      await db.insert(userSettings).values({
        userId,
        trackingEnabled: true,
        screenshotIntervalSeconds: 60,
        aiAnalysisEnabled: true,
      })
      userSetting = await db.query.userSettings.findFirst({
        where: eq(userSettings.userId, userId),
      })
    }

    return NextResponse.json(userSetting)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId(req)
    const body = await req.json()

    const { trackingEnabled, screenshotIntervalSeconds, excludedUrls, whitelistUrls, aiAnalysisEnabled } = body

    const updated = await db
      .update(userSettings)
      .set({
        trackingEnabled,
        screenshotIntervalSeconds,
        excludedUrls,
        whitelistUrls,
        aiAnalysisEnabled,
        updated_at: new Date(),
      })
      .where(eq(userSettings.userId, userId))
      .returning()

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
