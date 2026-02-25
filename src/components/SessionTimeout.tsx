'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * SessionTimeout Component
 * Automatically logs out the user after 15 minutes of inactivity.
 * Inactivity is defined as no mouse, keyboard, or touch interaction.
 */
const TIMEOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

export default function SessionTimeout() {
  const router = useRouter()
  const pathname = usePathname()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const logout = async () => {
    // Don't auto-logout if already in the login page
    if (pathname === '/login') return

    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      const data = await res.json()
      if (data.success) {
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Auto-logout error:', error)
    }
  }

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(logout, TIMEOUT_DURATION)
  }

  useEffect(() => {
    // Only monitor activity if authenticated (not on login page)
    if (pathname === '/login') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      return
    }

    // List of events that reset the inactivity timer
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ]

    // Initialize timer
    resetTimer()

    // Add event listeners
    const handleActivity = () => resetTimer()
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [pathname])

  return null
}
