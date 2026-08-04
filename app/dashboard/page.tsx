'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<any[]>([])
  const [screenshots, setScreenshots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'activities' | 'screenshots'>('activities')

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const [activitiesRes, screenshotsRes] = await Promise.all([
        fetch('/api/activities'),
        fetch('/api/screenshots'),
      ])

      if (activitiesRes.ok) {
        const data = await activitiesRes.json()
        setActivities(data.reverse()) // Most recent first
      }

      if (screenshotsRes.ok) {
        const data = await screenshotsRes.json()
        setScreenshots(data.reverse())
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const getActivityIcon = (eventType: string) => {
    const icons: Record<string, string> = {
      CLICK: '🖱️',
      TYPING: '⌨️',
      SCROLL: '📜',
      INPUT: '📝',
      TAB_CHANGED: '🔄',
      URL_CHANGED: '🌐',
      WINDOW_FOCUSED: '👁️',
      WINDOW_BLURRED: '👻',
    }
    return icons[eventType] || '📍'
  }

  const formatTime = (timestamp: string | number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDate = (timestamp: string | number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Visual AI Agent Dashboard</h1>
              <p className="mt-2 text-slate-400">Track and monitor your browser activity</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('authToken')
                router.push('/sign-in')
              }}
              className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('activities')}
            className={`pb-4 px-4 font-medium transition ${
              activeTab === 'activities'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📊 Activities ({activities.length})
          </button>
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`pb-4 px-4 font-medium transition ${
              activeTab === 'screenshots'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📸 Screenshots ({screenshots.length})
          </button>
        </div>

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-slate-400">Loading activities...</div>
              </div>
            ) : activities.length === 0 ? (
              <div className="rounded-lg bg-slate-800/50 p-8 text-center text-slate-400">
                No activities yet. Start using your browser to track activity.
              </div>
            ) : (
              <div className="space-y-2">
                {activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-800/50 border border-slate-700 p-4 hover:bg-slate-800 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 flex-1">
                        <span className="text-xl">{getActivityIcon(activity.eventType)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white">{activity.eventType}</p>
                          {activity.url && (
                            <p className="text-sm text-slate-400 truncate">{activity.url}</p>
                          )}
                          {activity.tabTitle && (
                            <p className="text-sm text-slate-400 truncate">{activity.tabTitle}</p>
                          )}
                          {activity.eventData && (
                            <p className="text-xs text-slate-500 mt-1">
                              {JSON.stringify(activity.eventData).substring(0, 100)}...
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <p className="text-sm text-slate-400">{formatTime(activity.timestamp)}</p>
                        <p className="text-xs text-slate-500">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Screenshots Tab */}
        {activeTab === 'screenshots' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-slate-400">Loading screenshots...</div>
              </div>
            ) : screenshots.length === 0 ? (
              <div className="rounded-lg bg-slate-800/50 p-8 text-center text-slate-400">
                No screenshots yet. Enable screenshot capture in the extension.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {screenshots.map((screenshot, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden hover:border-slate-600 transition"
                  >
                    <div className="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={screenshot.screenshotUrl}
                        alt="Screenshot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-400">{formatTime(screenshot.captureTime)}</p>
                      <p className="text-xs text-slate-500">{formatDate(screenshot.captureTime)}</p>
                      {screenshot.aiAnalysis && (
                        <p className="mt-2 text-xs text-blue-400 truncate">
                          AI: {JSON.stringify(screenshot.aiAnalysis).substring(0, 50)}...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
