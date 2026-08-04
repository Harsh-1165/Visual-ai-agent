'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsLoggedIn(!!token)
    setLoading(false)

    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  if (loading) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">🎯 Visual AI Agent</div>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/sign-in')}
              className="text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/sign-up')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Monitor Your Digital Activity with
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> AI Intelligence</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Install our Chrome extension to automatically track your browser activity, capture screenshots, and analyze them with AI-powered insights. Privacy-focused and user-controlled.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/sign-up')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
              >
                Start Free →
              </button>
              <button
                onClick={() => {
                  const section = document.getElementById('features')
                  section?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="border border-slate-400 text-slate-300 px-8 py-3 rounded-lg font-semibold hover:border-slate-200 hover:text-white transition"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-Time Activity Tracking',
                description: 'Capture clicks, keystrokes, scrolling, and tab changes as they happen',
                icon: '⚡',
              },
              {
                title: 'Automatic Screenshots',
                description: 'Take screenshots at configurable intervals to record visual context',
                icon: '📸',
              },
              {
                title: 'AI Analysis',
                description: 'Let AI understand and analyze your screenshots for deeper insights',
                icon: '🧠',
              },
              {
                title: 'Privacy First',
                description: 'Exclude URLs, toggle tracking on/off, and maintain full control',
                icon: '🔐',
              },
              {
                title: 'Beautiful Dashboard',
                description: 'View all activities and screenshots in an elegant, organized interface',
                icon: '📊',
              },
              {
                title: 'Chrome Extension',
                description: 'Lightweight extension that runs silently in your browser',
                icon: '🔧',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-slate-700/50 border border-slate-600 p-6 hover:border-slate-500 transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your free account' },
              { step: '2', title: 'Install Extension', description: 'Add the Chrome extension' },
              { step: '3', title: 'Start Tracking', description: 'Activity logs automatically' },
              { step: '4', title: 'Analyze', description: 'View insights in dashboard' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start tracking?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands monitoring their browser activity with confidence.</p>
          <button
            onClick={() => router.push('/sign-up')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-slate-100 transition transform hover:scale-105"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-slate-400">
          <p>&copy; 2024 Visual AI Agent. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
