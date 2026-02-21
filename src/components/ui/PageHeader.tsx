'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  centered?: boolean
  className?: string
}

export function PageHeader({ title, description, children, centered = false, className = '' }: PageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 md:mb-12 ${centered ? 'text-center' : ''} ${className}`}
    >
      <div className={`flex flex-col ${centered ? 'items-center' : 'md:flex-row md:items-center md:justify-between'} gap-4 md:gap-6`}>
        <div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className={`${centered ? 'w-full' : 'w-full md:w-auto mt-4 md:mt-0'}`}>
            {children}
          </div>
        )}
      </div>
    </motion.div>
  )
}
