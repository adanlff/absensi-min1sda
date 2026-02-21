'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function Card({ children, className = '', noPadding = false, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-gray-200 dark:border-gray-700 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 ${!noPadding ? 'p-4 md:p-6 lg:p-8' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
