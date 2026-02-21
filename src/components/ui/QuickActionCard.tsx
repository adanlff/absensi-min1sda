'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card } from './Card'

interface QuickActionCardProps {
  href: string
  label: string
  description: string
  icon: LucideIcon
  color?: 'blue' | 'emerald' | 'purple' | 'orange' | 'amber' | 'red'
}

export function QuickActionCard({ href, label, description, icon: Icon, color = 'blue' }: QuickActionCardProps) {
  const getColorStyles = () => {
    return 'bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-white'
  }

  return (
    <Link href={href} className="group block">
      <Card 
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="hover:border-primary/20 transition-all duration-300 h-full flex flex-col items-center text-center p-6 md:p-8 bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md"
      >
        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${getColorStyles()} group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4 flex-shrink-0`}>
          <Icon size={24} className="md:w-7 md:h-7" />
        </div>
        <div className="flex-1">
          <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
            {label}
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </Card>
    </Link>
  )
}
