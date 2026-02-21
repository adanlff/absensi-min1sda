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
    blue: { bg: 'bg-primary/5', text: 'text-primary', border: 'hover:border-primary/20' },
    green: { bg: 'bg-primary/5', text: 'text-primary', border: 'hover:border-primary/20' },
    emerald: { bg: 'bg-primary/5', text: 'text-primary', border: 'hover:border-primary/20' },
    purple: { bg: 'bg-primary/5', text: 'text-primary', border: 'hover:border-primary/20' },
    orange: { bg: 'bg-primary/5', text: 'text-primary', border: 'hover:border-primary/20' },
    amber: { bg: 'bg-primary/5', text: 'text-primary', border: 'hover:border-primary/20' },
    red: { bg: 'bg-primary/5', text: 'text-primary', border: 'hover:border-primary/20' },
  }

  const styles = colorMap[color]

  return (
    <Card 
      whileHover={{ y: -4 }}
      transition={{ delay }}
      className="border-transparent hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">{label}</p>
          <p className="text-3xl lg:text-4xl font-black text-gray-900 leading-none mb-1">{value}</p>
          {subValue && (
            <div className="flex items-center mt-2">
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-2" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{subValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${styles.bg}`}>
          <Icon className={`h-6 w-6 lg:h-7 lg:w-7 ${styles.text}`} />
        </div>
      </div>
    </Card>
  )
}
