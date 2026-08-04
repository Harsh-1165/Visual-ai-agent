'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token)
        router.push('/dashboard')
      } else {
        setError(data.error || 'Sign in failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-slate-800/50 backdrop-blur border border-slate-700 p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">🎯 Visual AI Agent</h1>
            <p className="text-slate-400">Track and analyze your browser activity</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg bg-slate-700/50 border border-slate-600 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-slate-700/50 border border-slate-600 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/sign-up')}
                className="text-blue-400 hover:text-blue-300 font-medium transition"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-lg bg-slate-800/30 border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-3">📋 About Visual AI Agent</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>✓ Real-time activity tracking</li>
            <li>✓ Automatic screenshot capture</li>
            <li>✓ AI-powered analysis</li>
            <li>✓ Privacy controls and URL filtering</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
