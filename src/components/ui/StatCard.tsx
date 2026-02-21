'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  subValue?: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'emerald' | 'amber'
  delay?: number
}

export function StatCard({ label, value, icon: Icon, subValue, color, delay = 0 }: StatCardProps) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'hover:border-blue-300', dot: 'bg-blue-400', accent: 'border-b-blue-400' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'hover:border-green-300', dot: 'bg-green-400', accent: 'border-b-green-400' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'hover:border-emerald-300', dot: 'bg-emerald-400', accent: 'border-b-emerald-400' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'hover:border-purple-300', dot: 'bg-purple-400', accent: 'border-b-purple-400' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'hover:border-orange-300', dot: 'bg-orange-400', accent: 'border-b-orange-400' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'hover:border-amber-300', dot: 'bg-amber-400', accent: 'border-b-amber-400' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'hover:border-red-300', dot: 'bg-red-400', accent: 'border-b-red-400' },
  }

  const styles = colorMap[color]

  return (
    <Card 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ delay }}
      className={`${styles.border} ${styles.accent}`}
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-600 mb-2 md:mb-3 tracking-wide uppercase">{label}</p>
          <p className={`text-2xl md:text-3xl lg:text-4xl font-extrabold ${styles.text} leading-none mb-1 md:mb-2`}>{value}</p>
          {subValue && (
            <div className="flex items-center">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-2 h-2 ${styles.dot} rounded-full mr-2`} 
              />
              <span className={`text-xs ${styles.text} font-semibold`}>{subValue}</span>
            </div>
          )}
        </div>
        <div className={`p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl border border-gray-100 ${styles.bg}`}>
          <Icon className={`h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 ${styles.text}`} />
        </div>
      </div>
    </Card>
  )
}
