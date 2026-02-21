'use client'

import React, { useState, useEffect } from 'react'

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Jakarta',
        })
      )
      setDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Jakarta',
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="relative">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="lg:hidden">
            <button
              title="Menu"
              type="button"
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{time}</div>
              <div className="text-sm text-gray-700">{date}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
