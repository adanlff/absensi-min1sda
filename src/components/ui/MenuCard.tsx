'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideIcon, ArrowRight } from 'lucide-react'
import { Card } from './Card'

interface MenuCardProps {
  href: string
  label: string
  description: string
  icon: LucideIcon
  color: 'blue' | 'emerald' | 'purple' | 'orange' | 'amber' | 'red'
}

export function MenuCard({ href, label, description, icon: Icon, color }: MenuCardProps) {
  const colorMap = {
    blue: 'blue',
    emerald: 'emerald',
    purple: 'purple',
    orange: 'orange',
    amber: 'amber',
    red: 'red'
  }

  const selectedColor = colorMap[color]

  return (
    <Link href={href} className="group block">
      <Card 
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="hover:border-primary/50 relative overflow-hidden h-full"
      >
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-600 group-hover:left-[100%] z-10" />
        <div className="flex items-start space-x-4 md:space-x-6">
          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-${selectedColor}-50 group-hover:bg-${selectedColor}-100 transition-colors`}>
            <Icon className={`h-5 w-5 md:h-6 md:w-6 text-${selectedColor}-600 group-hover:scale-110 transition-transform`} />
          </div>
          <div className="flex-1 relative z-20">
            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {label}
            </h4>
            <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">{description}</p>
            <div className="flex items-center text-primary font-semibold text-sm md:text-base">
              <span>Kelola Sekarang</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
